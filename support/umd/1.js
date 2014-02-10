(function (root, factory) {
	
	// AMD
	if (typeof define === 'function' && define.amd) {
		define([
			'jquery'
		], factory);

	// CJS
	} else if (typeof exports === 'object') {
		module.exports = factory(
			require('jquery')
		);

	// Window global
	} else {
		root.share = factory(
			root.jquery
		);
	}
}(this, function (jQuery) {