const prefix = 'fp-md';
let renderer = (function () {
	let render = new marked.Renderer();
	let headerData = [];

	render.code = function (code, language) {
		return [
			`<pre class="prettyprint">`,
			language ? `<span class="${setPrefix('lang')}">${language}</span>` : '',
			`<code class="${language ? `hljs ${language}` : 'block'}">`,
			`${hljs.highlightAuto(code).value}`,
			`</code></pre>`
		].join('');
	}
	render.heading = function(text, level) {
		let id = headerData.length;
		let head = {
			id: id,
			text: text,
			level: level
		};
		headerData.push(head);
		headerHook(head);
		return `<h${level}><a class="${setPrefix('anchor')}" name="${id}" >${text}</a></h${level}>`;
	}
	return render;
}());
let headers = [];

function createNode(className, tagName) {
	className = setPrefix(className);
	tagName = tagName || 'div';

	let dom = document.createElement(tagName);
	dom.setAttribute('class', className);
	return dom;	
}
function isMultiMd() {
	let body = document.body;
	return body.childNodes.length !== 1 || body.childNodes[0].tagName !== 'PRE'; 
}
function getMdData() {
	let body = document.body;
	return marked(isMultiMd() ? body.innerHTML : body.childNodes[0].innerText, {
		renderer: renderer,
	});
}
function setPrefix(str) {
	return [prefix, str].join('--');
}
function addClass(dom, className) {
	dom.setAttribute('class', [dom.getAttribute('class'), className].join(' '));
}
function headerHook(head) {
	headers.push(head);
}
function getMenuData() {
	let str = '<ul>';
	str += headers.map(({text, level, id}) => {
		return text ? `<li class="${setPrefix('menu--level' + level)}"><a href="#${id}">${text}</a></li>` : '';	
	}).join('');
	str += '</ul>';
	return str;
}


let doms = {
	menu: createNode('menu'),
	main: createNode('main'),
};

(function main() {
	let mdData = getMdData();
	let menuData = getMenuData();

	addClass(document.body, ['markdown-body', setPrefix('root')].join(' '));
	document.body.innerHTML = '';
	document.body.appendChild(doms.menu);
	document.body.appendChild(doms.main);
	document.title = (headers[0] || {}).text || 'Markdown Preview--feirpri';

	doms.main.innerHTML = mdData;
	doms.menu.innerHTML = menuData;
	hljs.initHighlightingOnLoad();
}());

