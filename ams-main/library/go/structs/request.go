package structs

type IAuthRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type IPaginationFilter struct {
	Filter string   `json:"filter"`
	Fields []string `json:"fields"`
}
