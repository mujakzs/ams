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

func (h *HandlerRoutes) GetRolesHandler(w http.ResponseWriter, r *http.Request) {
	l := logger.LoggerConfig()
	zapLog, _ := l.Build()

	defer func() {
		if err := zapLog.Sync(); err != nil && !errors.Is(err, syscall.EINVAL) {
			log.Fatalf("error closing the logger. %v\n", err)
		}
	}()

	var roles []structs.IRoleGet
	response := structs.IGetRoleResponse{
		Data: roles,
	}

	result := h.DB.Table("roles").Select("id,role_name,updated_at").Find(&roles)
	if result.RowsAffected > 0 {
		response.Data = roles
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
