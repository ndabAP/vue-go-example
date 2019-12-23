package main

import (
	"os"

	"github.com/ndabAP/vue-go-example/internal/routes"
)

const defaultPort string = "3000"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	r := routes.SetupRoutes()

	r.Run(":" + port)
}
