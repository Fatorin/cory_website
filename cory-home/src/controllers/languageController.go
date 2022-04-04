package controllers

import (
	"context"
	"cory-home/src/database"
	"cory-home/src/models"
	"cory-home/src/util"
	"encoding/json"
	"sort"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func Languages(c *fiber.Ctx) error {
	var languages []models.Language
	var ctx = context.Background()

	result, err := database.Cache.HGetAll(ctx, util.LANGUAGES_CACHE).Result()
	if err != nil || len(result) == 0 {
		database.DB.Find(&languages)

		for _, v := range languages {
			upsertLanguageToRedis(v)
		}
	} else {
		for _, v := range result {
			var language models.Language
			json.Unmarshal([]byte(v), &language)
			languages = append(languages, language)
		}
	}

	sort.Slice(languages, func(i, j int) bool {
		return languages[i].Id < languages[j].Id
	})

	return c.JSON(languages)
}

func CreateLanguage(c *fiber.Ctx) error {
	var language models.Language

	if err := c.BodyParser(&language); err != nil {
		return err
	}

	language.Region = strings.ToLower(language.Region)

	result := database.DB.Create(&language)

	if result.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Insert Fail, please check value.",
			"error":   result.Error,
		})
	}

	upsertLanguageToRedis(language)

	return c.JSON(language)
}

func UpdateLanguage(c *fiber.Ctx) error {
	language := models.Language{}

	if err := c.BodyParser(&language); err != nil {
		return err
	}

	result := database.DB.Model(&language).Updates(&language)

	if result.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Update Fail, please check error.",
			"error":   result.Error,
		})
	}

	upsertLanguageToRedis(language)

	return c.JSON(language)
}

func DeleteLanguage(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))

	language := models.Language{}
	language.Id = uint(id)

	result := database.DB.First(&language)
	if result.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Not found data.",
			"error":   result.Error,
		})
	}

	result = database.DB.Delete(&language)

	if result.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Delete Fail, please check error.",
			"error":   result.Error,
		})
	}

	go database.ClearHashCache(database.HashCache{
		Key:   util.LANGUAGES_CACHE,
		Field: language.Region,
	})

	return nil
}

func upsertLanguageToRedis(language models.Language) error {
	var ctx = context.Background()

	bytes, err := json.Marshal(language)

	if err != nil {
		panic(err)
	}

	err = database.Cache.HSet(ctx, util.LANGUAGES_CACHE, language.Region, bytes).Err()
	if err != nil {
		panic(err)
	}

	return nil
}
