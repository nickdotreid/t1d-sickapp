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
				'margin-top': available_space/2 + $('.navbar:first').height(),
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
		}else{
			var matchedPages = $('.pane:first');
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