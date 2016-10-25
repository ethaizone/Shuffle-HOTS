// @author EThaiZone <ethaizone@hotmail.com>
// This code cannot use in commercial.
// Require jQuery


function getCoords( e ){
  var ev = e.originalEvent || e,
    touches = ev.touches || ev.targetTouches;

  if( touches ){
    return [ touches[ 0 ].pageX, touches[ 0 ].pageY ];
  }
  else {
    return null;
  }
}

module.exports = function (jQuery) {
    return function (mother, child, callback)
    {
      var active = false,
        startX,
        startY,
        cancel,
        scrollTolerance = 10,
        resetTimer,
        tapHandling;
      jQuery(mother).on('mouseup mouseleave touchend', child, function(e) {
        var $this = jQuery(this);
        var timeoutId = $this.data('hac_setTimeout');
        var callback = $this.data('hac_callback');
        if (! timeoutId) {
          return;
        }

        clearTimeout( resetTimer );
        resetTimer = setTimeout( function(){
          tapHandling = false;
          cancel = false;
        }, 1000 );

        // make sure no modifiers are present. thx http://www.jacklmoore.com/notes/click-events/
        if( ( e.which && e.which > 1 ) || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey ){
          return;
        }

        if( cancel || tapHandling && tapHandling !== e.type ){
          cancel = false;
          return;
        }

        tapHandling = e.type;


        if (timeoutId && !active)
        {
          console.log('click!');
          clearTimeout(timeoutId);
          callback(false);
        }

        console.log('clear!');
        active = false;
        $this.data('hac_setTimeout', 0);
        $this.data('hac_callback', "");
      });

      jQuery(mother).on('touchmove', child, function(e) {
        if( !cancel ){
          var coords = getCoords( e );
          if( coords && ( Math.abs( startY - coords[ 1 ] ) > scrollTolerance || Math.abs( startX - coords[ 0 ] ) > scrollTolerance ) ){
            cancel = true;
            var $this = jQuery(this);
            var timeoutId = $this.data('hac_setTimeout');
            clearTimeout(timeoutId);
            active = false;
            $this.data('hac_callback', "");
            $this.data('hac_setTimeout', 0);
          }
        }
      });

      jQuery(mother).on('mousedown touchstart', child, function(e) {
        if (active == true) {
          return;
        }
        var coords = getCoords( e );
        if (coords) {
          startX = coords[ 0 ];
          startY = coords[ 1 ];
        }
        console.log('start!');
        var $this = jQuery(this);
        var hac_callback = function(isHold){
          active = true;
          callback($this, isHold);
          active = false;
          $this.data('hac_setTimeout', 0);
          $this.data('hac_callback', "");
          console.log('callback!', isHold);
        };
        var timeoutId = $this.data('hac_setTimeout');
        if (! timeoutId)
        {
          var timeoutId = setTimeout(function(){
            console.log('hold!');
            hac_callback(true);
          }, 900);

          $this.data('hac_setTimeout', timeoutId);
          $this.data('hac_callback', hac_callback);
        }


      });
    }
};
