import { tick } from 'svelte';
import {marked} from 'marked';
import markedKatex from "marked-katex-extension";
import type {MarkedKatexOptions} from "marked-katex-extension";
import ABCJS from 'abcjs';

const options:MarkedKatexOptions = {
    nonStandard: true,
    output: "mathml",
    throwOnError: false,
};
marked.use(markedKatex(options));

var renderer = new marked.Renderer();
renderer.image = function(info) {
    if (info.title) {
        var size = info.title.split('x');
        if (size[1]) {
            size = 'width=' + size[0] + ' height=' + size[1];
        } else {
            size = 'width=' + size[0];
        }
    } else {
        size = ''
    }
    return `<img src="${info.href}" alt="${info.text}" ${size}>`;
}
var renderer_link = renderer.link;
renderer.link = function(options) {
    var href = options.href;
    if (href.startsWith('docs/')) {
        return `<a href="${href}" download>${options.text}</a>`;
    }
    return renderer_link.call(this, options);
    
}
marked.use({renderer});

export function parseMarkdown(md: string) {
    let tokens = marked.lexer(md);
    // walk through the tokens and identify code blocks with lang="abc". parse them with abcjs parser
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type === "code" && tokens[i].lang === "music-abc") {
            
            (async () => {
                var abc = tokens[i].text;
                await tick();
                ABCJS.renderAbc(`abcjs-${i}`, abc);
            })();
            tokens[i].type = "html";
            tokens[i].text = `<div id='abcjs-${i}' ></div>`; 
        }
    }
    return marked.parser(tokens);
}