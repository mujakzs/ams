package hash

import (
	"errors"

	"golang.org/x/crypto/bcrypt"
)

func Encrypt(str string) (string, error) {
	hashed, _ := bcrypt.GenerateFromPassword([]byte(str), bcrypt.DefaultCost)

	return string(hashed), nil
}

func ValidateData(data string, hashed string) (bool, error) {
	err := bcrypt.CompareHashAndPassword([]byte(hashed), []byte(data))
	if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
		return false, nil
	}
	return err == nil, err
}
