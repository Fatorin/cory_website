package controllers

import (
	"cory-home/src/database"
	"cory-home/src/middlewares"
	"cory-home/src/models"
	"time"

	"github.com/gofiber/fiber/v2"
)

func Login(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User

	database.DB.Where("username = ?", data["username"]).First(&user)

	if user.Id == 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Invalid Certificates",
		})
	}

	if err := user.ComparePassword(data["password"]); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Invalid Certificates",
		})
	}

	scope := "admin"

	token, err := middlewares.GenerateJWT(user.Id, scope)

	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Invalid Certificates",
		})
	}

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func User(c *fiber.Ctx) error {
	id, _ := middlewares.GetUserId(c)

	var user models.User

	database.DB.Where("id = ?", id).First(&user)

	return c.JSON(user)
}

func Logout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func UpdateInfo(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	id, _ := middlewares.GetUserId(c)

	user := models.User{
		Username: data["user_name"],
		Email:    data["email"],
	}

	user.Id = id

	database.DB.Model(models.User{}).Updates(&user)

	return c.JSON(user)
}

func UpdatePassword(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	if len(data["password"]) < 6 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "password less than six length.",
		})
	}

	if data["password"] != data["password_confirm"] {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "password not match",
		})
	}

	id, _ := middlewares.GetUserId(c)

	user := models.User{}

	user.Id = id

	user.SetPassword(data["password"])

	database.DB.Model(models.User{}).Updates(&user)

	return c.JSON(user)
}
