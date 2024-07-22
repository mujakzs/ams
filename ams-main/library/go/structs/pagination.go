package structs

type IPaginatedResult struct {
	Data     interface{}
	PageInfo IPageInfo
}

type IPageInfo struct {
	TotalItems      uint `json:"totalItems"`
	HasNextPage     bool `json:"hasNextPage"`
	HasPreviousPage bool `json:"hasPreviousPage"`
	CurrentPage     uint `json:"currentPage"`
	TotalPages      uint `json:"totalPages"`
}
