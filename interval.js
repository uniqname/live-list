var beginInterval = function (prevInterval, fn, time) {
		endInterval(prevInterval);

		if (time && time > 0) {
			return window.setInterval(fn, time);
		}
	},
	endInterval= function (prevInterval) {
		clearInterval(prevInterval);

		return null;
	};

module.exports = {
	beginInterval: beginInterval,
	endInterval: endInterval
};