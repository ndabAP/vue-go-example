package main

import (
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/ndabAP/vue-go-example/routes"
	"github.com/pbnjay/memory"
	"runtime"
	"strconv"
)

func main() {
	r := gin.Default()

	r.Use(static.Serve("/", static.LocalFile("./public", true)))
	r.Static("/css", "public/css")
	r.Static("/js", "public/js")

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

	r.Run()
}
