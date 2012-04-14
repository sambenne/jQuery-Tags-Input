/**
* jQuery Tags Input Plugin 1.1
* www.sam-benne.co.uk
* Copyright 2012, Sam Bennett
* Free to use under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/
;(function($) {
	var defaults = {
		id: null,
		delimiter: ',',
		interactive: true,
		unique: true,
		removeWithBackspace: true,
		placeholder: 'add a tag',
		removeDuplicates: true,
		onAddTag: null,
		onRemoveTag: null,
		onCreate: null
		/*minChars: 0,
		maxChars: 0,
		onChange: null,
		autocomplete_url: url_to_autocomplete_api,
		autocomplete: { option: value, option: value},
		onHide: null,
		onDestroy: null,
		onUpdate: null*/
	};

	$.tagsinput = function(e, o) {
		this.settings = $.extend({}, defaults, o || {});
		this.elem = e;
		this.init();
	};

	var $ti = $.tagsinput;

	$ti.fn = $ti.prototype = {
		tagsinput: '0.1'
	};

	$ti.fn.extend = $ti.extend = $.extend;

	$ti.fn.extend({
		init: function() {
			var self = this;
			var tempid = null;
			if(typeof $(self.elem).attr('id') === "undefined") {
				var temp = ($('.tagsinput_display').length > 0 ? $('.tagsinput_display').length : 0);
				$(self.elem).attr('id', 'tags_'+temp);
			}
			self.settings.id = $(self.elem).attr('id');
			self.settings.taglist = {};
			self.create();
			$('#'+self.settings.id).hide();
		},
		create: function() {
			var self = this;
			$('<div/>', {
				class: 'tagsinput_display',
			}).insertAfter('#'+self.settings.id);
			if(self.settings.interactive) {
				$('#'+self.settings.id).next('.tagsinput_display').append($('<input/>').attr({
					class: 'tagsinput_input_'+self.settings.id,
					type: 'text',
					placeholder: self.settings.placeholder
				}));
				$(document).on('keydown', '.tagsinput_input_'+self.settings.id, function(e) {
					var keyCode = e.keyCode || e.which;
					if (keyCode == 13 || keyCode == 9 || keyCode == 188) {
						e.preventDefault();
						if($.trim($(this).val()) !== "") {
							self.addTag(($(this).val().indexOf(self.settings.delimiter, 0) > 0 ? $(this).val().substr(0, ($(this).val().length - 1)) : $(this).val()));
							if(!self.tagExist($(this).val()) === false) $(this).addClass('tagsinput_error');
							else $(this).val('').removeClass('tagsinput_error');
						}
					} else if(keyCode == 8) {
						if(self.settings.removeWithBackspace === true) {
							if($(this).val() === "") self.removeTag();
						}
					}
				});
				$(document).on('keyup', '.tagsinput_input_'+self.settings.id, function(e) {
					var keyCode = e.keyCode || e.which;
					if (keyCode == 13 || keyCode == 9) e.preventDefault();
					if(!self.tagExist($(this).val()) === false) $(this).addClass('tagsinput_error');
					else $(this).removeClass('tagsinput_error');
				});
			}
			this.importTags();
			$(document).on('click.tagsinput', '.removeTag_'+self.settings.id, function(e) {
				e.preventDefault();
				self.removeTag($(this).prev().text());
			});
			if(typeof self.settings.onCreate === "function") self.settings.onCreate.call();
		},
		addTag: function(tag) {
			var id = this.settings.id;
			var add = false;
			if(this.settings.unique === true) add = !this.tagExist(tag);
			else add = true;
			if(add === true) {
				this.settings.taglist[Object.keys(this.settings.taglist).length] = tag;
				if($('#'+id).next().children('.tag').length === 0)
					$('#'+id).next().prepend(this.createTag(tag));
				else
					$(this.createTag(tag)).insertBefore($('#'+id).next().children('input'));
				if($('#'+id).val() === "") $('#'+id).val(tag);
				else $('#'+id).val($('#'+id).val()+this.settings.delimiter+tag);
				$('.tagsinput_input_'+id).val('').focus();
			}
			if(typeof this.settings.onAddTag === "function") this.settings.onAddTag.call();
		},
		importTags: function() {
			var self = this, id = this.settings.id, add = false, dirtyTags = null;
			if($('#'+id).val() !== "") dirtyTags = $('#'+id).val().split(this.settings.delimiter);
			if(dirtyTags !== null) {
				$.each(dirtyTags, function(k, v) {
					if(self.settings.unique === true) add = !self.tagExist(v);
					else add = true;
					if(add === true) {
						self.settings.taglist[Object.keys(self.settings.taglist).length] = v;
						if($('#'+id).next().children('.tag').length === 0) {
							$('#'+id).next().prepend(self.createTag(v));
						} else {
							$(self.createTag(v)).insertBefore($('#'+id).next().children('input'));
						}
					}
				});
				if(self.settings.removeDuplicates === true) {
					var string = "";
					for (var key in this.settings.taglist) string += this.settings.taglist[key] + this.settings.delimiter;
					$('#'+this.settings.id).val(string.substr(0, (string.length - 1)));
				}
			}
		},
		tagExist: function(tag, elem) {
			if(Object.keys(this.settings.taglist).length === 0) return false;
			var found = false;
			$.each(this.settings.taglist, function(k, v) {
				if(v === tag) found = true
			});
			return found;
		},
		removeTag: function(tag) {
			tag = (typeof tag === "undefined" ? null : tag);
			var taglist = this.settings.taglist, string = "", last = null;
			if(tag === null) {
				for (var key in taglist) {
					if (taglist.hasOwnProperty(key)) last = key;
				}
				delete taglist[last];
				for (var key in taglist) string += taglist[key] + this.settings.delimiter; 
				$('#'+this.settings.id).val(string.substr(0, (string.length - 1)));
				$('#'+this.settings.id).next().children('.tag').last().remove();
			} else {
				for (var key in taglist) {
					if (taglist.hasOwnProperty(key) && taglist[key] === tag) last = key;
				}
				delete taglist[last];
				for (var key in taglist) string += taglist[key] + this.settings.delimiter; 
				$('#'+this.settings.id).val(string.substr(0, (string.length - 1)));
				$('#'+this.settings.id).next().children('.tag').children('span:contains('+tag+')').parent().remove();
			}
			if(typeof this.settings.onRemoveTag === "function") this.settings.onRemoveTag.call();
		},
		createTag: function(tag) {
			var $tag = $('<span />');
			$tag.attr("class", "tag");
			$tag.append($('<span />').html(tag));
			$tag.append($('<a />').attr({"href": '#', 'class': 'removeTag removeTag_'+this.settings.id}).html('&#215;'));
			return $tag;
		}
	});

	$.fn.tagsinput = function(o) {
		if (typeof o == 'string') {
			var instance = $(this).data('tagsinput'), args = Array.prototype.slice.call(arguments, 1);
			return instance[o].apply(instance, args);
		} else {
			return this.each(function(k, v) {
				var instance = $(this).data('tagsinput');
				if (instance) {
					if (o) $.extend(instance.options, o);
				} else {
					$(this).data('tagsinput', new $ti(this, o));
				}
			});
		}
	};
})(jQuery);