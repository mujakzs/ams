package structs

type IResponse struct {
	Message string `json:"message"`
}

type IGetRoleResponse struct {
	Data []IRoleGet `json:"data"`
}

type IAuthResponse struct {
	Token string `json:"token"`
}

type IGetEmployeesResponse struct {
	Data     []Employee `json:"data"`
	PageInfo IPageInfo  `json:"pageInfo"`
}

type IGetStudentsResponse struct {
	Data     []Student `json:"data"`
	PageInfo IPageInfo `json:"pageInfo"`
}

type IGetMeResponse struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
}
