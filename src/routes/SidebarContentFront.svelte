<script>
    import SidebarItemMain from './SidebarItemMain.svelte'
    import SidebarItemDropdown from './SidebarItemDropdown.svelte'

    import { page } from '$app/stores';

    export let menu;
    let activeRoot;

    $: {
        activeRoot = menu.find(itm => $page.url.pathname.startsWith(itm.path));
    }
</script>

<div>
    {#if menu.length == 0}
        <p class="font-bold my-4">
            This website is empty<br>
            nothing to display :)
        </p>
    {/if}

    {#each menu as item (item.id)}
        <SidebarItemMain 
            href={item.path}
            closeSidebar={!(item.children)}
        >{item.title}</SidebarItemMain>
    {/each}

    <slot />

    {#if activeRoot && activeRoot.children}
        <hr class="my-3 border-gray-400" />
        {#each activeRoot.children as child (child.id)}
            <SidebarItemDropdown menu={child} />
        {/each}
    {/if}
</div>