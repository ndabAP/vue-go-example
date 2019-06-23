default: build_server build_client

build_server:
	go build -o bin/vue-go-example cmd/vue-go-example/main.go

build_client:
	cd web && npm run build