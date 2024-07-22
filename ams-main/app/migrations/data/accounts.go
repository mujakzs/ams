package data

import (
	"ams/hash"
	"ams/models"
	"log"

	"gorm.io/gorm"
)

func InitialAccounts(employees []*models.Employee, tx *gorm.DB) []*models.Account {
	// fetch employees
	for _, e := range employees {
		if err := tx.First(&e, "email = ?", e.Email).Error; err != nil {
			tx.Rollback()
			log.Fatalf("error fetch inserted employee %v\n", err)
		}
	}

	// fetch role admin
	var role *models.Role
	if err := tx.First(&role, "role_name = ?", "admin").Error; err != nil {
		tx.Rollback()
		log.Fatalf("error fetch inserted role %v\n", err)
	}

	var data []*models.Account
	for _, e := range employees {
		pw, err := hash.Encrypt("admin")
		if err != nil {
			tx.Rollback()
			log.Fatalf("error hash password %v\n", err)

		}
		tmp := models.Account{
			EmployeeID: e.ID,
			Password:   pw,
			RoleId:     role.ID,
		}

		data = append(data, &tmp)
	}

	return data
}
