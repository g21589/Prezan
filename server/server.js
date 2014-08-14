var fs = require('fs');
var lame = require('lame');
var path = require('path');
var http = require('http');
var io = require('socket.io').listen(8080);

var currentSlide = {
	indexh: 0,
	indexv: 0,
	indexf: 0
};

var onlineCounter = 0;
var isRadioPlay = false;

// create the Encoder instance
var encoder = new lame.Encoder({
	// input
	channels: 1,        // 1 channels (left and right)
	bitDepth: 16,       // 16-bit samples
	sampleRate: 44100,   // 44,100 Hz sample rate

	// output
	bitRate: 32,
	outSampleRate: 44100,
	mode: lame.MONO // c (default), JOINTSTEREO, DUALCHANNEL or MONO
});

console.log('Start server!!');

io.sockets.on('connection', function (socket) {
	
	io.emit('online_counter', ++onlineCounter);
	console.log("Online: " + onlineCounter);
	
	socket.on('message', function (msg) {
		console.log(msg);
		if (msg == 'audience_connect') {
			socket.emit('audience_chs', currentSlide);
			if (isRadioPlay) {
				socket.emit('start_radio', "");
			}
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
	
	// 送出Audio錄音緩衝區事件
	socket.on('audio', function (audioData) {
		encoder.write(audioData);
	});
	
	// 開始聲音串流
	socket.on('start_radio', function (e) {
		socket.broadcast.emit('start_radio', e);
		isRadioPlay = true;
	});
	
	// 停止聲音串流
	socket.on('stop_radio', function (e) {
		socket.broadcast.emit('stop_radio', e);
		isRadioPlay = false;
	});
	
	// QA_ask事件
	socket.on('QA_ask', function(questions) {
		socket.broadcast.emit('Ask_msg', questions);
	});
	
	socket.on('disconnect', function () {
		console.log('Client disconnect');
		io.emit('online_counter', --onlineCounter);
		console.log("Online: " + onlineCounter);
	});
	
});

// MP3 Streaming Server by Socket.io (WebSocket)
/*
var newBuffer = null;
encoder.on("data", function(data) {
	
	if (newBuffer == null) {
		newBuffer = data;
	} else {
		newBuffer = Buffer.concat([newBuffer, data]);
		if (newBuffer.length >= 8192) {
			io.emit('mp3', newBuffer);
			newBuffer = null;
		}
	}
	
});
*/
// 在Server端輸出到檔案(側錄)
//encoder.pipe(fs.createWriteStream(path.resolve(__dirname, 'record.mp3')));

encoder.on("data", function(data) {

});

// MP3 Streaming Server by HTTP
http.createServer(function(request, response) {
	
	response.on("finish", function() {
		console.log("finish");
	});
 
	var total = 999999999;
	var start = 500000;
	var end = total - 1;
	
	var header = {
		"Cache-Control" : "no-cache, no-store, must-revalidate",
		"Content-type": "audio/mpeg",
		"Connection": "Keep-Alive"
	};
	header["Accept-Ranges"] = "bytes";
	header["Content-Range"] = "bytes " + start + "-" + end + "/" + (total);
	//header["Content-Length"] = (end - start) + 1;
	header['Transfer-Encoding'] = 'chunked';
	
	response.writeHead(200, header);
	
	encoder.pipe(response)
		.on('close', function () {
			console.error('End pipe');
			encoder.unpipe(response);
			response.end();
		});
	
	/*
	var r = parseInt(Math.random() * 100 + 1);
	
	mp3header = new Buffer(4);
	mp3header.writeUInt32LE(0xfffb10c4, 0);
	response.write(mp3header, "binary");
	
	encoder.on("data", function(data) {
		response.write(data, "binary");
		console.log(r + ":");
	})
	.on('close', function () {
		console.error('close');
		response.end();
	});
	*/
	
}).listen(5566);
