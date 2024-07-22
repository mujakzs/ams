package handlers

import (
	"ams/logger"
	"ams/models"
	"errors"
	"log"
	"net/http"
	"strconv"
	"strings"
	"syscall"

	"go.uber.org/zap"
)

func (h *HandlerRoutes) DeleteEmployeeHandler(w http.ResponseWriter, r *http.Request) {
	l := logger.LoggerConfig()
	zapLog, _ := l.Build()

	defer func() {
		err := r.Body.Close()
		if err != nil {
			log.Fatalf("error close req body. %v\n", err)
		}
	}()

	defer func() {
		if err := zapLog.Sync(); err != nil && !errors.Is(err, syscall.EINVAL) {
			log.Fatalf("error closing the logger. %v\n", err)
		}
	}()

	// get id
	urlPath := r.URL.Path
	idStr := strings.TrimPrefix(urlPath, "/employees/")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// create transaction
	tx := h.DB.Begin()
	isTransactionSuccess := true

	var employee models.Employee
	var account models.Account

	if err := tx.Delete(&employee, uint(id)).Error; err != nil {
		tx.Rollback()
		isTransactionSuccess = false

		zapLog.Error("error delete employee",
			zap.Error(err),
		)
	}

	if err := tx.Where("employee_id = ?", uint(id)).Delete(&account).Error; err != nil {
		tx.Rollback()
		isTransactionSuccess = false

		zapLog.Error("error delete account",
			zap.Error(err),
		)
	}

	if !isTransactionSuccess {
		http.Error(w, "Error delete employee.", http.StatusInternalServerError)
		return
	}

	tx.Commit()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNoContent)
}
