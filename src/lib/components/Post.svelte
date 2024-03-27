<script>
    import upIcon from '$lib/images/up.svg';
    import downIcon from '$lib/images/down.svg';
    import openIcon from '$lib/images/open.svg';
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
    <div class="border-gray-400 bg-gray-100 border flex w-full rounded-md items-start hover:border-gray-500">
        <a href={url} class="flex-grow flex">
            {#if numerate}
                <p class="pl-5 py-5">{number}.</p>
            {/if}
            <Markdown heading="medium" codeBg="dark" html={text} class="flex-grow p-5" />
        </a>
        <div class="flex flex-col">
            {#if subposts.length > 0}
                <div class="border-l border-b border-gray-400 flex flex-col rounded-bl-md rounded-tr-md bg-gray-200">
                    <button 
                        on:click={handleOpen} 
                        class:cursor-not-allowed={!subposts.length}
                        class="w-12 h-full p-2 rounded-bl-md border-gray-400"
                        title={ subposts.length ? 'View similar posts' : 'There are no similar posts' }
                    >
                        {#if opened}
                            <img 
                                src={upIcon} 
                                alt="Similar posts"
                            />
                        {:else}
                            <img 
                                src={downIcon}
                                alt="No similar posts"
                            />
                        {/if}
                    </button>
                </div>
                <a href={url} class="flex-grow h-5 w-full"><!-- Nothing --></a>
            {/if}
        </div>
    </div>

    {#if opened}
        <div transition:slide={{ duration: 200 }} class="pl-5 ml-5 mt-4 border-l flex gap-4 flex-col">
            {#each subposts as subpost, i}
                <div class="border-gray-400 border flex w-full rounded-md items-start bg-gray-100 hover:border-gray-500">
                    <a href={subpost.url} class="flex-grow w-0 flex">
                        {#if numerate}
                            <p class="pl-5 py-5">{number}.{i + 1}.</p>
                        {/if}
                        <Markdown codeBg="dark" heading="small" html={subpost.text} class="p-5 flex-grow" />
                    </a>
                </div>
            {/each}
        </div>
    {/if}
</div>