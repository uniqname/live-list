var beginInterval = function (prevInterval, fn, time) {
		var i;
		
		endInterval(prevInterval);

		if (time && time > 0) {
			i = window.setInterval(fn, time);
		}

		console.log('interval set to ', i);
		
		return i;
	},
	endInterval= function (prevInterval) {
		console.log('clearing interval: ', prevInterval);
		clearInterval(prevInterval);

		return null;
	};

module.exports = {
	beginInterval: beginInterval,
	endInterval: endInterval
};