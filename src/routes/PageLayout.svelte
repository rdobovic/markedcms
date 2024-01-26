<script>
    import Sidebar from './Sidebar.svelte';

    export let title;
    export let footer;
    export let username;
    export let sidebarTitle;

    let sidebar = false;

    const handleSidebar = () => {
        sidebar = !sidebar;
    }
</script>

<div class="min-h-screen flex flex-col relative w-dvw">
    <header class="flex h-16 px-5 gap-3 bg-gray-400 justify-between text-black sticky top-0 z-40">
        <div class="flex items-center gap-6">
            <button class="flex gap-2 flex-col md:hidden" on:click={handleSidebar}>
                <span class="w-7 border-2 rounded-full border-black"></span>
                <span class="w-7 border-2 rounded-full border-black"></span>
                <span class="w-7 border-2 rounded-full border-black"></span>
            </button>
            <a href="/">
                <h1 class="font-bold text-3xl">{title}</h1>
            </a>
        </div>
        <div class="flex items-center gap-5">
            <nav class="hidden md:block">
                <ul class="flex gap-2">
                    <!-- Header (navbar) content -->
                    <slot name="header" />
                </ul>
            </nav>
            {#if username}
                <div
                    class="rounded-full h-10 w-10 p-2 bg-gray-700 text-white font-bold text-lg flex justify-center items-center"
                >{username.toUpperCase()[0]}</div>
            {/if} 
        </div>
    </header>
    <Sidebar bind:open={sidebar} title={sidebarTitle}>
        <!-- Sidebar content -->
        <slot name="sidebar" />
    </Sidebar>
    <div class="flex flex-1 relative w-full">
        <div class="flex flex-col items-center flex-1 pt-10 md:pl-80 w-full">
            <div class="w-full max-w-5xl pb-16 p-4 flex-grow">
                <!-- Page content -->
                <slot />
            </div>
            <div class="bg-gray-100 w-full p-4 text-center">{footer} &copy; {(new Date().getFullYear())}</div>
        </div>
    </div>
</div>