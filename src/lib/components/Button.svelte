<script>
    export let href = null;
    export let disabled = false;
</script>

{#if disabled}
    <div 
        class="
            {$$props.class ?? ''}
            block text-center bg-gray-300 p-1 rounded-md border border-gray-400
            text-gray-500
        "
    ><slot /></div>
{:else}
    {#if href}
        <a
            {href}
            class="
                {$$props.class ?? ''}
                block text-center bg-gray-300 p-1 rounded-md border border-gray-400
                hover:outline hover:outline-1 outline-gray-400
            "
        ><slot /></a>
    {:else}
        <button
            on:click
            class="
                {$$props.class ?? ''}
                text-center bg-gray-300 p-1 rounded-md border border-gray-400
                hover:outline hover:outline-1 outline-gray-400
            "
        ><slot /></button>
    {/if}
{/if}