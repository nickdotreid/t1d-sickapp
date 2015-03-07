var Pane = Backbone.View.extend({
	initialize: function() {
		this.render();
	},
	render:function(){
		var pane = this;
		this.$el.show();

		  this.$('.actions').each(function(){
		  	var actions = $(this);
		  	var btns = $('.btn',actions);
		  	if (btns.length < 1) return 0;
		  	var btnWidth = 0;
		  	btns.width('auto').each(function(){
		  		btnWidth += $(this).width();
		  	});
		  	var bttnSize = pane.$('.container', actions).width()/$('.btn',actions).length;
		  	btns.width(bttnSize-1);

		  	var iconsAligned = pane.$('.icon-aligned', actions);
		  	if(iconsAligned.length < 0) return 0;
		    var dottedLines = pane.$('.dotted-line',actions);

		    var contentHeight = pane.$('.content').outerHeight();

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
		this.$el.hide();
	},
	enter: function(){
		this.$el.show();
		if(this.$el.hasClass("pane-why")) $('.navbar:not(.pane .navbar)').hide();
	},
	exit: function(){
		this.$el.hide();
		if(this.$el.hasClass("pane-why")) $('.navbar:not(.pane .navbar)').show();
	},
});

var Workspace = Backbone.Router.extend({
	routes:{
		"*path":"page", // gotta catch em all
	},
	page: function(path){
		var router = this;
		if(router.currentPane) router.currentPane.exit();
		router.currentPane = false;
		$('#'+path+':first').each(function(){
			router.currentPane = new Pane({
				el:this,
			});
		});
		if(!router.currentPane){
			router.currentPane = new Pane({
				el:$('.pane:first')[0],
			});
		}
		router.currentPane.enter();
	}
});
var workspace = new Workspace();
Backbone.history.start();