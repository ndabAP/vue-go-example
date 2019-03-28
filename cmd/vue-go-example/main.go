package main

import (
	"github.com/ndabAP/vue-go-example/internal/app/vue-go-example/routes"
)

func main() {
	r := routes.SetupRoutes()

	r.Run(":3000")
}
