package db

import (
	"ams/env"
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func DatabaseConnect() (*gorm.DB, error) {
	uri := env.GetEnv("DB_URL", "")
	db, err := gorm.Open(postgres.Open(uri), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return db, nil
}

func CreateDatabase() error {
	defaultUri := env.GetEnv("DEFAULT_DB_URL", "")
	dbName := env.GetEnv("DB_NAME", "")

	var err error
	db, err := gorm.Open(postgres.Open(defaultUri), &gorm.Config{})
	if err != nil {
		return err
	}
	createDb := fmt.Sprintf("CREATE DATABASE %s;", dbName)
	db.Exec(createDb)

	return nil
}
