package db

import (
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"demomovie/config"
	"demomovie/models"
)

var DB *gorm.DB

func InitDB() {

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", config.DBUser, config.DBPassword, config.DBHost, config.DBPort, config.DBName)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	DB = db

	db.AutoMigrate(&models.Movie{})
}
