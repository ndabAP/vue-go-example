# Vue.js and Go example project

I wanted to find out how fast Go (Golang) is and how well it plays together with Vue.js.

## Features

- Create random data
- get calculations from Go backend
- or get a distribution chart

## Installation

### Backend

Get the govendor tool and gin, a live reload utility.

```bash
$ go get -u github.com/kardianos/govendor
$ go get github.com/codegangsta/gin
```

Fetch all dependent packages.

```bash
$ govendor fetch
```

Start the server.

```bash
$ gin run main.go
```

### Frontend

Install dependencies.

```bash
$ npm i
```

Start the server.

```bash
$ npm run dev
```

Now navigate to [http://localhost:8080](http://localhost:8080).

## Usage

First, create some random data points. Now get some basic calculations or a distribution chart.

## Author

[Julian Claus](https://www.julian-claus.de) and contributors.

## License

MIT
