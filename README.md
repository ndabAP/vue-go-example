# Vue.js and Go example project

Mathematical operations with Go (Golang) and Vue.js. See the [demo](https://vue-go-example.herokuapp.com) (you may need 
to wait 30 seconds).

## Features

- Create random data
- Get calculations from Go backend
- Uses in-memory persistence

## Installation

### Backend

You need at least Go 1.11 which includes module support. Dependencies are defined inside `go.mod`. To start the server, simply enter:

```bash
$ PORT=3000 go run cmd/vue-go-example/main.go 
```

This will fetch all dependencies automatically and starts the server at port 3000. The clients target port is also set to 3000. You can change the port at `web/vue.config.js`.

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

## Author

[Julian Claus](https://www.julian-claus.de) and contributors.

## License

MIT
