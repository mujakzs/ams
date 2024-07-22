package hash

import (
	"testing"
)

func TestEncryptAndValidateData(t *testing.T) {
	str := "justanyword332"
	hashed, err := Encrypt(str)
	if err != nil {
		t.Errorf("FAIL: Error occurred during encryption: %v", err)
	}

	match, err := ValidateData(str, hashed)
	if err != nil {
		t.Errorf("FAIL: Error occurred during data validation: %v", err)
	}

	if !match {
		t.Error("FAIL: Data validation failed for correct data")
	}

	invalid := "anotheranyword112"
	match, err = ValidateData(invalid, hashed)
	if err != nil {
		t.Errorf("FAIL: Error occurred during data validation: %v", err)
	}

	if match {
		t.Error("FAIL: Data validation passed for incorrect data")
	}
}
