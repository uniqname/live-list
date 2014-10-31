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