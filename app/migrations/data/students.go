package data

import (
	"ams/models"

	"github.com/go-faker/faker/v4"
)

func InitialStudents() []*models.Student {
	var data []*models.Student
	count := 10
	genders := []string{"Male", "Female"}
	for i := 0; i < count; i++ {
		tmp := models.Student{
			FirstName: faker.FirstName(),
			LastName:  faker.LastName(),
			Gender:    genders[i%2],
		}

		data = append(data, &tmp)
	}

	return data
}
