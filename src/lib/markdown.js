import { Marked } from 'marked';
import hljs from 'highlight.js';
import { markedHighlight } from 'marked-highlight';

export const parse = (markdown) => {

    const marked = new Marked(markedHighlight({
        langPrefix: 'hljs markdown-code language-',
        highlight(code, lang, info) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    }));

    return marked.parse(markdown);
}