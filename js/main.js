$( window ).resize(function() {
  $('.actions').each(function(){
  	var actions = $(this);
  	var btns = $('.btn',actions);
  	if (btns.length < 1) return 0;
  	var btnWidth = 0;
  	btns.width('auto').each(function(){
  		btnWidth += $(this).width();
  	});
  	var bttnSize = $('.container', actions).width()/$('.btn',actions).length;
  	btns.width(bttnSize-1);

  	var iconsAligned = $('.icon-aligned', actions);
  	if(iconsAligned.length < 0) return 0;
    var dottedLines = $('.dotted-line',actions);

    var contentHeight = $('.content').outerHeight();

    iconsAligned.show();
    dottedLines.show();
    if($(window).height() - contentHeight - actions.height() < iconsAligned.height()){
      // if there is not enough room for the icons
      iconsAligned.hide();
      dottedLines.hide();
      return;
    }

    var iconsTop = contentHeight - actions.position().top;

  	iconsAligned.css({
  		display:'block',
  		position:'absolute',
  		top:iconsTop,
  		left:function(){
  			var pos = (bttnSize-$(this).width())/2;
  			//if(pos < 1) return 0;
  			return pos;
  		},
  	});
  	if(dottedLines.length < 1) var dottedLines = $('<div class="dotted-line"></div>').insertAfter(iconsAligned);
  	dottedLines.css({
  		height:Math.abs(iconsTop) - 10,
  		top:iconsTop + 10, // moving dotted line underneath icon a smidge
  		left:function(){
  			var pos = (bttnSize-$(this).width())/2;
  			//if(pos < 1) return 0;
  			return pos;
  		},
  	});
  });
});


$(document).ready(function(){
	$(window).resize();
});