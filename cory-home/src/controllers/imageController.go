package controllers

import (
	"context"
	"cory-home/src/database"
	"cory-home/src/models"
	"cory-home/src/util"
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func Images(c *fiber.Ctx) error {
	tagParam := c.Query("tag")

	if tagParam == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "please fill query param.",
		})
	}

	var images []models.Image
	var ctx = context.Background()

	database.DB.Where("`tag` = ?", tagParam).Find(&images)

	result, err := database.Cache.Get(ctx, createImageRedisKey(tagParam)).Result()
	if err != nil {
		bytes, err := json.Marshal(images)

		if err != nil {
			panic(err)
		}

		err = database.Cache.Set(ctx, createImageRedisKey(tagParam), bytes, 0).Err()
		if err != nil {
			panic(err)
		}
	} else {
		json.Unmarshal([]byte(result), &images)
	}

	return c.JSON(images)
}

func AddImage(c *fiber.Ctx) error {
	var image models.Image

	if err := c.BodyParser(&image); err != nil {
		return err
	}

	file, err := c.FormFile("file")
	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "file has problem.",
		})
	}

	image.Image, err = createFilePath(file.Header.Get("Content-type"))
	if err != nil {
		c.Status(fiber.StatusUnsupportedMediaType)
		return c.JSON(fiber.Map{
			"message": "not support type.",
		})
	}

	err = c.SaveFile(file, util.IMAGE_FOLDER_PATH+image.Image)
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "system has problem.",
		})
	}

	result := database.DB.Create(&image)

	if result.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Insert Fail, please check value.",
			"error":   result.Error,
		})
	}

	go database.ClearCache(createImageRedisKey(image.Tag))

	return c.JSON(image)
}

func UpdateImage(c *fiber.Ctx) error {
	image := models.Image{}

	if err := c.BodyParser(&image); err != nil {
		return err
	}

	result := database.DB.Model(&image).Updates(&image)

	if result.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Update Fail, please check error.",
			"error":   result.Error,
		})
	}

	go database.ClearCache(createImageRedisKey(image.Tag))

	return c.JSON(image)
}

func DeleteImage(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))

	image := models.Image{}
	image.Id = uint(id)

	result := database.DB.First(&image)
	if result.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Not found data.",
			"error":   result.Error,
		})
	}

	result = database.DB.Delete(image)
	if result.Error != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Delete Fail, please check error.",
			"error":   result.Error,
		})
	}

	path := util.IMAGE_FOLDER_PATH + image.Image
	if _, err := os.Stat(path); err == nil {
		err = os.Remove(path)
		if err != nil {
			fmt.Println("Remove fail. err=", err)
		}
	}

	go database.ClearCache(createImageRedisKey(image.Tag))

	c.Status(fiber.StatusOK)
	return c.JSON(fiber.Map{
		"message": "remove success",
	})
}

func createImageRedisKey(tag string) string {
	return util.IMAGE_CACHE + "_" + tag
}

func createFilePath(fileType string) (string, error) {
	image := models.Image{}
	path := ""
	for {
		path = strings.Replace(uuid.New().String(), "-", "", -1)
		result := database.DB.Where("`image` = ?", path).First(&image)
		if result.Error != nil {
			fmt.Println(result.Error)
			break
		}
	}

	switch fileType {
	case "image/png":
		path = path + ".png"
	case "image/jpeg":
		path = path + ".jpeg"
	default:
		return path, fmt.Errorf("Not support mediatype.")
	}

	return path, nil
}
