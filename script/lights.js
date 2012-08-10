	
var ran = function(min, max) {
	return ((Math.random() * (max - min)) + min).toFixed(2);
};

var degrees = function(radians) {
	return radians * (180 / Math.PI)
};


$(document).ready(function() {

	//events      
	var events = {
		mouse_move: function(event) {}
	};

	$(window).on('mousemove', events.mouse_move);
	/*
	$(window).resize(function() {
		paper.setSize($('body').innerWidth(), $('body').innerHeight());
	});
	*/


	var SCREEN_WIDTH = $('body').innerWidth(); //999;// 465;
	var SCREEN_HEIGHT = $('body').innerWidth(); //999; //465;
	console.log(SCREEN_HEIGHT);
	var DAMP = 0.98;
	var temp_width = $('body').innerWidth();
	var temp_height = $('body').innerHeight();
	var paper = new ScaleRaphael("lights", temp_width, temp_height);
	var url = "image/particle1.png";
	
	// Precompute some constants we will need
	var PIBY2 = Math.PI / 2;
	var ToDegrees = 180 / Math.PI;

	var circle = (function() {
		var x = SCREEN_WIDTH / 2,
				y = SCREEN_HEIGHT / 2,
				vx = Math.random() - 0.5,
				vy = Math.random() - 0.5,
				dot;

		return {
				start: function() {
						var scale = ran(0.3, 30.0);
						dot = paper.image(url, x, y, 99, 99).attr({ // 76, 37
								//opacity: scale
						});
						dot.scale(scale);
				},
				update: function() {
						vx += Math.random() * 0.5 - 0.25;
						vy += Math.random() * 0.5 - 0.25;
						
						var newx = x + vx;
						var newy = y + vy;

						
						var dy = newy - y;
						var dx = newx - x;
																					 
						var a = 1; // (Math.atan2(dy, dx) + PIBY2)*ToDegrees;  // The new target rotation in degrees
						dot.transform("r"+a);
                
                x += vx;
                y += vy;

                vx *= DAMP;
                vy *= DAMP;

                //check bounds invert direction 
                vx = x < 50 ? vx * -1 : x > temp_width ? vx * -1 : vx; //415 // 800
                vy = y < 50 ? vy * -1 : y > temp_height ? vy * -1 : vy; // 800
                x = x < 0 ? SCREEN_WIDTH : x > SCREEN_WIDTH ? 0 : x;
                y = y < 0 ? SCREEN_HEIGHT : y > SCREEN_HEIGHT ? 0 : y;

                dot.attr({
                    x: x,
                    y: y
                });                
            }
        };
    });


    var dots = [],
        i = 15;

    while (i--) {
        dots[i] = new circle();
        dots[i].start();
    }

    setInterval(function() {
        var l = dots.length;
        while (l--) {
            dots[l].update();
        }
    }, 1000 / 10);


		function resizePaper() {
			var win = $(this);
			paper.changeSize(win.width(), win.height(), true, false);
		}
		resizePaper();
		$(window).resize(resizePaper);

		});
