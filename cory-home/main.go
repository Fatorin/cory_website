package main

import (
	"cory-home/src/database"
	"cory-home/src/routes"
	"cory-home/src/util"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load("config.env")
	if err != nil {
		panic("Error loading .env file")
	}

	database.Connect(os.Getenv("DB_CONNECT_STRING"))
	database.AutoMigrate()
	database.SetupAdmin(os.Getenv("ADMIN_USERNAME"), os.Getenv("ADMIN_PASSWORD"))
	database.SetupRedis()
	database.SetupCacheChannel()
	database.SetupHashCacheChannel()
	database.SetupDefaultLanguage(os.Getenv("DEAFULT_LANGUAGE_REGION"), os.Getenv("DEFAULT_LANGUAGE_NAME"))

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))

	routes.Setup(app)

	util.CheckTokenAndGetData()
	util.SetupTwitchAPISchedule()
	app.Listen(":8000")
}
