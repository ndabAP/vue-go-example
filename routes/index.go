package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/gonum/stat"
	"gonum.org/v1/gonum/stat/distuv"

	"github.com/ndabAP/vue-go-example/ops"
	"github.com/ndabAP/vue-go-example/db"
)

type MemData struct {
	Data []float64 `binding:"required"`
}

type DbSchema struct {
	Id uint
	Data []float64 `binding:"required"`
}

type Tuple struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

func init()  {
	db.SetupDb()
}

func Persist(c *gin.Context) {
	data := new(MemData)
	c.Bind(&data)

	memDB := db.Database
	txn := memDB.Txn(true)

	p := &DbSchema{uint(1), data.Data}
	if err := txn.Insert("data", p); err != nil {
		panic(err)
	}

	txn.Commit()
}

func Mean(c *gin.Context) {
	memDB := db.Database

	txn := memDB.Txn(false)
	defer txn.Abort()

	raw, err := txn.First("data", "id", uint(1))
	if err != nil {
		panic(err)
	}

	mean := stat.Mean(raw.(*DbSchema).Data, nil)

	c.JSON(200, mean)
}

func StdDev(c *gin.Context) {
	memDB := db.Database

	txn := memDB.Txn(false)
	defer txn.Abort()

	raw, err := txn.First("data", "id", uint(1))
	if err != nil {
		panic(err)
	}

	stdev := stat.StdDev(raw.(*DbSchema).Data, nil)

	c.JSON(200, stdev)
}

func NormalCDF(c *gin.Context) {
	memDB := db.Database

	txn := memDB.Txn(false)
	defer txn.Abort()

	raw, err := txn.First("data", "id", uint(1))
	if err != nil {
		panic(err)
	}

	data := raw.(*DbSchema).Data

	data = ops.Uniq(data)
	dist := distuv.Normal{
		Mu:    stat.Mean(data, nil),
		Sigma: stat.StdDev(data, nil),
	}

	var normalcdf []Tuple
	for _, x := range data {
		normal := Tuple{
			x,
			dist.CDF(x) * 10000, // see https://github.com/forio/contour/issues/256
		}

		normalcdf = append(normalcdf, normal)
	}

	c.JSON(200, normalcdf)
}
