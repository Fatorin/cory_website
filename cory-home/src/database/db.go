package database

import (
	"cory-home/src/models"
	"fmt"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect(connectString string) {
	var err error
	var errTime = 0
	var reconnectTime = 5 * time.Second
	for {

		DB, err = gorm.Open(mysql.Open(connectString), &gorm.Config{})

		if err == nil {
			fmt.Println("Connect Success.")
			break
		}

		errTime += 1
		fmt.Printf("Try connect fail, time = %v.\n", errTime)
		fmt.Printf("After %v seconds will reconnect.\n", reconnectTime)

		if errTime >= 5 {
			panic("Could not connect with the database!")
		}

		time.Sleep(reconnectTime)
		continue
	}
}

func SetupAdmin(userName string, password string) {

	user := models.User{
		Username: userName,
	}

	result := DB.First(&user)

	if result.Error == nil {
		fmt.Println("Admin has created.")
		return
	}

	user.SetPassword(password)

	DB.Create(&user)
}

func SetupDefaultLanguage(region string, name string) {
	defaultAvailable := true

	language := models.Language{
		Region:    region,
		Name:      name,
		NickName:  name,
		Available: &defaultAvailable,
	}

	result := DB.First(&language)

	if result.Error == nil {
		fmt.Println("Default language has created.")
		return
	}

	DB.Create(&language)
}

func AutoMigrate() {
	DB.AutoMigrate(models.User{}, models.Language{}, models.AppText{}, models.Image{}, models.Component{})
}
