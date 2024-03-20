<script>
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';

    export let href;
    export let method = 'GET';

    $: active = (href == ($page.url.pathname.replace(/\/+$/, '')));
</script>

<div class="mr-2">
    {#if method === 'POST'}
        <form method="POST" action={href} use:enhance class="peer">
            <button class="uppercase">
                <slot />
            </button>
        </form>
    {:else}
        <a href={href} class="uppercase peer">
            <slot />
        </a>
    {/if}
    <div class="transition-all border-b { active ? 'w-full' : 'w-0' } border-black peer-hover:w-full" ></div>
</div>