package db

import "github.com/hashicorp/go-memdb"

// Database is the in-memory data base
var Database *memdb.MemDB

// SetupDb initializes the in-memory data base and adds the tables
func SetupDb() {
	schema := &memdb.DBSchema{
		Tables: map[string]*memdb.TableSchema{
			"data": {
				Name: "data",
				Indexes: map[string]*memdb.IndexSchema{
					"id": {
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
