var fs = require('fs');
var lame = require('lame');
var path = require('path');
var winston = require('winston');
var http = require('http');
var io = require('socket.io').listen(8080);

// Logger config using winston
var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({ timestamp: timestampf, colorize: true }),
		new (winston.transports.File)({ filename: 'server.log', timestamp: timestampf, json: false })
	]
});

// Create the MP3 encoder instance
var encoder = new lame.Encoder({
	// input
	channels: 1,		// 1 channels (left and right)
	bitDepth: 16,       // 16-bit samples
	sampleRate: 44100,	// 44,100 Hz sample rate

	// output
	bitRate: 32,
	outSampleRate: 44100,
	mode: lame.MONO
});

// Server variables
var currentSlide = {
	indexh: 0,
	indexv: 0,
	indexf: 0
};
var onlineCounter = 0;
var isRadioPlay = false;

logger.info('===== Start Server =====');

io.sockets.on('connection', function (socket) {
	
	logger.info("Connected ID: %s IP: %s", socket.id, socket.request.connection.remoteAddress);
	
	io.emit('online_counter', ++onlineCounter);
	logger.info("Online: " + onlineCounter);
	
	// 訊息事件
	socket.on('message', function (msg) {
		logger.info("Message: " + msg);
		if (msg == 'audience_connect') {
			socket.emit('audience_chs', currentSlide);
			if (isRadioPlay) {
				socket.emit('start_radio', "");
			}
		}
	});
	
	// 講者ready
	socket.on('speaker_ready', function (e) {
		logger.info(e);
		currentSlide = e;
		socket.broadcast.emit('audience_chs', e);
	});
	
	// 講者切換投影片
	socket.on('speaker_chs', function (e) {
		logger.info(e);
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
	
	// modify_slides事件
	socket.on('modify_slides', function(html) {
		socket.broadcast.emit('modify_slides', html);
	});
	
	// 震動事件
	socket.on('vibrate', function(isOpen) {
		socket.broadcast.emit('vibrate', isOpen);
	});
	
	// 中斷連線事件
	socket.on('disconnect', function () {
		logger.info("Disconnected ID: " + socket.id);
		io.emit('online_counter', --onlineCounter);
		logger.info("Online: " + onlineCounter);
	});
	
	// 初始化Canvas
	socket.on('init_canvas', function(canvas) {
		socket.broadcast.emit('init_canvas', canvas);
	});
	
	// 同步註記
	socket.on('add_path', function(fhpath) {
		socket.broadcast.emit('add_path', fhpath);
	});
});

// 丟棄過時的聲音串流資料
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

/**
 * 回傳格式化時間戳記
 */
function timestampf() {
	return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}
