package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/gonum/stat"
	"github.com/ndabAP/vue-go-example/backend/ops"
	"github.com/ndabAP/vue-go-example/backend/database"
	"sort"
	"gonum.org/v1/gonum/stat/distuv"
	_ "fmt"
)

type Data struct {
	Data []float64 `binding:"required"`
}

type DataSchema struct {
	Id uint
	Data []float64 `binding:"required"`
}

type Tuple struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

func init()  {
	database.Db()
}

func Persist(c *gin.Context) {
	data := new(Data)
	c.Bind(&data)

	db := database.Database
	txn := db.Txn(true)

	p := &DataSchema{uint(1), data.Data}
	if err := txn.Insert("data", p); err != nil {
		panic(err)
	}

	txn.Commit()
}

func Mean(c *gin.Context) {
	db := database.Database

	txn := db.Txn(false)
	defer txn.Abort()

	raw, err := txn.First("data", "id", uint(1))
	if err != nil {
		panic(err)
	}

	mean := stat.Mean(raw.(*DataSchema).Data, nil)

	c.JSON(200, mean)
}

func StdDev(c *gin.Context) {
	db := database.Database

	txn := db.Txn(false)
	defer txn.Abort()

	raw, err := txn.First("data", "id", uint(1))
	if err != nil {
		panic(err)
	}

	stdev := stat.StdDev(raw.(*DataSchema).Data, nil)

	c.JSON(200, stdev)
}

func NormalCDF(c *gin.Context) {
	db := database.Database

	txn := db.Txn(false)
	defer txn.Abort()

	raw, err := txn.First("data", "id", uint(1))
	if err != nil {
		panic(err)
	}

	data := raw.(*DataSchema).Data

	sort.Float64s(data)
	data= ops.Uniq(data)

	dist := distuv.Normal{
		Mu:    stat.Mean(data, nil),
		Sigma: stat.StdDev(data, nil),
	}

	var normalcdf []Tuple
	for _, number := range data {
		normal := Tuple{
			number,
			dist.CDF(number) * 10000,
		}

		normalcdf = append(normalcdf, normal)
	}

	c.JSON(200, normalcdf)
}
