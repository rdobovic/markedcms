<script>
    import Button from "./Button.svelte";
    import FormError from "./FormError.svelte";

    import { FORM_CONTEXT_KEY } from '$lib/stores/formStore.js';
    import { onMount, tick, getContext, onDestroy } from 'svelte';

    export let title = '';
    export let submit = '';
    export let name = '';

    let area = null;
    let inputKey = 0;

    const formStore = getContext(FORM_CONTEXT_KEY);

    $: if (typeof $formStore.values[name] == 'undefined') {
        formStore.setValue(name, '');
    }

    const adjustHeight = () => {
        if (!area) return;

        const oldScrollPos = window.scrollY;
        area.style.height = '1px';
        area.style.height = Math.max(15 + area.scrollHeight, 200) + 'px';
        window.scroll(null, oldScrollPos);
    }

    const handleChange = (event) => {
        if (!area) return;

        formStore.setValue(name, event.target.value);
        adjustHeight();
    }

    const subscribeToFormSubmit = getContext('formSubmit');

    subscribeToFormSubmit(async () => {
        ++inputKey;
    });

    onMount(() => {
        adjustHeight();
    });
</script>

<div class="bg-gray-200 rounded-md p-4 flex flex-col gap-5 border border-gray-400">
    {#if title}
        <h1 class="font-bold text-xl border-b pb-2 border-gray-400">{title}</h1>
    {/if}

    <FormError {name} small={false} />

    {#key inputKey}
        <textarea
            name={name}
            bind:this={area}
            on:input|preventDefault={handleChange}
            class="p-3 h-[200px] rounded-md border border-gray-400 font-mono focus:outline focus:outline-2 focus:outline-gray-400"
        >{$formStore.values[name]}</textarea>
    {/key}

    {#if submit}
        <Button>{submit}</Button>
    {/if}
</div>