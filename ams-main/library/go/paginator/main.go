package paginator

import (
	"ams/structs"
	"fmt"
	"math"
	"reflect"
	"strings"

	"gorm.io/gorm"
)

func GetPaginatedData(db *gorm.DB, page uint, limit uint, model interface{}, filter *structs.IPaginationFilter) (structs.IPaginatedResult, error) {
	offset := (page - 1) * limit

	// model
	modelValue := reflect.Indirect(reflect.ValueOf(model))
	modelType := modelValue.Type().Elem()

	// filter
	filterLike := "%" + strings.ToLower(filter.Filter) + "%"
	var filterLikes []interface{}
	var placeholders []string

	for _, s := range filter.Fields {
		placeholders = append(placeholders, fmt.Sprintf("LOWER(%s) LIKE ?", s))
		filterLikes = append(filterLikes, filterLike)

	}

	whereStatement := strings.Join(placeholders, " OR ")

	var totalRecords int64
	err := db.Model(reflect.New(modelType).Interface()).Where(whereStatement, filterLikes...).Count(&totalRecords).Error
	if err != nil {
		return structs.IPaginatedResult{}, err
	}

	totalPages := uint(math.Ceil(float64(totalRecords) / float64(limit)))

	stmt := db.Model(reflect.New(modelType).Interface()).Where(whereStatement, filterLikes...).Offset(int(offset)).Limit(int(limit))
	err = stmt.Find(model).Error
	if err != nil {
		return structs.IPaginatedResult{}, err
	}

	pageInfo := structs.IPageInfo{
		TotalItems:      uint(totalRecords),
		HasNextPage:     page < totalPages,
		HasPreviousPage: page > 1,
		CurrentPage:     page,
		TotalPages:      totalPages,
	}

	return structs.IPaginatedResult{
		Data:     model,
		PageInfo: pageInfo,
	}, nil
}
