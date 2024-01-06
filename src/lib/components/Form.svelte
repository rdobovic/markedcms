<script>
    import { enhance } from '$app/forms';
    import { createEventDispatcher, setContext, tick } from 'svelte';
    
    export let method = 'POST';
    export let action = '';
    export let reset = true;

    const dispatch = createEventDispatcher();

    const listeners = [];
    const listenToSubmit = (callback) => {
        listeners.push(callback);
    }

    setContext('formSubmit', listenToSubmit);
</script>

<form
    {method} {action}
    
    use:enhance={() => {
        return async ({ update, result }) => {
            await update({ reset });
            await tick();

            dispatch('submit', result);
            await tick();

            for (const callback of listeners) {
                await callback(result);
            }
        }
    }}

    class="flex flex-col gap-5"
>
    <slot />
</form>