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

    socket.on("request", function (data) {
        data = JSON.parse(data);
        console.log(data);

        r.connect({host: 'localhost', port: 28015}, function(err, conn) {
            if (err) throw err;
            connection = conn;
            if (data['type'] == "line") {
                r.db("protrade").table("rawvalue").filter({code : data['code']}).pluck('current_price','time_stamp').changes().run(connection, function(err, cursor) {
                    if (err) throw err;
                    cursor.each(function(err, item) {
                        if (err) throw err;
                        var responseData = item['new_val'];
                        console.log("Added document on console", responseData);
                        socket.emit( 'upDateData', responseData);
                    });
                });
            }else if (data['type'] == "candleStick") {}{
                var tableName = "cycle_".concat(data['cycle']);
                r.db("trade_cycle").table(tableName).filter({code : data['code']}).changes().run(connection, function(err, cursor) {
                    if (err) throw err;
                    cursor.each(function(err, item) {
                        if (err) throw err;
                        if (item['old_val'] == null) {
                            var responseData = item['new_val'];
                            console.log("Added new Point", responseData);
                            socket.emit( 'newPoint', responseData);
                        }else{
                            var responseData = item['new_val'];
                            console.log("Updated Point", responseData);
                            socket.emit( 'updatePoint', responseData);
                        }
                        
                    });
                });
            }
            
        });
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