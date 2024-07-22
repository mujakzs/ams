package structs

import "github.com/golang-jwt/jwt/v5"

type JwtSessionInfo struct {
	AccountId  []byte `json:"accountId"`
	EmployeeId []byte `json:"employeeId"`
	Username   string `json:"username"`
}

type JwtSessionParse struct {
	jwt.RegisteredClaims
	AccountId  []byte `json:"accountId"`
	EmployeeId []byte `json:"employeeId"`
	Username   string `json:"username"`
	Iat        int64  `json:"iat"`
	ExpiresAt  int64  `json:"exp"`
}
