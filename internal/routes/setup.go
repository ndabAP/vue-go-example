package routes

import (
	"runtime"
	"strconv"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/pbnjay/memory"
)

// SetupRoutes connects the HTTP API endpoints to the handlers
func SetupRoutes() *gin.Engine {
	r := gin.Default()

	r.Use(static.Serve("/", static.LocalFile("./website", true)))
	r.Static("/css", "public/css")
	r.Static("/js", "public/js")

	r.GET("/api/specs", func(c *gin.Context) {
		c.JSON(200, []string{
			runtime.GOOS,
			strconv.Itoa(runtime.NumCPU()),
			strconv.FormatUint(memory.TotalMemory()/(1024*1024), 10),
		})
	})
	r.POST("/api/persist", Persist)
	r.POST("/api/descriptive/mean", Mean)
	r.POST("/api/descriptive/standard-deviation", StdDev)
	r.POST("/api/distribution", NormalCDF)

	return r
}
