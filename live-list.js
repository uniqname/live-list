(function () {

	var interval,
		multiplier = 1,
		errorCodes = [404, 500],
		getEndpoint = function (endpoint) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', endpoint, true);
			xhr.send();

			return xhr;
		},

		attrPropSync = function (prop) {
			return {
				get: function () {
					return this.getAttribute(prop);
				},
				set: function (val) {
					this.setAttribute(prop, val);
				}
			};
		},

		onCreate = function () {
			var t = document.querySelector('#live-list-template'),
				clone = document.importNode(t.content, true),
				thisLiveList = this,
				sync = 10000,
				endpoint;

			console.log('A live-list element was created');

			this.createShadowRoot().appendChild(clone);
			this.endpoint = this.getAttribute('endpoint');

			if (thisLiveList.endpoint) {
				interval = window.setInterval(function () {
					var xhr = getEndpoint(thisLiveList.endpoint);

					xhr.onload = function (xhr) {

						if (errorCodes.indexOf(xhr.status) === -1) {
							clearInterval(interval);
							console.log('syncing was canceled after creating due to error response from endpoint');
						} else {
							//TODO: Gotta figure this out
							// items.reduce(function (guts, item) {
							//	return guts + opts.fn(item);
							// }, '');
						}
					};
				}, sync);
			}
		},

		onAttrChange = function (attrName, oldVal, newVal) {
			var vals = [].slice.call(arguments, 1),
				thisLiveList = this,
				endpoint;

			console.log('the ' + attrName + ' attribute changed from ' + oldVal + ' to ' + newVal);

			if (attrName === 'endpoint') {

				clearInterval(interval);

				if (attrName === 'endpoint') {
					onEndpointChange.apply(this, vals);
				}

				interval = window.setInterval(function () {
					var xhr = getEndpoint(thisLiveList.endpoint);

					xhr.onload = function (xhr) {

						if (errorCodes.indexOf(xhr.status) === -1) {
							clearInterval(interval);
							console.log('syncing was canceled after attribute change due to error response from endpoint');
						} else {
							//TODO: Gotta figure this out
							// items.reduce(function (guts, item) {
							//	return guts + opts.fn(item);
							// }, '');
						}
					};
				}, sync);

			}

		},

		onEndpointChange = function (oldEndpoint, newEndpoint) {
			this.endpoint = newEndpoint;
		},

		onSyncChange = function (oldSync, newSync) {
			this.sync = newSync;
		},

		liveListProto = Object.create(HTMLUListElement.prototype, {
			createdCallback: {
				value: onCreate
			},
			attributeChangedCallback: {
				value: onAttrChange
			},
			sync: attrPropSync('sync'),
			endpoint: attrPropSync('endpoint'),
			plexer: {
				value: 1
			}
		});

	document.registerElement('live-list', {
		prototype: liveListProto,
		extends: 'ul'
	});
})();