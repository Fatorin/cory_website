package controllers

import (
	"context"
	"cory-home/src/database"
	"cory-home/src/util"
	"encoding/json"
	"sort"

	"github.com/gofiber/fiber/v2"
)

func TwitchEmotes(c *fiber.Ctx) error {
	var ctx = context.Background()

	var emoteDatas []util.EmoteData

	result, err := database.Cache.Get(ctx, util.TWITCH_CACHE_EMOTES).Result()
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Server not found datas.",
		})
	}

	json.Unmarshal([]byte(result), &emoteDatas)

	sort.Slice(emoteDatas, func(i, j int) bool {
		return emoteDatas[i].Tier < emoteDatas[j].Tier
	})

	return c.JSON(emoteDatas)
}

func TwitchCheers(c *fiber.Ctx) error {
	var ctx = context.Background()

	var infoDatas []util.InfoData

	result, err := database.Cache.Get(ctx, util.TWITCH_CACHE_CHEERS).Result()
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Server not found datas.",
		})
	}

	json.Unmarshal([]byte(result), &infoDatas)

	return c.JSON(infoDatas)
}

func TwitchBadges(c *fiber.Ctx) error {
	var ctx = context.Background()

	var infoDatas []util.InfoData

	result, err := database.Cache.Get(ctx, util.TWITCH_CACHE_BADGES).Result()
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Server not found datas.",
		})
	}

	json.Unmarshal([]byte(result), &infoDatas)

	return c.JSON(infoDatas)
}

func TwitchForceUpdate(c *fiber.Ctx) error {
	util.ForceGet()
	c.Status(fiber.StatusOK)
	return c.JSON(fiber.Map{
		"message": "Success.",
	})
}
