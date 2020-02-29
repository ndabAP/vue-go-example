# Vue.js and Go example project

Mathematical operations with Go (Golang) and Vue.js. See the [demo](https://vue-go-example.herokuapp.com).

## Features

- Create random data
- Get calculations from Go backend
- Uses in-memory persistence

## Installation

### Backend

You need at least Go 1.11 which includes module support. You don't have to place this application into the `GOPATH`! Dependencies are defined inside `go.mod`. To start the server, simply enter:

```bash
$ go run cmd/main.go 
```

This will fetch all dependencies automatically and starts the server at port 3000. The clients target port is also set to 3000. You can change the clients port at `web/vue.config.js`.

### Frontend

Install the dependencies.

```bash
$ npm i
```

Start the server.

```bash
$ npm run serve
```

Now navigate to the provided URL.

## Usage

First, investigate the specs. Second, create some random data points and persist them in-memory. Now get some basic calculations or a distribution chart.

## Build

To build everything simply use `make` (`nmake` for Windows).

### Server

Its possible to use `go build -o bin/vue-go-example cmd/main.go` or use `make build_server`. Both creates a binary inside `bin` with name `vue-go-example`.

### Client

You can either build the client with `make build_client` or you go the client directory and enter `npm run build` (or with yarn: `yarn build`). Both builds the application and moves it into `website`.

## Author

[Julian Claus](https://www.julian-claus.de) and contributors.

## License

MIT
