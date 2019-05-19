package db

import "github.com/hashicorp/go-memdb"

var Database *memdb.MemDB

func SetupDb() {
	schema := &memdb.DBSchema{
		Tables: map[string]*memdb.TableSchema{
			"data": &memdb.TableSchema{
				Name: "data",
				Indexes: map[string]*memdb.IndexSchema{
					"id": &memdb.IndexSchema{
						Name:    "id",
						Unique:  true,
						Indexer: &memdb.UintFieldIndex{Field: "ID"},
					},
				},
			},
		},
	}

	Database, _ = memdb.NewMemDB(schema)
}
