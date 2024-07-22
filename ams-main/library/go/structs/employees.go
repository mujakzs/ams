package structs

import "gorm.io/gorm"

type Employee struct {
	gorm.Model
	FirstName string `gorm:"not null"`
	LastName  string `gorm:"not null"`
	Email     string `gorm:"unique;not null"`
}

type ICreateEmployeeInput struct {
	FirstName  string `json:"firstName"`
	LastName   string `json:"lastName"`
	Email      string `json:"email"`
	Password   string `json:"password"`
	RePassword string `json:"rePassword"`
	RoleId     uint   `json:"roleId"`
}

type IUpdateEmployeeInput struct {
	FirstName  string `json:"firstName"`
	LastName   string `json:"lastName"`
	Email      string `json:"email"`
	Password   string `json:"password"`
	RePassword string `json:"rePassword"`
	RoleId     uint   `json:"roleId"`
}
