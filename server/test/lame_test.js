var lame = require('lame');

// create the Encoder instance
var encoder = new lame.Encoder({
	// input
	channels: 2,        // 2 channels (left and right)
	bitDepth: 16,       // 16-bit samples
	sampleRate: 44100   // 44,100 Hz sample rate

	// output
	bitRate: 128,
	outSampleRate: 22050,
	mode: lame.STEREO // STEREO (default), JOINTSTEREO, DUALCHANNEL or MONO
});

encoder.on("data", function(data) {
	console.log(data);
});

// raw PCM data from stdin gets piped into the encoder
//process.stdin.pipe(encoder);

// the generated MP3 file gets piped to stdout
//encoder.pipe(process.stdout);
