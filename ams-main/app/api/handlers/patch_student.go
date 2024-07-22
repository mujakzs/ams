package handlers

import (
	"ams/logger"
	"ams/models"
	"ams/structs"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
	"syscall"

	"go.uber.org/zap"
)

func (h *HandlerRoutes) PatchStudentHandler(w http.ResponseWriter, r *http.Request) {
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
	idStr := strings.TrimPrefix(urlPath, "/students/")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// read request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		zapLog.Error("error read request body",
			zap.Error(err),
		)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	// parse request
	var req structs.IUpdateStudentInput
	err = json.Unmarshal(body, &req)
	if err != nil {
		zapLog.Error("error unmarshal JSON",
			zap.Error(err),
		)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	// validation
	if req.FirstName == "" {
		http.Error(w, "Please enter first name.", http.StatusBadRequest)
		return
	}
	if req.LastName == "" {
		http.Error(w, "Please enter last name.", http.StatusBadRequest)
		return
	}
	if req.Gender == "" {
		http.Error(w, "Please enter gender.", http.StatusBadRequest)
		return
	}

	// check data
	var student models.Student

	// check employee exist
	checkStudent := h.DB.Where("LOWER(first_name) = ? AND LOWER(last_name) = ? AND id <> ?", strings.ToLower(req.FirstName), strings.ToLower(req.LastName), uint(id)).Find(&student)

	if checkStudent.RowsAffected > 0 {
		http.Error(w, "Student already exist.", http.StatusBadRequest)
		return
	}

	// create transaction
	tx := h.DB.Begin()
	isTransactionSuccess := true

	studentInput := models.Student{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Gender:    req.Gender,
	}

	if err := tx.Select("first_name", "last_name", "gender").Where("id = ?", uint(id)).Updates(studentInput).Error; err != nil {
		tx.Rollback()
		isTransactionSuccess = false

		zapLog.Error("error patch student",
			zap.Error(err),
		)
	}

	if !isTransactionSuccess {
		http.Error(w, "Error patch student.", http.StatusInternalServerError)
		return
	}

	tx.Commit()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNoContent)
}
