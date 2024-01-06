<script>
    import Button from "./Button.svelte";

    export let title = '';
    export let error = '';
    export let submit = '';
</script>

<div class="bg-gray-200 rounded-md p-4 flex flex-col gap-5 border border-gray-400">
    {#if title}
        <h1 class="font-bold text-xl border-b pb-2 border-gray-400">{title}</h1>
    {/if}

    {#if error}
        <p class="text-red-700">{error}</p>
    {/if}

    <div class="flex flex-col gap-1 max-w-xl w-full">
        <slot />
    </div>

    <div class="flex gap-2">
        <slot name="buttons" />
        {#if submit}
            <Button class="w-full" on:click>{submit}</Button>
        {/if}
    </div>
</div>