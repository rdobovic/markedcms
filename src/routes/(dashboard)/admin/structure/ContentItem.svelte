<script>
    import upIcon from '$lib/images/up.svg';
    import downIcon from '$lib/images/down.svg';
    import postIcon from '$lib/images/post.svg';
    import categoryIcon from '$lib/images/category.svg';
    import eyeClosedIcon from '$lib/images/eye-closed.svg';
    import eyeOpenedIcon from '$lib/images/eye-opened.svg';

    import { createEventDispatcher, getContext } from 'svelte';
    import { fade, slide } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import { page } from '$app/stores';


    export let item;
    export let dummy = false;
    export let dummyText = 'This is dummy component';

    $: bgDisplayClass = (item.display) ? 'bg-gray-100' : 'bg-zinc-300'
    const bgTypeClass = (item.type === 'post') ? 'bg-sky-700' : 'bg-teal-600';
    const borderTypeClass = (item.type === 'post') ? 'border-sky-700' : 'border-teal-600';

    const dispatch = createEventDispatcher();
    const runCommand = getContext('contentFormRun');

    const handleMoveUp = () => {
        dispatch('move', {
            id: item.id,
            name: 'move',
            move: -1,
        });
    }

    const handleMoveDown = () => {
        dispatch('move', {
            id: item.id,
            name: 'move',
            move: +1,
        });
    }

    const handleDisplayChange = () => {
        if (dummy) return;

        dispatch('display', {
            id: item.id,
            name: 'display',
            state: (item.display = !item.display),
        });
    }

    const handleChildMove = (id) => (e) => {
        runCommand(e.detail);

        let direction = e.detail.move;
        const movingIndex = item.children.findIndex(
            (itm) => itm.id === id
        );

        if (
            movingIndex === 0 && direction < 0
            || movingIndex === item.children.length - 1 && direction > 0
        )
            return;

        if (direction > 0)
            ++direction;

        item.children = [ 
            ...item.children.slice(0, movingIndex + direction).filter(itm => itm.id !== id),
            item.children.find(itm => itm.id === id),
            ...item.children.slice(movingIndex + direction).filter(itm => itm.id !== id),
        ];
    }

    const handleChildDisplay = (e) => {
        runCommand(e.detail);
    }

    let childrenOpen = false;

    const toggleChildren = () => {
        childrenOpen = !childrenOpen;
    }
</script>

<div class="flex flex-col gap-2">
    <div class="flex border-2 {borderTypeClass} rounded-md {bgDisplayClass} w-72 md:w-96 transition-all">
        <div class="p-2 flex items-center justify-center {bgTypeClass}">
            {#if item.type === 'post'}
                <img src={postIcon} alt="Post" class="w-5" />
            {:else}
                <img src={categoryIcon} alt="Category" class="w-5" />
            {/if}
        </div>
        <div class="p-2 w-0 flex-grow">
            <div class="mb-1 flex items-start gap-2">
                <p class="break-all w-0 flex-grow">{item.title}</p>
                <button
                    on:click={handleDisplayChange}
                    class:cursor-default={dummy}
                    class="cursor-pointer"
                >
                    {#if item.display}
                        <img src={eyeOpenedIcon} alt="Displayed" class="w-5">
                    {:else}
                        <img src={eyeClosedIcon} alt="Not displayed" class="w-5">
                    {/if}
                </button>
                {#if item.children && item.children.length > 0}
                    <button
                        on:click={toggleChildren}
                        class:cursor-default={dummy}
                        class="cursor-pointer"
                    >
                        {#if childrenOpen}
                            <img src={downIcon} alt="Displayed" class="w-5">
                        {:else}
                            <img src={upIcon} alt="Not displayed" class="w-5">
                        {/if}
                    </button>
                {/if}
            </div>
            <p class="text-sm">
                {#if !dummy}
                    <a class="hover:underline" href="/admin/{item.type}/{item.id}">Edit</a>
                    <a class="hover:underline" href={item.path}>View</a>
                    <a class="text-red-800 hover:underline" href="/admin/{item.type}/{item.id}/delete?back={$page.url.pathname}">Delete</a>
                {:else}
                    <span>{dummyText}</span>
                {/if}
            </p>
        </div>
        <div class="flex flex-col border-l justify-center border-gray-400">
            <button 
                on:click={handleMoveUp}
                class="border-b border-gray-400 p-1 rounded-tr-md transition-all"
            >
                <img src={upIcon} alt="Up" class="w-8">
            </button>
            <button 
                on:click={handleMoveDown}
                class="p-1 rounded-br-md transition-all"
            >
                <img src={downIcon} alt="Down" class="w-8">
            </button>
        </div>
    </div>

    {#if item.children && item.children.length > 0 && childrenOpen}
        <div class="pl-5 ml-5 border-l border-gray-300 flex flex-col gap-2">
            {#each item.children as itm (itm.id)}
                <div animate:flip={{ duration: 400 }}>
                    <svelte:self 
                        item={itm} 
                        on:move={handleChildMove(itm.id)} 
                        on:display={handleChildDisplay}
                    />
                </div>
            {/each}
        </div>
    {/if}
</div>