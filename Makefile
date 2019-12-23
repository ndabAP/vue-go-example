default: build_server build_client

build_server:
	go build -o bin/vue-go-example cmd/main.go

build_client:
	cd web && npm run build