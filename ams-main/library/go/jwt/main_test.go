package jwt

import (
	"ams/structs"
	"crypto/rand"
	"reflect"
	"testing"
	"time"

	"github.com/go-faker/faker/v4"
)

func helperGenerateLoginInfo() (*structs.JwtSessionInfo, error) {
	accountId := make([]byte, 1)

	if _, err := rand.Read(accountId); err != nil {
		return nil, err
	}

	employeeId := make([]byte, 1)
	if _, err := rand.Read(employeeId); err != nil {
		return nil, err
	}

	return &structs.JwtSessionInfo{
		AccountId:  accountId,
		EmployeeId: employeeId,
		Username:   faker.Username(),
	}, nil
}

func TestGenerateToken(t *testing.T) {
	loginInfo, err := helperGenerateLoginInfo()

	if err != nil {
		t.Error("FAIL: Helper generate login info.")

	}

	token, err := GenerateToken(loginInfo)

	if err != nil {
		t.Error("FAIL: GenerateToken func.")

	}

	if reflect.TypeOf(token).Kind() != reflect.String {
		t.Errorf("FAIL: Unexpected token type. Expected: %s, Got: %s", reflect.String, reflect.TypeOf(token))
	}
}

func TestGenerateRefreshToken(t *testing.T) {
	loginInfo, err := helperGenerateLoginInfo()

	if err != nil {
		t.Error("FAIL: Helper generate login info.")

	}

	token, err := GenerateRefreshToken(loginInfo)

	if err != nil {
		t.Error("FAIL: GenerateRefreshToken func.")

	}

	if reflect.TypeOf(token).Kind() != reflect.String {
		t.Errorf("FAIL: Unexpected token type. Expected: %s, Got: %s", reflect.String, reflect.TypeOf(token))
	}
}

func TestParseToken(t *testing.T) {
	loginInfo, err := helperGenerateLoginInfo()
	if err != nil {
		t.Error("FAIL: Helper generate login info.")

	}

	token, err := GenerateToken(loginInfo)

	if err != nil {
		t.Error("FAIL: GenerateToken func.")

	}

	if reflect.TypeOf(token).Kind() != reflect.String {
		t.Errorf("FAIL: Unexpected token type. Expected: %s, Got: %s", reflect.String, reflect.TypeOf(token))
	}

	info, err := ParseToken(token)

	if err != nil {
		t.Error("FAIL: ParseToken func.")

	}

	expected := &structs.JwtSessionParse{
		AccountId:  loginInfo.AccountId,
		EmployeeId: loginInfo.EmployeeId,
		Username:   loginInfo.Username,
		Iat:        time.Now().UnixMilli(),
	}

	if !reflect.DeepEqual(info, expected) {
		t.Errorf("Unexpected result. Expected: %+v, Got: %+v", expected, info)
	}

}
