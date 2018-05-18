package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/gonum/stat"
	"github.com/gonum/stat/distuv"
	"github.com/ndabAP/vue-go-example/backend/ops"
	"sort"
)

type Data struct {
	Data []float64 `binding:"required"`
}

type Dimension struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

func Mean(c *gin.Context) {
	data := new(Data)
	c.Bind(&data)

	mean := stat.Mean(data.Data, nil)

	c.JSON(200, mean)
}

func StdDev(c *gin.Context) {
	data := new(Data)
	c.Bind(data)

	stdev := stat.StdDev(data.Data, nil)

	c.JSON(200, stdev)
}

func NormalCDF(c *gin.Context) {
	data := new(Data)
	c.Bind(data)

	sort.Float64s(data.Data)
	data.Data = ops.Uniq(data.Data)

	dist := distuv.Normal{
		Mu:    stat.Mean(data.Data, nil),
		Sigma: stat.StdDev(data.Data, nil),
	}

	var normalcdf []Dimension
	for _, number := range data.Data {
		normal := Dimension{
			number,
			dist.CDF(number) * 10000,
		}

		normalcdf = append(normalcdf, normal)
	}

	c.JSON(200, normalcdf)
}
