<script>
    import NavLink from '../NavLink.svelte';
    import PageLayout from '../PageLayout.svelte';
    import SidebarContentFront from '../SidebarContentFront.svelte';
    import SidebarItemMain from '../SidebarItemMain.svelte';

    export let data;
</script>

<PageLayout title={data.title} username={data.username} footer={data.footer}>
    <div slot="header" class="flex gap-2">
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
        </div>
        <SidebarContentFront menu={data.menu}>
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
        </SidebarContentFront>
    </div>
    <slot />
</PageLayout>