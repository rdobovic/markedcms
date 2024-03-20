<script>
    import upIcon from '$lib/images/up.svg';
    import downIcon from '$lib/images/down.svg';
    import { page } from '$app/stores';
    import { slide } from 'svelte/transition';
    import { getContext } from 'svelte';

    export let menu;

    let opened = $page.url.pathname.startsWith(menu.path) 
        && menu.path !== $page.url.pathname.replace(/\/+$/, '');

    $: active = (menu.path == ($page.url.pathname.replace(/\/+$/, '')));

    const runCloseSidebar = getContext('sidebarClose');

    const borders = {
        true: 'border-gray-500 outline-gray-500',
        false: 'border-gray-400 outline-gray-400',
    }

    const handleToggle = () => {
        opened = !opened;
    }
</script>

<div class="rounded-md mb-2 flex w-full { active ? 'bg-gray-400' : '' }">
    <a 
        href={menu.path}
        on:click={runCloseSidebar}
        class:rounded-e-md={!menu.children}
        class="block break-words w-0 flex-grow p-2 hover:outline outline-1 outline-gray-400 border { borders[active] } rounded-s-md"
    >{menu.title}</a>
    {#if menu.children}
        <button 
            on:click={handleToggle}
            class="{ borders[active] } w-10 p-2 border border-l-0 hover:border-l rounded-e-md hover:outline outline-1 outline-gray-400"
        >
            <img 
                class="w-full" 
                alt="open" 
                src={opened ? upIcon : downIcon}
            />
        </button>
    {/if}
</div>

{#if opened && menu.children}
    <div class="pl-5" transition:slide={{ duration: 200 }}>
        {#each menu.children as child (child.id)}
            <svelte:self menu={child} />
        {/each}
    </div>
{/if}