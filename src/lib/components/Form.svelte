<script>
    import { enhance } from '$app/forms';
    import { createEventDispatcher, setContext, tick } from 'svelte';
    import { FORM_CONTEXT_KEY } from '$lib/stores/formStore.js';
    
    export let store; // formStore store
    export let method = 'POST';
    export let action = '';
    export let reset = true;

    const dispatch = createEventDispatcher();

    const listeners = [];
    const listenToSubmit = (callback) => {
        listeners.push(callback);
    }

    setContext(FORM_CONTEXT_KEY, store);
    setContext('formSubmit', listenToSubmit);
</script>

<form
    {method} {action}
    enctype="multipart/form-data"
    
    use:enhance={() => {
        return async ({ update, result }) => {
            await update({ reset });
            await tick();

            dispatch('submit', result);
            await tick();

            for (const callback of listeners) {
                await callback({ result, reset });
            }
        }
    }}

    class="flex flex-col gap-5"
>
    <slot />
</form>