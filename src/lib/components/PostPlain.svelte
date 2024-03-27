<script>
    import upIcon from '$lib/images/up.svg';
    import downIcon from '$lib/images/down.svg';
    import Markdown from '$lib/components/Markdown.svelte';
    import { slide } from 'svelte/transition';

    export let text = '';
    export let url = '';
    export let subposts = [];
    export let number = '';
    export let numerate = false;

    let opened = false;

    const handleOpen = () => {
        if (subposts.length <= 0)
            return;

        opened = !opened;
    }
</script>

<div class={ $$props.class ?? '' }>
    <div class="w-full flex gap-4">
        {#if numerate}
            <p>{number}.</p>
        {/if}
        <div class="flex-grow">
            <a href={url}>
                <Markdown heading="medium" codeBg="dark" html={text} />
            </a>
            {#if subposts.length > 0}
                <button
                    on:click={handleOpen}
                    class:cursor-not-allowed={!subposts.length}
                    class="text-blue-500"
                    title={ subposts.length ? 'View similar posts' : 'There are no similar posts' }
                >
                    {#if opened}
                        <span>Hide similar</span>
                    {:else}
                        <span>Show similar</span>
                    {/if}
                </button>
            {/if}
        </div>
    </div>

    {#if opened}
        <div transition:slide={{ duration: 200 }} class="pl-2 ml-5 mt-4 flex gap-4 flex-col">
            {#each subposts as subpost, i}
                <div class="flex w-full rounded-md items-start gap-4">
                    {#if numerate}
                        <p>{number}.{i + 1}.</p>
                    {/if}
                    <a href={subpost.url} class="flex-grow w-0">
                        <Markdown codeBg="dark" heading="small" html={subpost.text} />
                    </a>
                </div>
            {/each}
        </div>
    {/if}
</div>