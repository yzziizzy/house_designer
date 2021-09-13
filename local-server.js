var express = require('express')
var serveStatic = require('serve-static')
var app = express()

app.use('/', serveStatic('./'));

app.listen(1667, function () {
	console.log('Server listening on port 1667!')
})
