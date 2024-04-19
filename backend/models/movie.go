package models

import "gorm.io/gorm"

type Movie struct {
	gorm.Model
	Title  string
	Genre  string
	Year   int
	Rating int
}
