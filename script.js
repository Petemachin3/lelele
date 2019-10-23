'use strict';
document.addEventListener("DOMContentLoaded", function () {
	//Polyfill für dialog-Element
	document.querySelector('#open-dialog')
		.addEventListener('click', toggleDialog);

	function toggleDialog() {
		var dialog = document.querySelector('dialog'),
			closeButton = document.getElementById('close-dialog');
		if (!dialog.hasAttribute('open')) {
			// show the dialog 
			dialog.setAttribute('open', 'open');
			// after displaying the dialog, focus the closeButton inside it
			closeButton.focus();
			closeButton.addEventListener('click', toggleDialog);
			// EventListener für ESC-Taste
			document.addEventListener('keydown', function (event) {
				if (event.keyCode == 27) {
					toggleDialog();
				}
			}, true);
			// only hide the background *after* you've moved focus out of the content that will be "hidden" 
			var div = document.createElement('div');
			div.id = 'backdrop';
			document.body.appendChild(div);
		} else {
			dialog.removeAttribute('open');
			var div = document.querySelector('#backdrop');
			div.parentNode.removeChild(div);
			lastFocus.focus();
		}
	}
});
