var Page = Backbone.View.extend({
	events:{
		'click .back':'back',
		'click a.btn':'setValue',
	},
	back: function(event){
		event.preventDefault();
		window.history.back();
	},
	setValue: function(event){
		var btn = $(event.currentTarget);
		if(btn.data("set")) this.trigger("change",btn.data("set"));
	},
});

var Pane = Page.extend({
	initialize: function() {
		var pane = this;
		$(window).resize(function(){
			if(pane.$el.is(':visible') && !pane.animating ) pane.render();
		});
		pane.render();
	},
	render:function(){
		if(this.animating) return false;

		var is_visible = this.$el.is(':visible');
		if(!is_visible) this.$el.show();
		this.center_content();
		this.$('.icon-trio-centered').each(function(){
			var div = $(this);
			var width = _.reduce($('.icon',div),function(num, icon){
				return num + $(icon).outerWidth(true);
			}, 0);
			div.width(width);
		});
		if(!is_visible) this.$el.hide();
	},
	center_content: function(){
		/* Adds margin to center content container */
		var available_space = $(window).height();
		available_space -= $('.navbar:first').height();
		available_space -= this.$('.content').outerHeight();
		available_space -= this.$('.actions').outerHeight();

		if(available_space > 0){
			this.$('.content').css({
				'padding-top': available_space/2 + $('.navbar:first').height(),
				'padding-bottom': available_space/2,
			});
		}else{
			this.$('.content').css({
				'padding-top': $('.navbar:first').height(),
				'padding-bottom': this.$('.actions').outerHeight(),
			});
		}
	},
	enter: function(callback_func){
		var pane = this;
		this.$el.show();
		this.$el.css({
			top: $(window).height(),
		});
		this.$('.actions').css({
			bottom: 0 - this.$('.actions').outerHeight(),
		});
		this.$el.animate({
			top:0,
		},{
			duration:250,
			complete:function(){
				pane.$('.actions').animate({
					bottom:0,
				}, 150);
			}
		});
		if(this.$el.hasClass("pane-why")) $('.navbar:not(.pane .navbar)').hide();
	},
	exit: function(callback_func){
		var pane = this;
		this.$el.show();
		this.$el.css({
			top: 0,
		});
		this.$('.actions').css({
			bottom: 0,
		});
		this.$('.actions').animate({
			bottom: 0 - this.$('.actions').outerHeight(),
		},{
			duration:150,
			complete:function(){
				
			}
		});
		pane.$el.animate({
				top:0 - $(window).height(),
			}, {
				duration: 250,
				complete:function(){
					pane.$el.hide();
				}
			});
		if(this.$el.hasClass("pane-why")) $('.navbar:not(.pane .navbar)').show();
	},
});

var Workspace = Backbone.Router.extend({
	routes:{
		":path?:args":"page",
		"*path":"page", // gotta catch em all
	},
	initialize: function(){
		new Page({
			el:$('.navbar:first'),
		});
	},
	page: function(path,args){
		if(args){
			if(args.indexOf('pump') >= 0) this.device = 'pump';
			if(args.indexOf('shots') >= 0) this.device = 'shots';
			if(args.indexOf('high') >= 0) this.bloodsugar = 'high';
			if(args.indexOf('low') >= 0) this.bloodsugar = 'low';
			if(args.indexOf('small') >= 0) this.ketones = 'small';
			if(args.indexOf('large') >= 0) this.ketones = 'large';
		}
		var router = this;
		if(router.currentPane) router.currentPane.exit();
		router.currentPane = false;

		if(path){
			var matchedPages = $(".pane[pane-id="+path+"]");
		}
		if(!path || matchedPages.length < 1){
			var matchedPages = $('.pane:first');
			router.device = false;
			router.bloodsugar = false;
			router.ketones = false;
		}
		if(matchedPages.length > 1){
			var router = this;
			matchedPages = _.filter(matchedPages, function(div){
				var pane = $(div);
				checkMatch = function(attr){
					if(!pane.data(attr)) return true;
					if(router[attr] == pane.data(attr)) return true;
					return false;
				}
				if(!checkMatch("device")) return false;
				if(!checkMatch("bloodsugar")) return false;
				if(!checkMatch("ketones")) return false;
				return true;
			});
		}
		router.currentPane = new Pane({
			el:matchedPages[0],
		});
		router.currentPane.on("change",function(message){
			var parts = message.split(":");
			router[parts[0]] = parts[1];
		});
		router.currentPane.enter();
	}
});
var workspace = new Workspace();
Backbone.history.start();