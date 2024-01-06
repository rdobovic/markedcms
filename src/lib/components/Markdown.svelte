<script>
    import './Markdown.scss';
    import 'highlight.js/styles/a11y-light.css';

    export let html = '';
    export let heading = 'big';
    export let codeBg = 'light';

    const headingClasses = {
        big:    'markdown-h-1',
        medium: 'markdown-h-2',
        small:  'markdown-h-3',
    };

    const codeWindowBgClasses = {
        white: 'markdown-code-dark-0',
        light: 'markdown-code-dark-1',
        dark:  'markdown-code-dark-2',
    };

</script>

<div class={`markdown ${codeWindowBgClasses[codeBg]} ${headingClasses[heading]} ${ $$props.class ?? '' }`}>
    <slot />
    {@html html}
</div>