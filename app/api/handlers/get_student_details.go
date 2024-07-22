package handlers

import (
	"ams/logger"
	"ams/models"
	"ams/structs"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"
	"strings"
	"syscall"

	"go.uber.org/zap"
)

func (h *HandlerRoutes) GetStudentDetailsHandler(w http.ResponseWriter, r *http.Request) {
	l := logger.LoggerConfig()
	zapLog, _ := l.Build()

	defer func() {
		if err := zapLog.Sync(); err != nil && !errors.Is(err, syscall.EINVAL) {
			log.Fatalf("error closing the logger. %v\n", err)
		}
	}()

	// get id
	urlPath := r.URL.Path
	idStr := strings.TrimPrefix(urlPath, "/students/details/")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// default filter
	limit := uint(5)
	if limitStr := r.URL.Query().Get("limit"); limitStr != "" {
		parsedLimit, err := strconv.Atoi(limitStr)
		if err == nil {
			limit = uint(parsedLimit)
		}
	}

	var details []models.StudentDetail
	var student models.Student

	if err := h.DB.Where("student_id = ?", uint(id)).Order("created_at desc").Limit(int(limit)).Find(&details).Error; err != nil {
		zapLog.Error("error query",
			zap.Error(err),
		)
		http.Error(w, "Server Error", http.StatusInternalServerError)
		return
	}

	if err := h.DB.Where("id = ?", uint(id)).Find(&student).Error; err != nil {
		zapLog.Error("error query",
			zap.Error(err),
		)
		http.Error(w, "Server Error", http.StatusInternalServerError)
		return
	}

	response := structs.IGetStudentDetailsResponse{
		Student: student,
		Data:    details,
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
