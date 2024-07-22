package handlers

import (
	"ams/hash"
	"ams/jwt"
	"ams/logger"
	"ams/models"
	"ams/structs"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"net/mail"
	"syscall"

	"go.uber.org/zap"
)

func (h *HandlerRoutes) AuthHandler(w http.ResponseWriter, r *http.Request) {
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
	var req structs.IAuthRequest
	err = json.Unmarshal(body, &req)
	if err != nil {
		zapLog.Error("error unmarshal JSON",
			zap.Error(err),
		)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	if req.Email == "" {
		http.Error(w, "Please enter email.", http.StatusBadRequest)
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

	response := structs.IAuthResponse{
		Token: "",
	}

	var data structs.IAuthScanResult
	var employee models.Employee
	result := h.DB.Model(&employee).Select("employees.email, accounts.password, employees.id as employee_id, accounts.id as account_id").Joins("left join accounts on accounts.employee_id = employees.id").Where("email = ?", req.Email).Scan(&data)
	if result.Error != nil {
		zapLog.Error("error query",
			zap.Error(result.Error),
		)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	if result.RowsAffected > 0 {
		passwordCheck, _ := hash.ValidateData(req.Password, data.Password)
		if !passwordCheck {
			http.Error(w, "Invalid credentials.", http.StatusBadRequest)
			return
		}

		jwtPayload := structs.JwtSessionInfo{
			AccountId:  []byte(data.AccountId),
			EmployeeId: []byte(data.EmployeeId),
			Username:   req.Email,
		}

		token, err := jwt.GenerateToken(&jwtPayload)
		if err != nil {
			zapLog.Error("error generate token",
				zap.Error(result.Error),
			)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		response.Token = token
	} else {
		http.Error(w, "Invalid credentials.", http.StatusBadRequest)
		return
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
