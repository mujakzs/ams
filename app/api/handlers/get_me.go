package handlers

import (
	"ams/logger"
	"ams/models"
	"ams/structs"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"syscall"

	"go.uber.org/zap"
)

func (h *HandlerRoutes) GetMeHandler(w http.ResponseWriter, r *http.Request) {
	l := logger.LoggerConfig()
	zapLog, _ := l.Build()

	defer func() {
		if err := zapLog.Sync(); err != nil && !errors.Is(err, syscall.EINVAL) {
			log.Fatalf("error closing the logger. %v\n", err)
		}
	}()

	// employee id from jwt middleware
	employeeId := r.Header.Get("employeeId")
	if employeeId == "" {
		http.Error(w, "No JWT.", http.StatusInternalServerError)
		return
	}

	var employee models.Employee
	err := h.DB.First(&employee, "id = ?", employeeId).Error
	if err != nil {
		zapLog.Error("error get employee",
			zap.Error(err),
		)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := structs.IGetMeResponse{
		FirstName: employee.FirstName,
		LastName:  employee.LastName,
		Email:     employee.Email,
	}

	j, err := json.Marshal(response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(j)
}
