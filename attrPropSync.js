module.exports = function (el, prop, type) {
	return {
		get: function () {
			var val = el.getAttribute(prop);
			if (type === 'number') {
				return parseInt(val, 10);
			} else {
				return val;
			}

		},
		set: function (val) {
			if (type === 'number') {
				if (!isNaN(parseInt(val, 10))) {
					el.setAttribute(prop, val);
				}
			} else {
				el.setAttribute(prop, val);
			}
		}
	};
}