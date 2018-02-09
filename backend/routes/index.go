package routes

import (
	"github.com/gin-gonic/gin"
	"math"
	"sort"
)

type Data struct {
	Data []int `binding:"required"`
}

type Dimension struct {
	X int     `json:"x"`
	Y float64 `json:"y"`
}

func Average(c *gin.Context) {
	data := new(Data)
	c.Bind(data)

	total := 0.0
	for _, number := range data.Data {
		total += float64(number)
	}

	c.JSON(200, total/float64(len(data.Data)))
}

func StandardDeviation(c *gin.Context) {
	data := new(Data)
	c.Bind(data)

	total := 0.0
	for _, value := range data.Data {
		total += float64(value)
	}

	average := total / float64(len(data.Data))

	total = 0.0
	for _, number := range data.Data {
		total += math.Pow(float64(number)-average, 2)
	}

	variance := total / float64(len(data.Data)-1)

	c.JSON(200, math.Sqrt(variance))
}

func Distribution(c *gin.Context) {
	data := new(Data)
	c.Bind(data)

	total := 0.0
	for _, number := range data.Data {
		total += float64(number)
	}

	average := total / float64(len(data.Data))

	total = 0.0
	for _, number := range data.Data {
		total += math.Pow(float64(number)-average, 2)
	}

	variance := total / float64(len(data.Data)-1)

	stdev := math.Sqrt(variance)

	sort.Slice(data.Data, func(i, j int) bool {
		return data.Data[i] < data.Data[j]
	})

	data.Data = removeDuplicates(data.Data)

	var normalpdf = []Dimension{}
	for _, number := range data.Data {
		m := stdev * math.Sqrt(2*math.Pi)
		e := math.Exp(-math.Pow(float64(number)-average, 2) / (2 * variance))

		normal := Dimension{
			X: number,
			Y: (e / m) * 10000, // see https://github.com/forio/contour/issues/256,
		}

		normalpdf = append(normalpdf, normal)
	}

	c.JSON(200, normalpdf)
}

func removeDuplicates(a []int) []int {
	result := []int{}
	seen := map[int]int{}
	for _, val := range a {
		if _, ok := seen[val]; !ok {
			result = append(result, val)
			seen[val] = val
		}
	}
	return result
}