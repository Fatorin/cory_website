package controllers

import (
	"github.com/gofiber/fiber/v2"
)

func Components(c *fiber.Ctx) error {
	c.Status(fiber.StatusBadRequest)
	return c.JSON(fiber.Map{
		"message": "not imp",
	})
}

func AddComponent(c *fiber.Ctx) error {
	//Upload new image(with new path), remove old.
	c.Status(fiber.StatusBadRequest)
	return c.JSON(fiber.Map{
		"message": "not imp",
	})
}

func UpdateComponent(c *fiber.Ctx) error {
	//Upload new image(with new path), remove old.
	c.Status(fiber.StatusBadRequest)
	return c.JSON(fiber.Map{
		"message": "not imp",
	})
}

func DeleteComponent(c *fiber.Ctx) error {
	//remove path and db data.
	c.Status(fiber.StatusBadRequest)
	return c.JSON(fiber.Map{
		"message": "not imp",
	})
}
