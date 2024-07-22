package middlewares

import (
	"ams/jwt"
	"net/http"
	"strings"
	"time"
)

func ValidateJWT(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		authHeader := r.Header.Get("Authorization")

		if authHeader == "" {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		session, err := jwt.ParseToken(tokenString)
		if err != nil {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		expTime := time.Unix(int64(session.ExpiresAt), 0)
		expired := time.Now().After(expTime)
		if expired {
			http.Error(w, "Forbidden. Token Expired.", http.StatusForbidden)
			return
		}

		// append employee id
		r.Header.Set("employeeId", string(session.EmployeeId))

		next.ServeHTTP(w, r)
	}
}
