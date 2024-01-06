<script>
    import upIcon from '$lib/images/up.svg';
    import downIcon from '$lib/images/down.svg';
    import openIcon from '$lib/images/open.svg';
    import Markdown from '$lib/components/Markdown.svelte';
    import { slide } from 'svelte/transition';

    export let text = '';
    export let url = '';
    export let subposts = [];

    let opened = false;

    const handleOpen = () => {
        if (subposts.length <= 0)
            return;

        opened = !opened;
    }
</script>

<div class={ $$props.class ?? '' }>
    <div class="border-gray-400 bg-gray-100 border flex w-full rounded-md items-start min-h-">
        <Markdown heading="medium" codeBg="dark" html={text} class="flex-grow p-5" />

        <div class="border-l border-b border-gray-400 flex flex-col rounded-bl-md bg-gray-200 mb-8">
            <a
                href={url}
                title="More details on this post"
                class:rounded-bl={subposts.length <= 0}
                class="w-12 h-full p-2 block rounded-tr-sm"
            >
                <img src={openIcon} alt="Open post" />
            </a>
            {#if subposts.length > 0}
                <button 
                    on:click={handleOpen} 
                    class:cursor-not-allowed={!subposts.length}
                    class="w-12 h-full p-2 block rounded-bl-md border-t border-gray-400"
                    title={ subposts.length ? 'View similar posts' : 'There are no similar posts' }
                >
                    {#if opened}
                        <img 
                            src={downIcon} 
                            alt="Similar posts"
                        />
                    {:else}
                        <img 
                            src={upIcon} 
                            alt="No similar posts"
                        />
                    {/if}
                </button>
            {/if}
        </div>
    </div>

    {#if opened}
        <div transition:slide={{ duration: 200 }} class="pl-5 ml-5 mt-4 border-l flex gap-4 flex-col">
            {#each subposts as subpost}
                <div class="border-gray-400 border flex w-full rounded-md items-start bg-gray-100">
                    <Markdown codeBg="dark" heading="small" html={subpost.text} class="flex-grow w-0 p-5" />
                    <a
                        href={subpost.url}
                        title="More details on this post"
                        class="w-12 p-2 flex rounded-tr-md rounded-bl-md border-l border-b border-gray-400 bg-gray-200 mb-8"
                    >
                        <img src={openIcon} alt="Open post" />
                    </a>
                </div>
            {/each}
        </div>
    {/if}
</div>