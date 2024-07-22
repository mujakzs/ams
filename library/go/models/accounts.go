package models

import "gorm.io/gorm"

type Account struct {
	gorm.Model
	EmployeeID uint   `gorm:"unique;not null"`
	RoleId     uint   `gorm:"not null"`
	Password   string `gorm:"not null"`
}
