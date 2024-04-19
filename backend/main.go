package main

import (
	"demomovie/db"
	"demomovie/routes"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.CORS())

	db.InitDB()

	routes.SetupRoutes(e)

	e.Logger.Fatal(e.Start(":9091"))
}
