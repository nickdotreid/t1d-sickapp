var Page = Backbone.View.extend({
	events:{
		'click .back':'back',
	},
	back: function(event){
		event.preventDefault();
		window.history.back();
	}
});

var Pane = Page.extend({
	initialize: function() {
		this.render();
	},
	render:function(){
		this.$el.show();
		this.center_content();
		this.$el.hide();
	},
	center_content: function(){
		/* Adds margin to center content container */
		var available_space = $(window).height();
		available_space -= $('.navbar:first').height();
		available_space -= this.$('.content').outerHeight();
		available_space -= this.$('.actions').outerHeight();

		if(available_space > 0){
			this.$('.content').css({
				'margin-top': available_space/2,
				'margin-bottom': available_space/2,
			});
		}else{
			this.$('.content').css({
				'margin-top': $('.navbar:first').height(),
				'margin-bottom': '0px',
			});
		}
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
	initialize: function(){
		new Page({
			el:$('.navbar:first'),
		});
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