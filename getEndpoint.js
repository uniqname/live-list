var Promise = require('./promises.js'),
	XHR = require('./xhr.js');

module.exports = function (endpoint) {
	var prms = new Promise(function (resolve, reject) {
		var xhr = new XMLHttpRequest();

		xhr.open('GET', endpoint, true);
		xhr.onload = function () {
			if ([404, 500].indexOf(xhr.status) !== -1) {
				reject(xhr.responseText);
			} else {
				resolve(xhr.responseText);
			}
		};
		xhr.onerror = function () {
			reject(xhr.responseText);
		};
		xhr.send();
	});

	return prms;
}