/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * wire/dom/reactive/tokensToString
 * converts ${} or {{}} tokens to html tags with data-wire-reactpoint attrs
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */
(function (define) {
define(function (require) {

	var parse, undef;

	parse = require('./simpleTemplate');

	/**
	 * Replaces simple tokens in a string.  Tokens are in the format ${key}.
	 * Tokens are replaced by values looked up in an associated hashmap.
	 * If a token's key is not found in the hashmap, an empty string is
	 * inserted instead.
	 * @private
	 * @param {String} template
	 * @param {Object} options
	 * @param {Object} [options.replace] the names of the properties of this
	 * object are used as keys. The values replace the token in the string.
	 * @param {Function} [options.transform] callback that deals with missing
	 * properties.
	 * @param {Function} [options.stringify] callback that stringifies a token.
	 *   If omitted, uses jsonPath-like property navigation to look up
	 *   properties on options.replace.
	 * @returns {String}
	 */
	function tokensToString (template, options) {
		var stringify, transform, output;

		stringify = options.stringify || stringifier;
		transform = options.transform || blankIfMissing;

		template = String(template);
		output = '';

		parse(
			template,
			function (text) { output += text; },
			function (key) { output += transform(stringify(key)); }
		);

		return output;

		function stringifier (key) {
			return findProperty(options.replace, key);
		}
	}

	return tokensToString;

	function blankIfMissing (val) { return val === undef ? '' : val; }

	function findProperty (obj, propPath) {
		var props, prop;
		props = propPath.split('.');
		while (obj && (prop = props.shift())) {
			obj = obj[prop];
		}
		return obj;
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));