package handlers

import "gorm.io/gorm"

type HandlerRoutes struct {
	DB *gorm.DB
}

func InitHandlerRoutes(db *gorm.DB) HandlerRoutes {
	return HandlerRoutes{
		DB: db,
	}
}
