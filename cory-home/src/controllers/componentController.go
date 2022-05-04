package controllers

import (
	"context"
	"cory-home/src/database"
	"cory-home/src/models"
	"cory-home/src/util"
	"encoding/json"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func Components(c *fiber.Ctx) error {
	typeParam := c.Query("type")

	if typeParam == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "please fill query param.",
		})
	}

	typeId, _ := strconv.Atoi(typeParam)

	var component models.Component
	var ctx = context.Background()

	database.DB.Where("`type` = ?", typeParam).Find(&component)

	result, err := database.Cache.Get(ctx, createComponentRedisKey(uint(typeId))).Result()
	if err != nil {
		bytes, err := json.Marshal(component)

		if err != nil {
			panic(err)
		}

		err = database.Cache.Set(ctx, createComponentRedisKey(uint(typeId)), bytes, 0).Err()
		if err != nil {
			panic(err)
		}
	} else {
		json.Unmarshal([]byte(result), &component)
	}

	return c.JSON(component)
}

func AddComponent(c *fiber.Ctx) error {
	component := models.Component{}

	if err := c.BodyParser(&component); err != nil {
		return err
	}

	result := database.DB.Where("`type` = ?", component.Type).Find(&component)
	if result.RowsAffected != 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Can't insert same type.",
		})
	}

	result = database.DB.Create(&component)
	if result.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Insert Fail, please check value.",
			"error":   result.Error,
		})
	}

	go database.ClearCache(createComponentRedisKey(uint(component.Type)))

	return c.JSON(component)
}

func UpdateComponent(c *fiber.Ctx) error {
	component := models.Component{}

	if err := c.BodyParser(&component); err != nil {
		return err
	}

	result := database.DB.Model(&component).Updates(&component)

	if result.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Update Fail, please check error.",
			"error":   result.Error,
		})
	}

	go database.ClearCache(createComponentRedisKey(uint(component.Type)))

	return c.JSON(component)
}

func DeleteComponent(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))

	component := models.Component{}
	component.Id = uint(id)

	result := database.DB.Delete(component)
	if result.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Delete Fail, please check error.",
			"error":   result.Error,
		})
	}

	go database.ClearCache(createComponentRedisKey(component.Type))

	c.Status(fiber.StatusOK)
	return c.JSON(fiber.Map{
		"message": "remove success",
	})
}

func createComponentRedisKey(typeParam uint) string {
	return util.COMPONENT_CACHE + "_" + strconv.Itoa(int(typeParam))
}
