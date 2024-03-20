<script>
    import { page } from '$app/stores';
    
    import NavLink from '../NavLink.svelte';
    import PageLayout from '../PageLayout.svelte';
    import SidebarItemMain from '../SidebarItemMain.svelte';
    import SidebarItemDropdown from '../SidebarItemDropdown.svelte';

    export let data;

    $: activeRoot = data.contentStructure.find(itm => $page.url.pathname.startsWith(itm.path));
</script>

<PageLayout 
    title={data.title} 
    username={data.username} 
    footer={data.footer}
    sidebarHidden={data.sidebarItems.length == 0 && !activeRoot?.children}
>
    <div slot="header" class="flex gap-2 flex-wrap">
        {#each data.headerItems as item (item.id)}
            <NavLink href={item.path}>{item.title}</NavLink>
        {/each}

        {#if data.username}
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/logout" method="POST">Logout</NavLink>
        {:else}
            <NavLink href="/login">Login</NavLink>
        {/if}
    </div>
    <div slot="sidebar">
        <div class="block md:hidden">
            {#if data.username}
                <SidebarItemMain
                    href="/admin"
                    closeSidebar={true}
                >Dashboard</SidebarItemMain>
            {/if}

            {#each data.headerItems as item (item.id)}
                <SidebarItemMain
                    href={item.path}
                    closeSidebar={true}
                >{item.title}</SidebarItemMain>
            {/each}
        </div>

        {#each data.sidebarItems as item (item.id)}
            <SidebarItemMain
                href={item.path}
                closeSidebar={true}
            >{item.title}</SidebarItemMain>
        {/each}

        <div class="block md:hidden">
            {#if data.username}
                <SidebarItemMain 
                    method="POST"
                    href="/logout"
                    closeSidebar={true}
                >Logout</SidebarItemMain>
            {:else}
                <SidebarItemMain 
                    href="/login"
                    closeSidebar={true}
                >Login</SidebarItemMain>
            {/if}
        </div>

        {#if activeRoot && activeRoot.children}
            <hr class="my-3 border-gray-400 { data.sidebarItems.length == 0 && 'md:hidden' }" />
            <h2 class="font-bold text-xl w-full text-left pb-3">{activeRoot.title}</h2>
            {#each activeRoot.children as child (child.id)}
                <SidebarItemDropdown menu={child} />
            {/each}
        {/if}
    </div>
    <slot />
</PageLayout>