<script>
    import { getContext, createEventDispatcher } from "svelte";
    import FormError from "./FormError.svelte";
    import { FORM_CONTEXT_KEY } from '$lib/stores/formStore.js';

    export let name;

    let inputKey = 0;
    const subscribeToFormSubmit = getContext('formSubmit');

    subscribeToFormSubmit(() => {
        ++inputKey;
    });

    const dispatch = createEventDispatcher();
    const formStore = getContext(FORM_CONTEXT_KEY);

    $: if (typeof $formStore.values[name] == 'undefined')
        formStore.setValue(name, '');

    const handleChange = (event) => {
        console.log(event);

        formStore.setValue(name, event?.target?.files[0].name || '');
        dispatch('change', event);
    }
</script>

<div class="w-full flex items-center">
    <label
        for="input-id-{name}"
        class="w-1/3 md:w-1/4 mr-4 text-sm md:text-base"
    ><slot /></label>
    <div class="w-2/3 md:w-3/4">
        {#key inputKey}
            <input
                {name}
                type="file"
                class="hidden"
                id="input-id-{name}"
                on:change={handleChange}
            />
        {/key}
        <label
            for="input-id-{name}"
            class="w-full bg-white rounded-md border border-gray-400 flex cursor-pointer pr-3"
        >
            <span
                class="flex items-center bg-gray-300 px-3 p-1"
            >Browse</span>
            <span class="p-1 pl-3 overflow-hidden text-sm md:text-base flex items-center text-ellipsis whitespace-nowrap">
                {$formStore.values[name] || 'No file selected'}
            </span>
        </label>

        <FormError {name} />
    </div>
</div>