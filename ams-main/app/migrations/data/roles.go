package data

import "ams/models"

func InitialRoles() []*models.Role {
	data := []*models.Role{
		{RoleName: "admin"},
		{RoleName: "standard"},
	}

	return data
}
