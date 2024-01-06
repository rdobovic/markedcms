<script>
    import up from '$lib/images/up.svg'
    import down from '$lib/images/down.svg'

    import { slide } from 'svelte/transition';
    import { createEventDispatcher, tick } from 'svelte';

    export let name;
    export let error = '';
    export let options = [
        { name: 'Option 1', value: 'opt_3'}, // Demo options
        { name: 'Option 2', value: 'opt_2'},
        { name: 'Option 3', value: 'opt_1'}
    ];

    export let value = null;

    const dispatch = createEventDispatcher();
    const dispatchChange = () => {
        dispatch('change', selected);
    }

    $: {
        if (!value && typeof(value) !== 'number')
            value = options[0].value;
    }

    let opened = false;
    $: selected = options.find(o => o.value == value);

    const toggleDropdown = () => {
        opened = !opened;
    }

    const closeDropdown = () => {
        // Delay closing so item click can be registered
        // due to the focus out event
        setTimeout(() => {
            opened = false;
        }, 100);
    }

    const setSelected = (val) => async () => {
        value = val;
        opened = false;
        await tick();

        dispatchChange();
    }
</script>

<div class="flex justify-between items-center relative">
    <input type="hidden" name={name} bind:value={value}>
    <label for="id-select-{name}" class="w-1/3 md:w-1/4 mr-4 text-sm md:text-base"><slot /></label>

    <div class="w-2/3 md:w-3/4 relative pb-1">
        <div class="relative">
            <button
                type="button"
                on:click={toggleDropdown}
                on:focusout={closeDropdown}
                class="
                    flex items-center justify-between w-full p-1 px-3 rounded-md border border-gray-400 
                    focus:outline focus:outline-2 focus:outline-gray-400 bg-white text-left"
            >
                <span>{selected.name}</span>
                {#if opened}
                    <img src={down} class="h-5" alt="Close">
                {:else}
                    <img src={up} class="h-5" alt="Open">
                {/if}
            </button>

            {#if opened}
                <div
                    transition:slide
                    class="flex flex-col rounded-md border border-gray-400 w-full bg-white absolute top-full left-0 z-30"
                >
                    {#each options as opt (opt.value)}
                        <button
                            type="button"
                            on:click={setSelected(opt.value)}
                            class="text-left p-1 pl-3 hover:bg-gray-100 rounded-md"
                        >{opt.name}</button>
                    {/each}
                </div>
            {/if}
        </div>

        {#if error}
            <p class="pl-1 text-xs text-red-500">{error}</p>
        {/if}
    </div>
</div>