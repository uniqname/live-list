(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var render = function rendre(template, data) {
		var frag = document.createDocumentFragment();

		JSON.parse(data).forEach(function (datum) {
			var els = [].slice.call(template.cloneNode(true).children);
			
			els.forEach(function (el) {

				if (el.children.length) {
					rendre(el, datum);
				}
				frag.appendChild(processEl(el, datum));
			});
		});
		return frag;
	},
	processEl = function (el, data) {
		processText(el, data);
		processAttrs(el, data);

		return el;
	},
	processAttrs = function (el, data) {
		var attrs = [].slice.call(el.attributes);

		attrs.forEach(function (attr) {
			processAttr(attr, data, el);
		});
	},
	processAttr = function (attr, data, el) {
		var newAttr = renderTemplateString(attr.name, data),
			newVal = renderTemplateString(attr.value, data);

		if (attr.name !== newAttr || attr.value !== newVal) {
			el.removeAttribute(attr.name);
			el.setAttribute(newAttr, newVal);
		}
	},
	processText = function (el, data) {
		el.textContent = renderTemplateString(el.textContent, data);
	},
	renderTemplateString = function (template, data) {
		var delim = {
				open: '{{',
				close: '}}'
			},
			delimRE = new RegExp(delim.open + '.*?' + delim.close, 'ig'),
			matches = template.match(delimRE),
			replacements,
			newStr = template.slice();

		if (matches) {
			replacements = matches.map(function (item) {
				var itm = item.replace(delim.open, '').replace(delim.close, '');
				if (itm === 'this') {
					return data;
				} else {
					return data[itm] || '';
				}
			});
			replacements.forEach(function (item, idx) {
				newStr = newStr.replace(matches[idx], item);
			});
		}
		return newStr;
	};

module.exports = render;
},{}],2:[function(require,module,exports){
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
},{"./domingo.js":1,"./getEndpoint.js":3,"./interval":4,"./updateList.js":6}],3:[function(require,module,exports){
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
},{"./promises.js":5,"./xhr.js":7}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
module.exports = Promise;
},{}],6:[function(require,module,exports){
render = require('./domingo.js');

module.exports = function (data, list) {
	var itemTemplate = list.querySelector('template'),
		itemClone, newItems;

	if (!itemTemplate) {
		itemTemplate = document.createElement('template');
		itemTemplate.innerHTML = '<li>{{this}}</li>';
	}

	itemClone = document.importNode(itemTemplate.content, true);
	newItems = render(itemClone, data);
	[].slice.call(list.children).forEach(function (node) {
		if (node.nodeName === 'LI') {
			node.parentNode.removeChild(node);
		}
	});
	list.appendChild(newItems);
};
},{"./domingo.js":1}],7:[function(require,module,exports){
module.exports = XMLHttpRequest;
},{}]},{},[2])