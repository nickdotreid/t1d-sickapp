$( window ).resize(function() {
  $('.actions').each(function(){
  	var actions = $(this);
  	var btns = $('.btn',actions);
  	if (btns.length < 1) return 0;
  	var btnWidth = 0;
  	btns.width('auto').each(function(){
  		btnWidth += $(this).width();
  	});
  	var bttnSize = ($('.container', actions).width() - btnWidth)/$('.btn',actions).length;
  	btns.width(bttnSize);
  });
});


$(document).ready(function(){
	$(window).resize();
});