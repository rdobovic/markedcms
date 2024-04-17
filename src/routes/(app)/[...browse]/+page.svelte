<script>
    import Post from '$lib/components/Post.svelte';
    import PostPlain from '$lib/components/PostPlain.svelte';
    import Markdown from '$lib/components/Markdown.svelte';
    import DefaultHomePage from './defaultHomePage.svelte';

    export let data;

    const mapChildren = (post) => {
        if (!post.children)
            return [];

        const res = post.children.map(
            (c) => ({ 
                url: c.path,
                text: (c.subType === 'single') ? c.bodyBHtml : c.bodyAHtml,
            })
        );
        return res;
    }

    let PostComponent = data.showPlainPosts ? PostPlain : Post;
</script>

{#if data.content.type === 'category'}

    {#if data.content.bodyA}
        <div class="mb-16">
            <Markdown html={data.content.bodyAHtml} />
        </div>
    {/if}

    <div class="flex flex-col gap-8">
        {#if data.content.displayPosts}
            {#each data.children as post, i}
                {#if post.subType === 'single'}
                    <svelte:component
                        this={PostComponent}
                        text={post.bodyBHtml}
                        url={post.path}
                        number={i + 1}
                        numerate={data.numeratePosts}
                        subposts={mapChildren(post)}
                    />
                {:else}
                    <svelte:component
                        this={PostComponent}
                        text={post.bodyAHtml} 
                        url={post.path}
                        number={i + 1}
                        numerate={data.numeratePosts}
                        subposts={mapChildren(post)}
                    />
                {/if}
            {/each}
        {/if}
    </div>
{/if}

{#if data.content.type === 'post'}
    <div class="flex flex-grow gap-4">
        {#if data.numeratePosts && data.postNumber}
            <p>{data.postNumber}</p>
        {/if}
        <div class="flex-grow">
            {#if data.content.subType === 'single'}
                <Markdown html={data.content.bodyAHtml} />
            {:else}
                <Markdown html={data.content.bodyAHtml} class="mb-8" />
                <Markdown html={data.content.bodyBHtml} />
            {/if}
        </div>
    </div>
{/if}

{#if data.defaultHomePage}
    <Markdown>
        <DefaultHomePage />
    </Markdown>
{/if}