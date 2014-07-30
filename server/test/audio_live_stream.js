var fs = require('fs');
var http = require('http');

var app = http.createServer(function(request, response) {
	
	var filename = "1.mp3";
	
	fs.readFile(filename, "binary", function(err, file) {
 
		var header = {};
		// add content type to header
 
		//TODO: any more clean solution ?
		if (typeof request.headers.range !== 'undefined')
		{
			console.log("There is 'range' in header");
			
			// browser wants chunged transmission
 
			var range = request.headers.range; 
			var parts = range.replace(/bytes=/, "").split("-"); 
			var partialstart = parts[0];
			var partialend = parts[1]; 
 
			var total = file.length; 
 
			var start = parseInt(partialstart, 10); 
			var end = partialend ? parseInt(partialend, 10) : total-1;
			
			header["Cache-Control"] = "no-cache, no-store, must-revalidate";
			header["Content-type"] = "application/octet-stream";
			header["Content-Range"] = "bytes " + start + "-" + end + "/" + (total);
			header["Accept-Ranges"] = "bytes";
			header["Content-Length"] = (end-start) + 1;
			header['Transfer-Encoding'] = 'chunked';
			header["Connection"] = "Keep-Alive";
 
			response.writeHead(206, header); 
			// yeah I dont know why i have to append the '0'
			// but chrome wont work unless i do
			response.write(file.slice(start+5000, end) + '0', "binary");
		}
		else
		{
			console.log("No 'range' in header");
			
			var total = file.length; 
 
			var start = 0; 
			var end = partialend ? parseInt(partialend, 10) : total-1;
			
			// reply to normal un-chunked request
			response.writeHead(200, header );
			response.write(file.slice(start+5000, end) + '0', "binary");
		}
 
		response.end();
	});
 
}).listen(1337);
