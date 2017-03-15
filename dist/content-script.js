let originContent = document.body.innerHTML;
let originTitle = document.title;

function createNode(className, tagName) {
	className = utils.setPrefix(className);
	tagName = tagName || 'div';

	let dom = document.createElement(tagName);
	dom.setAttribute('class', className);
	return dom;	
}

function addClass(dom, className) {
	dom.setAttribute('class', [dom.getAttribute('class'), className].join(' '));
}
function renderContent(data) {
	let doms = {
		menu: createNode('menu'),
		main: createNode('main')
	};
	addClass(document.body, ['markdown-body', utils.setPrefix('root')].join(' '));
	document.body.innerHTML = '';
	document.body.appendChild(doms.menu);
	document.body.appendChild(doms.main);
	document.title = data.title;
	doms.main.innerHTML = data.main;
	doms.menu.innerHTML = data.menu;
}
function restore() {
	window.location.reload();
}
function requestRender() {
	chrome.extension.sendMessage({
		cmd: 'requestRender',
		url: location.href
	});
}

chrome.runtime.onMessage.addListener((msg, source, send) => {
	switch (msg.cmd) {
		case "reset":
			window.location.reload();
			break;
		case 'disabled':
			localStorage.setItem('status', 0);
			restore();
			break;
		case 'enabled':
			localStorage.setItem('status', 1);
			requestRender();
			break;
		case 'bgLoaded':
			send('ok');
			break;
		case 'render':
			renderContent(msg.data);
			break;
		default:
			break;
	}
});

if (localStorage.getItem('status') != 0) {
	localStorage.setItem('status', 1);
	requestRender();
}
