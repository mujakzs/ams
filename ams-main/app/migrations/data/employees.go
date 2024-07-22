package data

import (
	"ams/models"

	"github.com/go-faker/faker/v4"
)

func InitialEmployees() []*models.Employee {
	var data []*models.Employee
	count := 10
	for i := 0; i < count; i++ {
		tmp := models.Employee{
			FirstName: faker.FirstName(),
			LastName:  faker.LastName(),
			Email:     faker.Email(),
		}

		data = append(data, &tmp)
	}

	defaultUser := models.Employee{
		FirstName: "Notre",
		LastName:  "Dame",
		Email:     "admin@gmail.com",
	}

	data = append(data, &defaultUser)

	return data
}
