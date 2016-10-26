'use strict';

var express = require('express')
var server = express()

server.use('/assets', express.static(__dirname + '/build/assets'))

server.get('/', (req, res) => {
  res.sendFile(__dirname + '/build/index.html')
})

const port = process.env.PORT || 8080

server.listen(port, () => {
  console.log(`express server running on port ${port}...`)
})
