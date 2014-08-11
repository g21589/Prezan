var g_masterPathArray;
var g_masterDrawingBox;
var g_masterPaper;
var $canvas;

function matrixToArray(str) {
    return str.match(/(-?[0-9\.]+)/g);
}

function initCanvas(canvasId) {

	var w = $('.reveal').width();
	var h = $('.reveal').height();	
	var scale = 1 / matrixToArray( $('.slides').css('transform') )[0];

	$('.present').not('.stack').prepend('<div id=' + canvasId + ' class="canvas"></div>');
	$canvas = $('#' + canvasId);

	$canvas.css({		
		'-webkit-transform': 'scale(' + scale + ')',
		'-moz-transform': 'scale(' + scale + ')',
		'-ms-transform': 'scale(' + scale + ')',
		'-o-transform': 'scale(' + scale + ')',
		'transform': 'scale(' + scale + ')'
	});	
	$canvas.width(w).height(h).css('position', 'fixed');

	while($canvas.offset().top !=0 || $canvas.offset().left !=0) {
		$canvas.offset({top: 0, left: 0});
	}	
	
	//$canvas.css("background-color", "#eee");
}

function initFreehabdDrawing(indexh, indexv) {

	var canvasId = 'canvas' + indexh + '_' + indexv;
	if( $('#' + canvasId).length == 0 ) {
		initCanvas(canvasId);
	}
	else {
		console.log('canvas exist at (' + indexh + ', ' + indexv + ')!');
		return;
	}

    g_masterPaper = Raphael($canvas[0], $canvas.width(), $canvas.height());
	g_masterPaper.setViewBox(0,0, $canvas.width(), $canvas.height(), true);
	g_masterPaper.setSize('100%', '100%');
	$(g_masterPaper.canvas).css('z-index', 2);

    var masterBackground = g_masterPaper.rect(0, 0, $canvas.width(), $canvas.height());
    masterBackground.attr("fill", "#000");
    masterBackground.attr("fill-opacity", 0);
    masterBackground.attr("opacity", 0);
	masterBackground.toFront();

    masterBackground.mousemove(function(event) {
        var evt = event;
        var IE = document.all ? true : false;
        var x, y;
        if (IE) {
            x = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        } else {
            x = evt.pageX;
            y = evt.pageY;
        }
        // subtract paper coords on page
        this.ox = x - $canvas.offset().left;
        this.oy = y - $canvas.offset().top;
    });

    masterBackground.drag(
        move = function(dx, dy) {
            if (g_masterPathArray.length == 0) {
                g_masterPathArray[0] = ["M", this.ox, this.oy];
                g_masterDrawingBox = g_masterPaper.path(g_masterPathArray);
                g_masterDrawingBox.attr({
                    stroke: "#FF0000",
                    "stroke-width": 3
                });
            } else {
                g_masterPathArray[g_masterPathArray.length] = ["L", this.ox, this.oy];
            }
            g_masterDrawingBox.attr({
                path: g_masterPathArray
            });
        },
        start = function() {
            g_masterPathArray = new Array();
        },
        up = function() {
            //do nothing
        }
    );
}