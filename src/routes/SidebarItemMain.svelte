<script>
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';
    import { getContext } from 'svelte';

    export let href = '#';
    export let active = false;
    export let method = 'GET';
    export let closeSidebar = false;
    
    const runCloseSidebar = getContext('sidebarClose');

    const handleClick = () => {
        if (!closeSidebar) return;

        runCloseSidebar();
    }

    $: {
        active = (href == ($page.url.pathname.replace(/\/+$/, '')));
    }
</script>

{#if method === 'GET'}
    <a 
        {href}
        on:click={handleClick}
        class="
            block p-2 border border-gray-400 rounded-md hover:outline outline-1 
            outline-gray-400 {active ? 'bg-gray-400' : 'bg-gray-300'}
            mb-2
        "
    >
        <slot />
    </a>
{:else}
    <form {method} action={href} use:enhance>
        <button
            on:click={handleClick}
            class="
                block p-2 border border-gray-400 rounded-md hover:outline outline-1 
                outline-gray-400 {active ? 'bg-gray-400' : 'bg-gray-300'}
                mb-2 w-full text-left
            "
        >
            <slot />
        </button>
    </form>
{/if}