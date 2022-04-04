package controllers

import (
	"context"
	"cory-home/src/database"
	"cory-home/src/models"
	"cory-home/src/util"
	"encoding/json"
	"sort"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func AppTexts(c *fiber.Ctx) error {
	langParam := c.Query("lang")
	typeParam := c.Query("type")

	if langParam == "" || typeParam == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "please fill query param.",
		})
	}

	languageId, _ := strconv.Atoi(langParam)
	typeId, _ := strconv.Atoi(typeParam)

	var texts []models.AppText
	var ctx = context.Background()

	database.DB.Where("`language_id` = ? AND `type` = ?", languageId, typeId).Find(&texts)

	result, err := database.Cache.Get(ctx, createAppTextRedisKey(languageId, typeId)).Result()
	if err != nil {
		bytes, err := json.Marshal(texts)

		if err != nil {
			panic(err)
		}

		err = database.Cache.Set(ctx, createAppTextRedisKey(languageId, typeId), bytes, 0).Err()
		if err != nil {
			panic(err)
		}
	} else {
		json.Unmarshal([]byte(result), &texts)
	}

	sort.Slice(texts, func(i, j int) bool {
		return texts[i].Order < texts[j].Order
	})

	return c.JSON(texts)
}

func CreateAppText(c *fiber.Ctx) error {
	var appText models.AppText
	if err := c.BodyParser(&appText); err != nil {
		return err
	}

	result := database.DB.Where("`language_id` = ? AND `order` = ?", appText.LanguageId, appText.Order).Find(&appText)

	if result.RowsAffected != 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Can't insert same id with order.",
		})
	}

	result = database.DB.Create(&appText)

	if result.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Insert Fail, please check value.",
			"error":   result.Error,
		})
	}

	go database.ClearCache(createAppTextRedisKey(int(appText.LanguageId), int(appText.Type)))

	return c.JSON(appText)
}

func UpdateAppText(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))

	appText := models.AppText{}
	appText.Id = uint(id)

	if err := c.BodyParser(&appText); err != nil {
		return err
	}

	result := database.DB.Model(&appText).Updates(&appText)

	if result.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Update Fail, please check error.",
			"error":   result.Error,
		})
	}

	go database.ClearCache(createAppTextRedisKey(int(appText.LanguageId), int(appText.Type)))

	return c.JSON(appText)
}

func DeleteAppText(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))

	var appText models.AppText
	appText.Id = uint(id)

	result := database.DB.Find(&appText)
	if result.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Delete Fail, please check error.",
			"error":   result.Error,
		})
	}

	result = database.DB.Delete(&appText)

	if result.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Delete Fail, please check error.",
			"error":   result.Error,
		})
	}

	go database.ClearCache(createAppTextRedisKey(int(appText.LanguageId), int(appText.Type)))

	return nil
}

func createAppTextRedisKey(languageId int, typeId int) string {
	return util.APPTEXT_CACHE + strconv.Itoa(languageId) + "x" + strconv.Itoa(typeId)
}
