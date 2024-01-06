<script>
    import { parse } from '$lib/markdown.js';
    import Markdown from './Markdown.svelte';

    export let markdown;
</script>

<Markdown html={ parse(markdown) } class={ $$props.class } />