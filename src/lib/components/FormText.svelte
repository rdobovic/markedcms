<script>
    import { getContext, onMount, tick } from "svelte";
    import Button from "./Button.svelte";

    export let title = '';
    export let value = '';
    export let submit = '';
    export let name = '';
    export let errors = [];

    let area = null;
    let inputKey = 0;

    const handleChange = () => {
        if (!area) return;

        const oldScrollPos = window.scrollY;

        area.style.height = '1px';
        area.style.height = Math.max(15 + area.scrollHeight, 200) + 'px';
        window.scroll(null, oldScrollPos);
    }

    const subscribeToFormSubmit = getContext('formSubmit');

    subscribeToFormSubmit(async () => {
        ++inputKey;
        await tick();
        handleChange();
    });

    onMount(() => {
        handleChange();
    });

</script>

<div class="bg-gray-200 rounded-md p-4 flex flex-col gap-5 border border-gray-400">
    {#if title}
        <h1 class="font-bold text-xl border-b pb-2 border-gray-400">{title}</h1>
    {/if}

    {#if errors && errors.length > 0}
        <p class="text-sm text-red-500">{errors[0]}</p>
    {/if}
    {#key inputKey}
        <textarea
            name={name}
            bind:this={area}
            bind:value={value}
            on:input={handleChange}
            class="p-3 h-[200px] rounded-md border border-gray-400 font-mono focus:outline focus:outline-2 focus:outline-gray-400"
        ></textarea>
    {/key}

    {#if submit}
        <Button>{submit}</Button>
    {/if}
</div>