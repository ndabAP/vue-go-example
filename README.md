# Vue.js and Go example project

I wanted to find out how fast Go (Golang) is and how well it plays together with Vue.js.

## Features

- Create random data
- get calculations from Go backend
- uses in-memory persistence

## Installation

### Backend

Get the dep dependency tool and gin, a live reload utility.

```bash
$ go get -u gonum.org/v1/gonum/...
$ go get github.com/codegangsta/gin
```

Fetch all dependent packages.

```bash
$ dep ensure
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
$ npm run serve
```

Now navigate to the provided URL.

## Usage

First, investigate the specs. Second, create some random data points and persist them in-memory. Now get some basic calculations or a distribution chart.

## Author

[Julian Claus](https://www.julian-claus.de) and contributors.

## License

MIT
