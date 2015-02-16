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

  	iconsAligned.css({
  		display:'block',
  		position:'absolute',
  		top:$('.content').outerHeight() - actions.position().top,
  		left:function(){
  			var pos = (bttnSize-$(this).width())/2;
  			//if(pos < 1) return 0;
  			return pos;
  		},
  	})
  	var dottedLines = $('.dotted-line',actions);
  	if(dottedLines.length < 1) var dottedLines = $('<div class="dotted-line"></div>').insertAfter(iconsAligned);
  	dottedLines.css({
  		height:Math.abs($('.content').outerHeight() - actions.position().top) - 10,
  		top:$('.content').outerHeight() - actions.position().top + 10,
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