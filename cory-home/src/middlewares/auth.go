package middlewares

import (
	"os"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
)

var secretKey = os.Getenv("ENCRYPTION_SECRET")

type ClaimsWithScope struct {
	jwt.StandardClaims
	Scope string
}

func IsAuthenticated(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")
	token, err := jwt.ParseWithClaims(cookie, &ClaimsWithScope{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil || !token.Valid {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "Unauthenticated",
		})
	}

	payload := token.Claims.(*ClaimsWithScope)

	if payload.Scope != "admin" {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "Unauthorized",
		})
	}

	return c.Next()
}

func GenerateJWT(id uint, scope string) (string, error) {
	payload := ClaimsWithScope{}
	payload.Subject = strconv.Itoa(int(id))
	payload.ExpiresAt = time.Now().Add(time.Hour * 24).Unix()
	payload.Scope = scope

	return jwt.NewWithClaims(jwt.SigningMethodHS256, payload).SignedString([]byte(secretKey))
}

func GetUserId(c *fiber.Ctx) (uint, error) {
	cookie := c.Cookies("jwt")
	token, err := jwt.ParseWithClaims(cookie, &ClaimsWithScope{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil {
		return 0, err
	}

	payload := token.Claims.(*ClaimsWithScope)

	id, _ := strconv.Atoi(payload.Subject)

	return uint(id), nil
}
