var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var r = require("rethinkdb");

server.listen(8088);

console.log("server is running on 8088 port...");

io.on('connection', function(socket){
	console.log("Connected");
	socket.on('disconnect', function(data){
		console.log("Disconnected");
	});
    socket.on("message", function (data) {
        data = JSON.parse(data);
        console.log(data);
        io.sockets.emit( 'message', { name: data['author'], message: data['message'] } );
    });
});

r.connect({host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    connection = conn;
    r.db("protrade").table("call").changes().run(connection, function(err, cursor) {
        if (err) throw err;
        cursor.each(function(err, item) {
            if (err) throw err;
            var data = item['new_val'];
            console.log("Added document", data);
            io.sockets.emit( 'message', { code: data['code'], type: data['type'] } );
        });
	});
});