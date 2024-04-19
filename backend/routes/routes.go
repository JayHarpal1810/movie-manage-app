package routes

import (
	"errors"
	"net/http"

	"demomovie/db"
	"demomovie/models"
	"time"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func CreateMovie(c echo.Context) error {
	movie := new(models.Movie)
	if err := c.Bind(movie); err != nil {
		return err
	}

	var existingMovie models.Movie
	if err := db.DB.Where("title = ?", movie.Title).First(&existingMovie).Error; err == nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Movie name already exists")
	}

	currentYear := time.Now().Year()
	if movie.Year < 1990 || movie.Year > currentYear {
		return echo.NewHTTPError(http.StatusBadRequest, "Year should be between 1990 and current year")
	}

	if err := db.DB.Create(&movie).Error; err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, movie)
}

func GetMovies(c echo.Context) error {
	var movies []models.Movie
	if err := db.DB.Find(&movies).Error; err != nil {
		return err
	}

	return c.JSON(http.StatusOK, movies)
}

func UpdateMovie(c echo.Context) error {
	id := c.Param("id")
	var movie models.Movie
	if err := db.DB.First(&movie, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return echo.NewHTTPError(http.StatusNotFound, "Movie not found")
		}
		return err
	}

	if err := c.Bind(&movie); err != nil {
		return err
	}

	if err := db.DB.Save(&movie).Error; err != nil {
		return err
	}

	return c.JSON(http.StatusOK, movie)
}

func DeleteMovie(c echo.Context) error {
	id := c.Param("id")
	var movie models.Movie
	if err := db.DB.First(&movie, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return echo.NewHTTPError(http.StatusNotFound, "Movie not found")
		}
		return err
	}

	if err := db.DB.Delete(&movie).Error; err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}

func SetupRoutes(e *echo.Echo) {
	e.POST("/movies", CreateMovie)
	e.GET("/movies", GetMovies)
	e.PUT("/movies/:id", UpdateMovie)
	e.DELETE("/movies/:id", DeleteMovie)
}
