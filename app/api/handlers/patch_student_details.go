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

func (h *HandlerRoutes) PatchStudentDetailsHandler(w http.ResponseWriter, r *http.Request) {
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
	idStr := strings.TrimPrefix(urlPath, "/students/details/")
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
	var req structs.IStudentDetailsInput
	err = json.Unmarshal(body, &req)
	if err != nil {
		zapLog.Error("error unmarshal JSON",
			zap.Error(err),
		)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	// validation
	// validation
	if req.HeightStanding <= 0 {
		http.Error(w, "Please enter height standing.", http.StatusBadRequest)
		return
	}
	if req.EyeHeight <= 0 {
		http.Error(w, "Please enter eye height.", http.StatusBadRequest)
		return
	}
	if req.ShoulderHeight <= 0 {
		http.Error(w, "Please enter shoulder height.", http.StatusBadRequest)
		return
	}
	if req.ElbowHeight <= 0 {
		http.Error(w, "Please enter elbow height.", http.StatusBadRequest)
		return
	}
	if req.KneeHeight <= 0 {
		http.Error(w, "Please enter knee height.", http.StatusBadRequest)
		return
	}
	if req.SittingHeight <= 0 {
		http.Error(w, "Please enter sitting height.", http.StatusBadRequest)
		return
	}
	if req.VerticalReachHeight <= 0 {
		http.Error(w, "Please enter vertical reach height.", http.StatusBadRequest)
		return
	}
	if req.Weight <= 0 {
		http.Error(w, "Please enter weight.", http.StatusBadRequest)
		return
	}
	if req.Bmi <= 0 {
		http.Error(w, "Please enter BMI.", http.StatusBadRequest)
		return
	}

	// create transaction
	tx := h.DB.Begin()
	isTransactionSuccess := true

	studentInput := models.StudentDetail{
		HeightStanding:      req.HeightStanding,
		EyeHeight:           req.EyeHeight,
		ShoulderHeight:      req.ShoulderHeight,
		ElbowHeight:         req.ElbowHeight,
		KneeHeight:          req.KneeHeight,
		SittingHeight:       req.SittingHeight,
		VerticalReachHeight: req.VerticalReachHeight,
		Weight:              req.Weight,
		Bmi:                 req.Bmi,
	}

	if err := tx.Select("height_standing", "eye_height", "shoulder_height", "elbow_height", "knee_height", "sitting_height", "vertical_reach_height", "weight", "bmi").Where("id = ?", uint(id)).Updates(studentInput).Error; err != nil {
		tx.Rollback()
		isTransactionSuccess = false

		zapLog.Error("error patch student detail",
			zap.Error(err),
		)
	}

	if !isTransactionSuccess {
		http.Error(w, "Error patch student detail.", http.StatusInternalServerError)
		return
	}

	tx.Commit()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNoContent)
}
