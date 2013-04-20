var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

app.configure(function() {

    var appRoot = __dirname + '/';

    app.use(express.static(appRoot));


    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));


    app.set('views', appRoot);

});
app.get('/', function(req, res) {
    res.sendfile('index.html');
});

server.listen(3000);
console.log('Express server started on port %s', server.address().port);