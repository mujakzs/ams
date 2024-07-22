package main

import (
	"ams/api/routes"
	"ams/constants"
	"ams/db"
	"ams/env"
	"ams/logger"
	"errors"
	"fmt"
	"log"
	"net/http"
	"syscall"

	"go.uber.org/zap"
	"gorm.io/gorm"
)

var (
	DB *gorm.DB
)

func init() {
	var err error
	DB, err = db.DatabaseConnect()
	if err != nil {
		log.Fatalf("error connect to db. %v\n", err)
	}
}

func main() {
	l := logger.LoggerConfig()
	zapLog, _ := l.Build()
	ports := constants.Port()

	defer func() {
		if err := zapLog.Sync(); err != nil && !errors.Is(err, syscall.EINVAL) {
			log.Fatalf("error closing the logger. %v\n", err)
		}
	}()

	portString := fmt.Sprintf(":%d", ports.MainApi)

	port := env.GetEnv("PORT", portString)
	host := env.GetEnv("HOST", "localhost")
	env := env.GetEnv("ENV", "dev")

	mux := http.NewServeMux()
	routes.MainRoutes(mux, DB)

	sandboxLink := fmt.Sprintf("http://%s%s", host, port)
	zapLog.Info("running at 🚀⚙️",
		zap.String("link", sandboxLink),
		zap.String("env", env),
	)

	handler := corsMiddleware(mux)
	if err := http.ListenAndServe(port, handler); err != nil && err != http.ErrServerClosed {
		zapLog.Fatal("error serve api",
			zap.String("port", port),
			zap.Error(err),
		)
	}

}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Add CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the next handler
		next.ServeHTTP(w, r)
	})
}
