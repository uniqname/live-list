(function () {
	var render = require('./domingo.js'),
		importDoc = document.currentScript.ownerDocument,
		getEndpoint = require('./getEndpoint.js'),
		intervals = require('./interval'),
		foo = (function () {
			console.log(intervals);
		})(),
		interval = intervals.beginInterval,
		endInterval = intervals.endInterval,
		bar = (function () {
			console.log(intervals);
		})(),
		updateList = require('./updateList.js'),
		syncUp = function (liveList) {
			getEndpoint(liveList.endpoint).then(function (data) {
					updateList(data, liveList);
				}, function (rejectMsg) {
					liveList.intervalVal = endInterval(liveList.intervalVal);
					console.error('There was a problem with the endpoint "' + liveList.endpoint + '". Further requests have been canceled.');
					console.log(rejectMsg);
				});
		},
		onCreate = function () {
			var t = importDoc.querySelector('#live-list-template'),
				clone = document.importNode(t.content, true),
				thisLiveList = this;

			Object.defineProperty(this, 'intervalVal', {
				enumerable: false,
				configurable: false,
				writable: true,
				value: 0
			});

			this.createShadowRoot().appendChild(clone);

			console.log('A live-list element was created');

			if (thisLiveList.endpoint) {

				// Sync immediately upon create
				syncUp(thisLiveList);

				if (thisLiveList.frequency) {
					console.log('getting ready to clear', this.intervalVal);
					this.intervalVal = interval(this.intervalVal, function () {
						syncUp(thisLiveList);
					}, thisLiveList.frequency * 1000);
				}
			}
		},

		onAttrChange = function (attrName, oldVal, newVal) {
			var vals = [].slice.call(arguments, 1),
				thisLiveList = this;

			console.log('the ' + attrName + ' attribute changed from ' + oldVal + ' to ' + newVal);

			if (attrName === 'endpoint') {

				onEndpointChange.apply(this, vals);
				if (this.frequency) {

					console.log('getting ready to clear', this.intervalVal);
					this.intervalVal = interval(this.intervalVal, function () {
						syncUp(thisLiveList);
					}, thisLiveList.frequency * 1000);
				} else {
					syncUp(thisLiveList);
				}
			} else if (attrName === 'frequency') {
				onFrequencyChange.apply(this, vals);

				console.log('getting ready to clear', this.intervalVal);
				this.intervalVal = interval(this.intervalVal, function () {
					syncUp(thisLiveList);
				}, thisLiveList.frequency * 1000);
			}
		},

		onEndpointChange = function (oldEndpoint, newEndpoint) {
			this.endpoint = newEndpoint;
		},

		onFrequencyChange = function (oldFreq, newFreq) {
			this.frequency = newFreq;
		},

		liveListProto = Object.create(HTMLUListElement.prototype, {
			createdCallback: {
				value: onCreate
			},
			attributeChangedCallback: {
				value: onAttrChange
			},
			frequency: {
				get: function () {
					var val = this.getAttribute('frequency');
					return parseFloat(val, 10);
				},
				set: function (val) {
					if (!isNaN(parseInt(val, 10))) {
						this.setAttribute('frequency', val);
					}
				}
			},
			endpoint: {
				get: function () {
					return this.getAttribute('endpoint');
				},
				set: function (val) {
					el.setAttribute(prop, val);
				}
			}
		});

	document.registerElement('live-list', {
		prototype: liveListProto,
		extends: 'ul'
	});
})();