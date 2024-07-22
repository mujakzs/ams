package handlers

import (
	"ams/hash"
	"ams/logger"
	"ams/models"
	"ams/structs"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"net/mail"
	"strings"
	"syscall"

	"go.uber.org/zap"
)

func (h *HandlerRoutes) CreateEmployeeHandler(w http.ResponseWriter, r *http.Request) {
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
	var req structs.ICreateEmployeeInput
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
	if _, err := mail.ParseAddress(req.Email); err != nil {
		http.Error(w, "Invalid email.", http.StatusBadRequest)
		return
	}
	if req.Password == "" {
		http.Error(w, "Please enter password.", http.StatusBadRequest)
		return
	}
	if req.RePassword == "" {
		http.Error(w, "Please reenter password.", http.StatusBadRequest)
		return
	}
	if req.RePassword != req.Password {
		http.Error(w, "Password does not match.", http.StatusBadRequest)
		return
	}

	// check data
	var employee models.Employee

	// check employee exist
	checkEmployee := h.DB.Where("LOWER(first_name) = ? AND LOWER(last_name) = ?", strings.ToLower(req.FirstName), strings.ToLower(req.LastName)).Find(&employee)

	if checkEmployee.RowsAffected > 0 {
		http.Error(w, "Employee already exist.", http.StatusBadRequest)
		return
	}

	// check email
	checkEmail := h.DB.Where("LOWER(email) = ?", strings.ToLower(req.Email)).Find(&employee)

	if checkEmail.RowsAffected > 0 {
		http.Error(w, "Email already exist.", http.StatusBadRequest)
		return
	}

	// hash password
	hashPw, err := hash.Encrypt(req.Password)
	if err != nil {
		http.Error(w, "Error hashing password.", http.StatusInternalServerError)
		return
	}

	// create transaction
	tx := h.DB.Begin()
	isTransactionSuccess := true

	employeeInput := models.Employee{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Email:     req.Email,
	}
	accountInput := models.Account{
		RoleId:   req.RoleId,
		Password: hashPw,
		// to append employee id
	}

	if err := tx.Create(&employeeInput).Error; err != nil {
		tx.Rollback()
		isTransactionSuccess = false

		zapLog.Error("error create employee",
			zap.Error(err),
		)

	}

	// append employee id
	accountInput.EmployeeID = employeeInput.ID

	if err := tx.Create(&accountInput).Error; err != nil {
		tx.Rollback()
		isTransactionSuccess = false

		zapLog.Error("error create account",
			zap.Error(err),
		)

	}

	if !isTransactionSuccess {
		http.Error(w, "Error create employee.", http.StatusInternalServerError)
		return
	}

	tx.Commit()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
}
