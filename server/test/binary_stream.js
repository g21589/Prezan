var fs = require('fs');
var path = require('path');
var lame = require('lame');
var BinaryServer = require('binaryjs').BinaryServer;

var server = BinaryServer({port: 9000});

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

server.on('connection', function(client) {
	
	console.log("connect");
	
	var clientStream = client.createStream();
	
	client.on('stream', function(stream, meta) {
		console.log(stream.id);
		stream.pipe(encoder).pipe(clientStream);
	});
	
	client.on('close', function() {
		console.log("close");
	});
	
});

// 在Server端輸出到檔案(側錄)
//encoder.pipe(fs.createWriteStream(path.resolve(__dirname, 'record.mp3')));
