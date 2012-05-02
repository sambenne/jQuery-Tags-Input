About
==========

jQuery Tags Input is a jQuery Plug-in.

Change Log
==========

Version 1.2
------------

 - I have implemented the autocomplete.
 - minChars works with the autocomplete. I will be adding it to the input and adding maxChars at the same time.

I have created my own autocomplete for this so it is at the moment rather basic. It can work either by having direct content or the link to the JSON file. To the the JSON I have used jQuery's $.getJSON function.

Version 1.1.1
------------

 - I have added limit. So you can limit the amount of tags.

Version 1.1
------------

 - First Upload only tested properly on Chrome.

To Do
=========

 - Clean up the files and directories
 - ~~Create a minified version~~
 - Test in other browsers
 - Make sure it works in old machines
 - Test how well it works on mobiles.

Instructions
=========

Options
=========

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
		minChars: 0,
		autocomplete_url: url_to_autocomplete_api,
		autocomplete: { option: value, option: value}
		/* TO DO */
		maxChars: 0,
		onChange: null,
		onHide: null,
		onDestroy: null,
		onUpdate: null
	};