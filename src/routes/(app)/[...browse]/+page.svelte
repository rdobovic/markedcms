<script>
    import Post from '$lib/components/Post.svelte';
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
</script>

{#if data.content.type === 'category'}

    {#if data.content.bodyA}
        <div class="mb-16">
            <Markdown html={data.content.bodyAHtml} />
        </div>
    {/if}

    <div class="flex flex-col gap-8">
        {#if data.content.displayPosts}
            {#each data.children as post}
                {#if post.subType === 'single'}
                    <Post 
                        text={post.bodyBHtml} 
                        url={post.path}
                        subposts={mapChildren(post)}
                    />
                {:else}
                    <Post 
                        text={post.bodyAHtml}
                        url={post.path}
                        subposts={mapChildren(post)}
                    />
                {/if}
            {/each}
        {/if}
    </div>
{/if}

{#if data.content.type === 'post'}
    {#if data.content.subType === 'single'}
        <Markdown html={data.content.bodyAHtml} />
    {:else}
        <Markdown html={data.content.bodyAHtml} class="mb-8" />
        <Markdown html={data.content.bodyBHtml} />
    {/if}
{/if}

{#if data.defaultHomePage}
    <Markdown>
        <DefaultHomePage />
    </Markdown>
{/if}