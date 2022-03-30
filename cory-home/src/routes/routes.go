package routes

import (
	"cory-home/src/controllers"
	"cory-home/src/middlewares"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {

	api := app.Group("api")

	api.Get("languages", controllers.Languages)
	api.Get("appTexts", controllers.AppTexts)

	twitchApi := api.Group("twitch")
	twitchApi.Get("emotes", controllers.TwitchEmotes)
	twitchApi.Get("cheers", controllers.TwitchCheers)
	twitchApi.Get("badges", controllers.TwitchBadges)

	admin := api.Group("admin")
	admin.Post("login", controllers.Login)

	adminAuthenticated := admin.Use(middlewares.IsAuthenticated)
	adminAuthenticated.Get("user", controllers.User)
	adminAuthenticated.Get("logout", controllers.Logout)
	adminAuthenticated.Put("users/info", controllers.UpdateInfo)
	adminAuthenticated.Put("users/password", controllers.UpdatePassword)
	adminAuthenticated.Post("languages", controllers.CreateLanguage)
	adminAuthenticated.Put("languages", controllers.UpdateLanguage)
	adminAuthenticated.Delete("languages/:id", controllers.DeleteLanguage)
	adminAuthenticated.Post("appTexts", controllers.CreateAppText)
	adminAuthenticated.Put("appTexts", controllers.UpdateAppText)
	adminAuthenticated.Delete("appTexts/:id", controllers.DeleteAppText)
	adminAuthenticated.Post("twitch/forceupdate", controllers.TwitchForceUpdate)
}
