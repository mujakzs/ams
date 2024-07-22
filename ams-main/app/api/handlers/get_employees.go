package handlers

import (
	"ams/logger"
	"ams/paginator"
	"ams/structs"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"
	"syscall"
)

func (h *HandlerRoutes) GetEmployeesHandler(w http.ResponseWriter, r *http.Request) {
	l := logger.LoggerConfig()
	zapLog, _ := l.Build()

	defer func() {
		if err := zapLog.Sync(); err != nil && !errors.Is(err, syscall.EINVAL) {
			log.Fatalf("error closing the logger. %v\n", err)
		}
	}()

	var employees []structs.Employee

	// default filter
	page := uint(1)
	limit := uint(5)
	name := ""
	if pageStr := r.URL.Query().Get("page"); pageStr != "" {
		parsedPage, err := strconv.Atoi(pageStr)
		if err == nil {
			page = uint(parsedPage)
		}
	}
	if limitStr := r.URL.Query().Get("limit"); limitStr != "" {
		parsedLimit, err := strconv.Atoi(limitStr)
		if err == nil {
			limit = uint(parsedLimit)
		}
	}
	if nameStr := r.URL.Query().Get("name"); nameStr != "" {
		name = nameStr
	}

	filter := structs.IPaginationFilter{
		Filter: name,
		Fields: []string{"last_name", "first_name", "email"},
	}
	res, err := paginator.GetPaginatedData(h.DB, page, limit, &employees, &filter)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := structs.IGetEmployeesResponse{
		Data:     employees,
		PageInfo: res.PageInfo,
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
