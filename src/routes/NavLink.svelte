<script>
    import { enhance } from '$app/forms';

    export let href;
    export let method = 'GET';
</script>

{#if method === 'POST'}
    <form method="POST" action={href} use:enhance>
        <button class="uppercase">
            <slot />
        </button>
    </form>
{:else}
    <a href={href} class="uppercase">
        <slot />
    </a>
{/if}