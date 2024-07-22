package handlers

import (
	"ams/logger"
	"ams/structs"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"syscall"
)

func (h *HandlerRoutes) IndexRequestHandler(w http.ResponseWriter, r *http.Request) {
	l := logger.LoggerConfig()
	zapLog, _ := l.Build()

	defer func() {
		if err := zapLog.Sync(); err != nil && !errors.Is(err, syscall.EINVAL) {
			log.Fatalf("error closing the logger. %v\n", err)
		}
	}()

	bodyBytes := structs.IResponse{
		Message: "Welcome AMS api.",
	}

	j, err := json.Marshal(bodyBytes)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(j)

}
