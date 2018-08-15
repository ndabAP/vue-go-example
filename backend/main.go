package main

import (
	"github.com/gin-gonic/gin"
	"github.com/ndabAP/vue-go-example/backend/routes"
	"runtime"
	"strconv"
	"github.com/pbnjay/memory"
)

func main() {
	r := gin.Default()

	r.GET("/api/specs", func(c *gin.Context) {
		c.JSON(200, []string{
			runtime.GOOS,
			strconv.Itoa(runtime.NumCPU()),
			strconv.FormatUint(memory.TotalMemory() / (1024 * 1024), 10),
		})
	})

	r.POST("/api/persist", routes.Persist)
	r.POST("/api/descriptive/mean", routes.Mean)
	r.POST("/api/descriptive/standard-deviation", routes.StdDev)
	r.POST("/api/distribution", routes.NormalCDF)

	r.Run(":3001")
}
