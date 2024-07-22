package routes

import (
	"ams/api/handlers"
	"ams/api/middlewares"
	"net/http"

	"gorm.io/gorm"
)

func MainRoutes(mux *http.ServeMux, DB *gorm.DB) {
	handler := handlers.InitHandlerRoutes(DB)

	mux.HandleFunc("/", handler.IndexRequestHandler)

	mux.HandleFunc("GET /roles", middlewares.ValidateJWT(handler.GetRolesHandler))

	mux.HandleFunc("POST /auth", handler.AuthHandler)

	mux.HandleFunc("GET /employees", middlewares.ValidateJWT(handler.GetEmployeesHandler))
	mux.HandleFunc("POST /employees", middlewares.ValidateJWT(handler.CreateEmployeeHandler))
	mux.HandleFunc("PATCH /employees/{id}", middlewares.ValidateJWT(handler.PatchEmployeeHandler))
	mux.HandleFunc("DELETE /employees/{id}", middlewares.ValidateJWT(handler.DeleteEmployeeHandler))

	mux.HandleFunc("GET /students", middlewares.ValidateJWT(handler.GetStudentsHandler))
	mux.HandleFunc("POST /students", middlewares.ValidateJWT(handler.CreateStudentHandler))
	mux.HandleFunc("PATCH /students/{id}", middlewares.ValidateJWT(handler.PatchStudentHandler))
	mux.HandleFunc("DELETE /students/{id}", middlewares.ValidateJWT(handler.DeleteStudentHandler))

	mux.HandleFunc("GET /students/details/{id}", middlewares.ValidateJWT(handler.GetStudentDetailsHandler))
	mux.HandleFunc("POST /students/details/{id}", middlewares.ValidateJWT(handler.CreateStudentDetailsHandler))
	mux.HandleFunc("PATCH /students/details/{id}", middlewares.ValidateJWT(handler.PatchStudentDetailsHandler))
	mux.HandleFunc("DELETE /students/details/{id}", middlewares.ValidateJWT(handler.DeleteStudentDetailHandler))

	mux.HandleFunc("GET /me", middlewares.ValidateJWT(handler.GetMeHandler))

}
