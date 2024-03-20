<script>
    import close from '$lib/images/close.svg';
    import { setContext } from 'svelte';
    import { slide, fade } from "svelte/transition";

    export let open;
    export let title = '';
    export let hidden = false;

    const handleClose = () => {
        open = false;
    }

    setContext('sidebarClose', handleClose);
</script>

{#if open}
    <div
        class="md:hidden w-full bg-gray-300 p-5 pb-6 fixed top-0 bottom-0 z-50 overflow-y-scroll"
        in:slide={{ duration: 400, axis: 'x' }}
        out:slide={{ duration: 400, axis: 'x', delay: 100 }}
    >
        <!-- Sidebar content -->
        <div 
            in:fade={{ delay: 300, duration: 200 }}
            out:fade={{ duration: 200 }}
        >
            <button on:click={handleClose} class="w-full flex justify-end items-center gap-3 mb-6">
                {#if title}
                    <h2 class="font-bold text-xl w-full text-left">{title}</h2>
                {/if}
                <img src={close} alt="Close" class="h-8" />
            </button>
            <slot />
        </div>
    </div>
{/if}

{#if !hidden}
    <div 
        in:slide={{ duration: 250, axis: 'x' }}
        out:slide={{ duration: 250, axis: 'x', delay: 50 }}
        class="hidden md:block w-80 bg-gray-300 p-4 fixed top-16 bottom-0 z-50 overflow-y-auto"
    >
        <div
            in:fade={{ delay: 300, duration: 200 }}
            out:fade={{ duration: 60 }}
        >
            {#if title}
                <h2 class="font-bold text-xl w-full text-left pb-3">{title}</h2>
            {/if}
            <slot />
        </div>
    </div>
{/if}

