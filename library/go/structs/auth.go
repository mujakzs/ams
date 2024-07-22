package structs

type IAuthScanResult struct {
	Email      string `json:"email"`
	Password   string `json:"password"`
	AccountId  string `json:"account_id"`
	EmployeeId string `json:"employee_id"`
}
