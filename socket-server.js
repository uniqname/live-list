var wsServer = require('ws').Server,
	wss = new wsServer({port: 8081});

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('received: %s', message);
    });
    ws.send('["A", "B", "C", "D", "E", "F"]');
});