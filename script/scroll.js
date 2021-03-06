/*
 * this script modified from the original by @danheberden
 * on w3fools.com
*/


(function($) {
	$(function() {

		// Jakob Nielsen gets his own stylesheet
		$('a.nielsen').toggle(function(e) {
			e.preventDefault();
			$('link:eq(0)').attr('href', '/css/nielsen.css');
			$(this).text('Restore styles');
		}, function(e) {
			e.preventDefault();
			$('link:eq(0)').attr('href', '/css/screen.css');
			$(this).text('If you are Jakob Nielsen click here');
		});

		// supplement the default jQuery easing functions
		$.extend($.easing, {
			easeOutQuint: function (x, t, b, c, d) {
					return c*((t=t/d-1)*t*t*t*t + 1) + b;
			}
		});

		var $nav = $('#nav'),
			$navLinks = $nav.find('a'),
			cache = {};
			$docEl = $( document.documentElement ),
			$body = $( document.body ),
			$window = $( window ),
			$scrollable = $body; // default scrollable thingy, which'll be body or docEl (html)	
			
		// find out what the hell to scroll ( html or body )
		// its like we can already tell - spooky
		if ( $docEl.scrollTop() ) {
			$scrollable = $docEl;
		} else {
			var bodyST = $body.scrollTop();
			// if scrolling the body doesn't do anything
			if ( $body.scrollTop( bodyST + 1 ).scrollTop() == bodyST) {
				$scrollable = $docEl;
			} else {
				// we actually scrolled, so, er, undo it
				$body.scrollTop( bodyST - 1 );
			}
		}		

		// build cache
		$navLinks.each(function(i,v) {
			var href =  $( this ).attr( 'href' ),
				$target = $( href );
			if ( $target.length ) {
				cache[ this.href ] = { link: $(v), target: $target };
			}
		});

		// handle nav links
		$nav.delegate( 'a', 'click', function(e) {
		// alert( $scrollable.scrollTop() );
			e.preventDefault(); // if you expected return false, *sigh*
			if ( cache[ this.href ] && cache[ this.href ].target ) {
				$scrollable.animate( { scrollTop: cache[ this.href ].target.position().top }, 1000, 'easeOutQuint' );
			}
		});

		// auto highlight nav links depending on doc position
		var deferred = false,
			timeout = false, // so gonna clear this later, you have NO idea
			last = false, // makes sure the previous link gets un-activated
			check = function() {
				var scroll = $scrollable.scrollTop(),
					height = $body.height();
					// tolerance = $window.height() * ( scroll / height );
				// alert(tolerance);
					// tolerance = 500;

				$.each( cache, function( i, v ) {
					// console.log("Link Target Top: " + v.target.position().top);
					// console.log("Scroll Top: " + scroll);
					// if we're past the link's section, activate it
					if ( scroll + $window.height() >  v.target.position().top  ) {
						last && last.removeClass('active');
						last = v.link.addClass('active');
					} else {
						v.link.removeClass('active');
						return false; // get outta this $.each
					}

					if ( scroll > (v.target.position().top + 700) ) {
						last && last.removeClass('active');
						// return false; // get outta this $.each
					}
					
					

				});

				// all done
				clearTimeout( timeout );
				deferred = false;
			};

		// work on scroll, but debounced
		var $document = $(document).scroll( function() {
			// timeout hasn't been created yet
			if ( !deferred ) {
				timeout = setTimeout( check , 250 ); // defer this stuff
				deferred = true;
			}
		});

		// fix any possible failed scroll events and fix the nav automatically
		(function() {
			$document.scroll();
			setTimeout( arguments.callee, 1500 );
		})();
		

		// function to display "depth"
		$(document).on('scroll', function() {
			$('.depth').html($(window).scrollTop() / 2 + " meters");
		});

	});

})(jQuery);
