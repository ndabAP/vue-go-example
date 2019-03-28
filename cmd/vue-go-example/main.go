package main

import (
	"log"
	"os"

	"github.com/ndabAP/vue-go-example/internal/app/vue-go-example/routes"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("$PORT must be set")
	}

	r := routes.SetupRoutes()

	r.Run(":" + port)
}
