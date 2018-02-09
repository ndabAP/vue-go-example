package main

import (
	"github.com/gin-gonic/gin"
	"github.com/ndabAP/vue-go-example/backend/routes"
	// "github.com/shirou/gopsutil/cpu"
	"runtime"
	"fmt"
	"strconv"
)

func dealwithErr(err error) {
	if err != nil {
		fmt.Println(err)
	}
}

func main() {
	r := gin.Default()

	r.GET("/api/specs", func(c *gin.Context) {
		// cpuStat, error := cpu.Info()
		// fmt.Println(cpuStat)
		// dealwithErr(error)
		c.JSON(200, []string{runtime.GOOS, strconv.Itoa(runtime.NumCPU())})
	})

	r.POST("/api/descriptive/average", routes.Average)
	r.POST("/api/descriptive/standard-deviation", routes.StandardDeviation)
	r.POST("/api/distribution", routes.Distribution)

	r.Run(":3001")
}