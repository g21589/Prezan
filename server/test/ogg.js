var fs = require('fs');
var ogg = require('ogg');
var vorbis = require('vorbis');
var file = __dirname + '/123.ogg';
var Speaker = require('speaker');

var od = new ogg.Decoder();
od.on('stream', function (stream) {

	var vd = new vorbis.Decoder();

	// the "format" event contains the raw PCM format
	vd.on('format', function (format) {
		// send the raw PCM data to stdout
		vd.pipe(new Speaker);
	});

	// an "error" event will get emitted if the stream is not a Vorbis stream
	// (i.e. it could be a Theora video stream instead)
	vd.on('error', function (err) {
		// maybe try another decoder...
	});

	stream.pipe(vd);
	
});

fs.createReadStream(file).pipe(od);
