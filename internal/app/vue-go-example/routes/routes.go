package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/gonum/stat"
	"gonum.org/v1/gonum/stat/distuv"

	"github.com/ndabAP/vue-go-example/internal/app/vue-go-example/db"
)

type memData struct {
	Data []float64 `binding:"required"`
}

type dbSchema struct {
	ID   uint
	Data []float64 `binding:"required"`
}

type tuple struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

func init() {
	db.SetupDb()
}

// Persist saves the given data
func Persist(c *gin.Context) {
	data := new(memData)
	c.Bind(&data)

	memDB := db.Database
	txn := memDB.Txn(true)

	p := &dbSchema{uint(1), data.Data}
	if err := txn.Insert("data", p); err != nil {
		panic(err)
	}

	txn.Commit()
}

// Mean returns the average from the in-memory data
func Mean(c *gin.Context) {
	memDB := db.Database

	txn := memDB.Txn(false)
	defer txn.Abort()

	raw, err := txn.First("data", "id", uint(1))
	if err != nil {
		panic(err)
	}

	mean := stat.Mean(raw.(*dbSchema).Data, nil)

	c.JSON(200, mean)
}

// StdDev returns the standard deviation from the in-memory data
func StdDev(c *gin.Context) {
	memDB := db.Database

	txn := memDB.Txn(false)
	defer txn.Abort()

	raw, err := txn.First("data", "id", uint(1))
	if err != nil {
		panic(err)
	}

	stdev := stat.StdDev(raw.(*dbSchema).Data, nil)

	c.JSON(200, stdev)
}

// NormalCDF returns the cumulative normal distribution from the in-memory data
func NormalCDF(c *gin.Context) {
	memDB := db.Database

	txn := memDB.Txn(false)
	defer txn.Abort()

	raw, err := txn.First("data", "id", uint(1))
	if err != nil {
		panic(err)
	}

	data := raw.(*dbSchema).Data

	data = uniq(data)
	dist := distuv.Normal{
		Mu:    stat.Mean(data, nil),
		Sigma: stat.StdDev(data, nil),
	}

	var normalcdf []tuple
	for _, x := range data {
		normal := tuple{
			x,
			dist.CDF(x) * 10000, // see https://github.com/forio/contour/issues/256
		}

		normalcdf = append(normalcdf, normal)
	}

	c.JSON(200, normalcdf)
}

// Returns unique values of a slice
func uniq(s []float64) []float64 {
	m := map[float64]bool{}
	var r []float64

	for _, v := range s {
		if _, seen := m[v]; !seen {
			r = append(r, v)
			m[v] = true
		}
	}

	return r
}
