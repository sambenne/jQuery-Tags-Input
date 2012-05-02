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
		onCreate: null,
		limit: null,
		autocomplete: null, /* { option: value, option: value } */
		autocomplete_url: null, /* url_to_autocomplete_api */
		minChars: 0
		/*
		maxChars: 0,
		onChange: null,
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
				/* Create Input */
				$('#'+self.settings.id).next('.tagsinput_display').append($('<input/>').attr({
					class: 'tagsinput_input_'+self.settings.id,
					type: 'text',
					placeholder: self.settings.placeholder
				}));
				/* The main event */
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
					/* Auto complete */
					if(self.settings.autocomplete !== null || self.settings.autocomplete_url !== null) {
						self.autoComplete($(this).val(), self);
					}
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
			var tagLength = Object.keys(this.settings.taglist).length;
			if(this.settings.unique === true) add = !this.tagExist(tag); else add = true;
			if(add === true && (this.settings.limit === null || tagLength <= this.settings.limit)) {
				this.settings.taglist[tagLength] = tag;
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
		},
		autoComplete: function(term) {
			var $input = '.tagsinput_input_'+this.settings.id;
			var p = $($input).position();
			if(term.length >= this.settings.minChars) {
				if($('.autocomplete').length === 0) $($input).after('<div class="autocomplete"></div>');
				$('.autocomplete').css({"left": p.left + "px", "display": "none"});
				if(this.settings.autocomplete !== null) {
					var data = this.settings.autocomplete;
					this.autoCompleteFilter(term, data, $input);
				} else if(this.settings.autocomplete_url !== null) {
					var $self = this;
					$.getJSON(this.settings.autocomplete_url, function(ret) {
						$self.autoCompleteFilter(term, ret, $input);
					});
				}
			}
		},
		autoCompleteFilter: function(term, data, $input) {
			var found = {}
			$('.autocomplete').html('<ul class="itemWrapper"></ul>');
			$.map(data, function (val, key) {
				var isFound = val.search(new RegExp(term, "i"));
				if(isFound === 0) found[key] = val;
			});
			if(Object.keys(found).length > 0) $('.autocomplete').css("display", "block");
			$.each(found, function(k, v) {
				$('.autocomplete ul').append('<li id="'+k+'" class="itemHolder"><span class="item">'+v+'</span></li>');
			});
			$(document).on('click', '.autocomplete li', function() {
				$($input).val($(this).text()).focus();
				$('.autocomplete').remove();
			});
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