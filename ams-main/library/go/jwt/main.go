package jwt

import (
	"ams/env"
	"ams/structs"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var secret = []byte(env.GetEnv("TOKEN_PW", "mfmsosjwpxwszyzknnktjdvwqjspsqpw"))
var refreshSecret = []byte(env.GetEnv("REFRESH_TOKEN_PW", "jnuirenbrwkrlkwemkwenvowenvewlkw"))

func GenerateToken(a *structs.JwtSessionInfo) (string, error) {

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"accountId":  a.AccountId,
		"employeeId": a.EmployeeId,
		"username":   a.Username,
		"iat":        time.Now().UnixMilli(),
		"exp":        time.Now().Add(time.Minute * 30).Unix(),
	})

	tokenString, err := token.SignedString(secret)

	return tokenString, err
}

func GenerateRefreshToken(a *structs.JwtSessionInfo) (string, error) {

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"accountId":  a.AccountId,
		"employeeId": a.EmployeeId,
		"username":   a.Username,
		"iat":        time.Now().UnixMilli(),
		"exp":        time.Now().Add(time.Minute * 30).Unix(),
	})

	tokenString, err := token.SignedString(refreshSecret)

	return tokenString, err
}

func ParseToken(tokenString string) (*structs.JwtSessionParse, error) {
	var claim structs.JwtSessionParse

	_, err := jwt.ParseWithClaims(tokenString, &claim, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	if err != nil {
		return nil, err
	}

	return &claim, nil
}
