const prefix = 'fp-md';
let renderer = (function () {
	let render = new marked.Renderer();
	render.code = function (code, language) {
		console.log(language);
		return '<pre class="hljs" lang="' + language + '">' + code + '</pre>';
	}
	return render;
}());
let headers = [];

function createNode(className, tagName) {
	className = [prefix, className].join('-') || '';
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
	return marked(isMultiMd() ? body.innerHTML : body.childNodes[0].innerText);
}
function setPrefix(str) {
	return [prefix, str].join('-');
}
function addClass(dom, className) {
	dom.setAttribute('class', [dom.getAttribute('class'), className].join(' '));
}
function headerHook(text, level, id) {
	headers.push({
		text: text,
		level: level,
		id: id
	});
}


let doms = {
	menu: createNode('menu'),
	main: createNode('main'),
};
marked.setOptions({
	highlight: (code) => {
		console.log(hljs.highlightAuto(code).value);
		return hljs.highlightAuto(code).value;
	},
});

(function main() {
	let mdData = getMdData();

	addClass(document.body, ['markdown-body', setPrefix('root')].join(' '));
	document.body.innerHTML = '';
	document.body.appendChild(doms.menu);
	document.body.appendChild(doms.main);

	doms.main.innerHTML = mdData;
	hljs.initHighlightingOnLoad();
}());

