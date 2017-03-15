var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var r = require("rethinkdb");

server.listen(8088);

console.log("server is running on 8088 port...");

io.sockets.on('connection', function(socket){
	console.log("Connected");

	var connection;

	r.connect({host: 'localhost', port: 28015}, function(err, conn) {
	    if (err) throw err;
	    connection = conn;
	    r.table("fake_data").changes().run(connection, function(err, cursor) {
	        if (err) throw err;
	        cursor.each(function(err, item) {
	            if (err) throw err;
	            var data = item['new_val'];
	            console.log("Added document", data);
	            io.sockets.emit( 'message', { name: data['name'], message: data['message'] } );
	        });
		});
	});

	socket.on('disconnect', function(data){
		console.log("Disconnected");
	});
});