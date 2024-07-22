package structs

import (
	"ams/models"

	"gorm.io/gorm"
)

type Student struct {
	gorm.Model
	FirstName string `gorm:"not null"`
	LastName  string `gorm:"not null"`
	Gender    string `gorm:"not null"`
}

type ICreateStudentInput struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Gender    string `json:"gender"`
}

type IUpdateStudentInput struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Gender    string `json:"gender"`
}

type IStudentDetailsInput struct {
	HeightStanding      float64 `json:"heightStanding"`
	EyeHeight           float64 `json:"eyeHeight"`
	ShoulderHeight      float64 `json:"shoulderHeight"`
	ElbowHeight         float64 `json:"elbowHeight"`
	KneeHeight          float64 `json:"kneeHeight"`
	SittingHeight       float64 `json:"sittingHeight"`
	VerticalReachHeight float64 `json:"verticalReachHeight"`
	Weight              float64 `json:"weight"`
	Bmi                 float64 `json:"bmi"`
}

type IGetStudentDetailsResponse struct {
	Student models.Student         `json:"student"`
	Data    []models.StudentDetail `json:"data"`
}
