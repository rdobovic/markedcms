<script>
    import { getContext, onDestroy, createEventDispatcher } from "svelte";
    import FormError from "./FormError.svelte";
    import { FORM_CONTEXT_KEY } from '$lib/stores/formStore.js';

    export let type;
    export let name;
    export let disabled = false;

    const textTypes = ['text', 'password', 'date'];
    const typeHack = node => node.type = type;

    let inputKey = 0;
    const subscribeToFormSubmit = getContext('formSubmit');

    subscribeToFormSubmit(() => {
        ++inputKey;
    });

    const dispatch = createEventDispatcher();
    const formStore = getContext(FORM_CONTEXT_KEY);

    $: if (typeof $formStore.values[name] == 'undefined')
        formStore.setValue(name, '');

    const handleInput = (event) => {
        formStore.setValue(name, event.target.value);
        dispatch('input', event);
    }
</script>

{#if textTypes.includes(type)}
    <div class="flex items-center">
        <label
            for="input-id-{name}"
            class="w-1/3 md:w-1/4 mr-4 text-sm md:text-base"
        ><slot /></label>
        <div class="w-2/3 md:w-3/4">
            {#key inputKey}
                <input
                    use:typeHack
                    {name}
                    {disabled}
                    value={$formStore.values[name]}
                    on:focusin
                    on:focusout
                    on:input|preventDefault={handleInput}
                    id="input-id-{name}"
                    class="w-full p-1 px-3 rounded-md border border-gray-400 focus:outline focus:outline-2 focus:outline-gray-400"
                />
            {/key}

            <FormError {name} />
        </div>
    </div>
{/if}