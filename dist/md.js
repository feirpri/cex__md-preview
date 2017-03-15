let md = (function() {
    let headers = [];
    let mdData = '';
    let renderer = (function() {
        let render = new marked.Renderer();

        render.code = function(code, language) {
            return [
                `<pre class="prettyprint">`,
                language ? `<span class="${utils.setPrefix('lang')}">${language}</span>` : '',
                `<code class="${language ? `hljs ${language}` : 'block'}">`,
                `${hljs.highlightAuto(code).value}`,
                `</code></pre>`
            ].join('');
        }
        render.heading = function(text, level) {
            let id = headers.length;
            let head = {
                id: id,
                text: text,
                level: level
            };
            headers.push(head);
            return `<h${level}><a class="${utils.setPrefix('anchor')}" name="${id}" >${text}</a></h${level}>`;
        }
        return render;
    }());
    function getMenuData() {
        let str = '<ul>';
        str += headers.map(({text, level, id}) => {
            return text ? `<li class="${utils.setPrefix('menu--level' + level)}"><a href="#${id}">${text}</a></li>` : ''; 
        }).join('');
        str += '</ul>';
        return str;
    }
    function setContent(content) {
        headers.length = 0;
        mdData = marked(content, {
            renderer: renderer,
        });
        return this;
    }
    function getInfo() {
        return {
            title: (headers[0] || {}).text || 'Markdown查看器--feirpri',
            menu: getMenuData(),
            main: mdData
        }
    }
    return {
        getInfo,
        setContent
    }
})();