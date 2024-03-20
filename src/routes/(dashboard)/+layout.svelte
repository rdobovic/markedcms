<script>
    import NavLink from '../NavLink.svelte';
    import SidebarItemMain from '../SidebarItemMain.svelte';
    import SidebarItemDropdown from '../SidebarItemDropdown.svelte';
    import PageLayout from '../PageLayout.svelte';

    export let data;
</script>

<PageLayout title={data.title} sidebarTitle='Admin dashboard' username={data.username} footer={data.footer}>
    <div slot="header" class="flex gap-2">
        {#if data.username}
            <NavLink href="/">View Site</NavLink>
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/logout" method="POST">Logout</NavLink>
        {:else}
            <NavLink href="/login">Login</NavLink>
        {/if}
    </div>
    <div slot="sidebar" class="flex flex-col">
        <SidebarItemMain closeSidebar={true} href="/">View site</SidebarItemMain>
        <SidebarItemMain closeSidebar={true} href="/admin">Admin home</SidebarItemMain>
        <SidebarItemMain closeSidebar={true} href="/admin/structure">Post structure</SidebarItemMain>
        <SidebarItemMain closeSidebar={true} href="/admin/post/new">New post</SidebarItemMain>
        <SidebarItemMain closeSidebar={true} href="/admin/category/new">New category</SidebarItemMain>
        <SidebarItemMain closeSidebar={true} href="/admin/users">Users</SidebarItemMain>
        <SidebarItemMain closeSidebar={true} href="/admin/settings">Settings</SidebarItemMain>

        <div class="block md:hidden">
            <SidebarItemMain 
                method="POST"
                href="/logout"
            >Logout</SidebarItemMain>
        </div>
    </div>
    <slot />
</PageLayout>