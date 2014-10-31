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
					return itm.split(/\.|\//g).reduce(function (val, segment) {
						return (val && val[segment]) || '';
					}, data);
					// return data[itm] || '';
				}
			});
			replacements.forEach(function (item, idx) {
				newStr = newStr.replace(matches[idx], item);
			});
		}
		return newStr;
	};

module.exports = render;