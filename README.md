About
==========

jQuery Tags Input is a jQuery Plug-in.

Change Log
==========

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
		/* TO DO */
		minChars: 0,
		maxChars: 0,
		onChange: null,
		autocomplete_url: url_to_autocomplete_api,
		autocomplete: { option: value, option: value},
		onHide: null,
		onDestroy: null,
		onUpdate: null
	};