package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/gonum/stat"
	"github.com/ndabAP/vue-go-example/backend/ops"
	"sort"
)

type Data struct {
	Data []float64 `binding:"required"`
}

type Dimension struct {
	X int     `json:"x"`
	Y float64 `json:"y"`
}

func Average(c *gin.Context) {
	data := new(Data)
	c.Bind(&data)

	mean := stat.Mean(data.Data, nil)

	c.JSON(200, mean)
}

func StandardDeviation(c *gin.Context) {
	data := new(Data)
	c.Bind(data)

	stdev := stat.StdDev(data.Data, nil)

	c.JSON(200, stdev)
}

func Distribution(c *gin.Context) {
	data := new(Data)
	c.Bind(data)

	sort.Float64s(data.Data)
	data.Data = ops.Uniq(data.Data)

	//mean := stat.Mean(data.Data, nil)
	//stdev := stat.StdDev(data.Data, nil)



	//
	//var normalpdf = []Dimension{}
	//for _, number := range data.Data {
	//	m := stdev * math.Sqrt(2*math.Pi)
	//	e := math.Exp(-math.Pow(float64(number)-average, 2) / (2 * variance))
	//
	//	normal := Dimension{
	//		X: number,
	//		Y: (e / m) * 10000, // see https://github.com/forio/contour/issues/256,
	//	}
	//
	//	normalpdf = append(normalpdf, normal)
	//}
	//

	var res = []Dimension {
		{1, 2},
	}
	c.JSON(200, res)
}
