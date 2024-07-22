package models

import "gorm.io/gorm"

type Student struct {
	gorm.Model
	FirstName     string `gorm:"not null"`
	LastName      string `gorm:"not null"`
	Gender        string `gorm:"not null"`
	StudentDetail []StudentDetail
}

type StudentDetail struct {
	gorm.Model
	StudentId           uint `gorm:"not null"`
	HeightStanding      float64
	EyeHeight           float64
	ShoulderHeight      float64
	ElbowHeight         float64
	KneeHeight          float64
	SittingHeight       float64
	VerticalReachHeight float64
	Weight              float64
	Bmi                 float64
}
