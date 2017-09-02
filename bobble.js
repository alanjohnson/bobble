// jQuery Bobble
// by Alan Johnson www.fancyscribbles.com (C) 2010
// Updated 3.15.2017

$(function(){
  $('#bobblebox01 .bobble').bobble({dampener: 35}); // run bobble plugin on given object
  //$('#bobblebox01 .bobble').bobble(); // run bobble plugin on given object
});

(function( $ ) {
  var angle = 1;
  $.fn.bobble = function(options) {
    return this.each(function(){
      var settings = $.extend({}, jQuery.fn.bobble.defaults, options);
      var enteredAt_x = 0;
      var enteredAt_y = 0;
      var mouseEnteredAt_x = 0;
      var mouseEnteredAt_y = 0;
      var leftAt_x = 0;
      var leftAt_y = 0;
      var $this = $(this);

      // set pivot point
      $this.css({
        "transform-origin":settings.pivot,
        "-ms-transform-origin":settings.pivot,
        "-webkit-transform-origin":settings.pivot,
        "-moz-transform-origin":settings.pivot,
        "-o-transform-origin":settings.pivot
      });

      $this.mouseover(function(e) {
        // on mouseover check to see if it's already moving.
        $this.stop(true);
        $this.css({
          'left': 0,
          'top': 0,
          '-ms-transform': 'rotate(0deg) scale(1)',
          '-webkit-transform': 'rotate(0deg) scale(1)',
          '-moz-transform': 'rotate(0deg) scale(1)',
          '-o-transform': 'rotate(0deg) scale(1)',
          'transform': 'rotate(0deg) scale(1)'
        });
        moveable = true;
        enteredAt_y = e.pageY-$this.offset().top;
        enteredAt_x = e.pageX-$this.offset().left;
        mouseEnteredAt_x = e.pageX;
        mouseEnteredAt_y = e.pageY;
      });

      $this.mousemove(function(e) {
        // collect the elements x and y starting positions
        var offset = $this.offset();
        var x = e.pageX - (offset.left);
        var y = e.pageY - (offset.top);
        // pull and push effect - on mouse over, how much to drag the element in the given direction.
        var push_x = -(enteredAt_x - x)/settings.dampener;
        var push_y = -(enteredAt_y - y)/settings.dampener;
        $this.css({
          'left': push_x,
          'top': push_y,
          '-ms-transform': 'rotate('+push_x*settings.wobble*3+'deg) scale('+(1+(push_y/(settings.push*100)))+')',
          '-webkit-transform': 'rotate('+push_x*settings.wobble*3+'deg) scale('+(1+(push_y/(settings.push*100)))+')',
          '-moz-transform': 'rotate('+push_x*settings.wobble*3+'deg) scale('+(1+(push_y/(settings.push*100)))+')',
          '-o-transform': 'rotate('+push_x*settings.wobble*3+'deg) scale('+(1+(push_y/(settings.push*100)))+')',
          'transform': 'rotate('+push_x*settings.wobble*3+'deg) scale('+(1+(push_y/(settings.push*100)))+')'
        });
      });

      $this.mouseout(function(e) {
        // just set a limit in case of some crazy return value from really fast mouse movement out of window
        leftAt_x = (e.pageX - mouseEnteredAt_x)/settings.dampener;
        leftAt_y = (e.pageY - mouseEnteredAt_y)/settings.dampener;
        var rotation = $(this).attr('style');
        var degree = parseInt( rotation.match(/rotate\(([^)]+)\)/)[1].replace('deg','') );
        leftAt_r = parseFloat(degree);
        if (leftAt_x > 20){leftAt_x = 10;}
        if (leftAt_x < -20){leftAt_x = -10;}
        if (leftAt_y > 20){leftAt_y = 10;}
        if (leftAt_y < -20){leftAt_y = -10;}
        // mouse out bounces back animation
        for(var i = settings.bounces; i >= 0; i--) {
          // TODO: add easing / Exponential Decay instead of basic linear decline
          percent = (1/settings.bounces)*i;
          animateIt(leftAt_x, leftAt_y, leftAt_r, percent);
        }
        function animateIt(x,y,r,p) {
          $this.animate({  borderSpacing: (-r*settings.wobble*p) }, {
              duration:settings.speed,
              step: function(now,fx) {
                $(this).css('-ms-transform','rotate('+now+'deg) scale('+(1-(leftAt_y/(settings.push*100)*percent))+')');
                $(this).css('-webkit-transform','rotate('+now+'deg) scale('+(1-(leftAt_y/(settings.push*100)*percent))+')');
                $(this).css('-moz-transform','rotate('+now+'deg) scale('+(1-(leftAt_y/(settings.push*100)*percent))+')');
                $(this).css('-o-transform','rotate('+now+'deg) scale('+(1-(leftAt_y/(settings.push*100)*percent))+')');
                $(this).css('transform','rotate('+now+'deg) scale('+(1-(leftAt_y/(settings.push*100)*percent))+')');
              }
          }).animate({left: -leftAt_x*percent,top: -leftAt_y*percent }, {'queue': false}, settings.speed );

          $this.animate({  borderSpacing: (r*settings.wobble*p) }, {
            duration:settings.speed,
              step: function(now,fx) {
                $(this).css('-ms-transform','rotate('+now+'deg) scale('+(1+(leftAt_y/(settings.push*100)*percent))+')');
                $(this).css('-webkit-transform','rotate('+now+'deg) scale('+(1+(leftAt_y/(settings.push*100)*percent))+')');
                $(this).css('-moz-transform','rotate('+now+'deg) scale('+(1+(leftAt_y/(settings.push*100)*percent))+')');
                $(this).css('-o-transform','rotate('+now+'deg) scale('+(1+(leftAt_y/(settings.push*100)*percent))+')');
                $(this).css('transform','rotate('+now+'deg) scale('+(1+(leftAt_y/(settings.push*100)*percent))+')');
              }
          }).animate({left: leftAt_x*percent,top: leftAt_y*percent }, {'queue': false}, settings.speed );
        }
      });
    });
  };

  // add default options.
  $.fn.bobble.defaults = {
    dampener: 25, // bigger the number, the smaller the effect
    bounces: 8, // number of times to bounch back and forth
    wobble: 1, // how much the head rotates
    speed: 100, // how fast the animation plays
    push: 2, // bigger number = less scale in object size on wobble
    pivot: "50% 80%",  // where the object pivot should be
  };

})( jQuery );
