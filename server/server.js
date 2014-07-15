var io = require('socket.io').listen(8080);

var currentSlide = {
	indexh: 0,
	indexv: 0,
	indexf: 0
};

var onlineCounter = 0;

console.log('Start server!!');

io.sockets.on('connection', function (socket) {
	
	io.emit('online_counter', ++onlineCounter);
	console.log("Online: " + onlineCounter);
	
	socket.on('message', function (msg) {
		console.log(msg);
		if (msg == 'audience_connect') {
			socket.emit('audience_chs', currentSlide);
		}
	});
	
	// 講者ready
	socket.on('speaker_ready', function (e) {
		console.log(e);
		currentSlide = e;
		socket.broadcast.emit('audience_chs', e);
	});
	
	// 講者切換投影片
	socket.on('speaker_chs', function (e) {
		console.log(e);
		currentSlide = e;
		socket.broadcast.emit('audience_chs', e);
	});
	
	// mousemove事件
	socket.on('mousemove', function (mousePos) {
		socket.broadcast.emit('mousemove', mousePos);
	});
	
	// mouseclick事件
	socket.on('click', function (mousePos) {
		socket.broadcast.emit('click', mousePos);
	});
	
	socket.on('disconnect', function () {
		console.log('Client disconnect');
		io.emit('online_counter', --onlineCounter);
		console.log("Online: " + onlineCounter);
	});
	
	socket.on( 'QA_ask', function( questions)
	{
		socket.broadcast.emit('Ask_msg', questions);
	});
	
});
