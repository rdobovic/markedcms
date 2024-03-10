<script>
    import { getContext } from 'svelte';
    import { FORM_CONTEXT_KEY } from '$lib/stores/formStore.js';

    export let name = 'default';
    export let small = true;

    const formStore = getContext(FORM_CONTEXT_KEY);

    let message = '';
    let hasError = false;

    $: {
        const fieldErrors = $formStore.errors[name];

        hasError = fieldErrors && fieldErrors.length > 0;
        message = hasError ? fieldErrors.join(' ') : '';
    }
</script>

{#if hasError}
    {#if small}
        <p class="pl-1 text-xs text-red-600">{message}</p>
    {:else}
        <p class="text-red-600">{message}</p>
    {/if}
{/if}