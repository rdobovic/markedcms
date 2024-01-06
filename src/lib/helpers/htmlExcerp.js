import { JSDOM } from 'jsdom';

// Calculate post html excerp
export default function htmlExcerp(html, length) {
    const dom = new JSDOM();
    const parser = new dom.window.DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    let excerp = '';

    for (const node of doc.body.childNodes) {
        if (excerp.length >= length)
            break;

        excerp += node.outerHTML ?? '';
    }

    return excerp;
}