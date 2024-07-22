package main

import (
	"ams/db"
	"ams/migrations/data"
	"ams/models"
	"log"
)

func init() {
	var err error = db.CreateDatabase()
	if err != nil {
		log.Fatalf("error create database %v\n", err)
	}
}

func main() {
	db, err := db.DatabaseConnect()
	if err != nil {
		log.Fatalf("error connect database %v\n", err)
	}

	err = db.AutoMigrate(&models.Employee{}, &models.Role{}, &models.Account{}, &models.Student{}, &models.StudentDetail{})
	if err != nil {
		log.Fatalf("error migrate schema %v\n", err)
	}

	tx := db.Begin()

	employees := data.InitialEmployees()
	roles := data.InitialRoles()
	students := data.InitialStudents()

	if err := tx.Create(employees).Error; err != nil {
		tx.Rollback()
		log.Fatalf("error initial employee %v\n", err)
	}

	if err := tx.Create(roles).Error; err != nil {
		tx.Rollback()
		log.Fatalf("error initial roles %v\n", err)
	}

	if err := tx.Create(students).Error; err != nil {
		tx.Rollback()
		log.Fatalf("error initial roles %v\n", err)
	}

	accounts := data.InitialAccounts(employees, tx)

	if err := tx.Create(accounts).Error; err != nil {
		tx.Rollback()
		log.Fatalf("error initial accounts %v\n", err)
	}

	tx.Commit()
}
