<script>
    import up from '$lib/images/up.svg'
    import down from '$lib/images/down.svg'

    import { slide } from 'svelte/transition';
    import { createEventDispatcher, onMount, tick, getContext } from 'svelte';

    export let name;
    export let options = [
        { name: 'Option 1', value: 'opt_3'}, // Demo options
        { name: 'Option 2', value: 'opt_2'},
        { name: 'Option 3', value: 'opt_1'}
    ];

    export let value = null;
    export let disabled = false;

    const subscribeToFormSubmit = getContext('formSubmit');

    const dispatch = createEventDispatcher();
    const dispatchChange = () => {
        dispatch('change', selected);
    }

    $: {
        if (!value && typeof(value) !== 'number')
            value = options[0].value;
    }

    $: selected = options.find(o => o.value == value);

    $: {
        if (!opened)
            searchValue = selected.name;
    }

    let opened = false;
    let searchValue = '';
    let searchOptions = options;
    let searchInputKey = 0;

    const handleSubmit = async (result) => {
        searchInputKey += 1;
        await tick();
    }

    subscribeToFormSubmit(handleSubmit);

    const setSelected = (val) => async () => {
        value = val;
        opened = false;
        await tick();

        dispatchChange();
    }

    const startSearch = () => {
        if (disabled) return;
        opened = true;
        searchValue = '';
        searchOptions = options;
    }

    const finishSearch = () => {
        setTimeout(() => {
            opened = false;
            searchValue = selected.name;
        }, 100);
    }

    const handleInputChange = () => {
        searchOptions = options.filter(
            opt => opt.name.toLowerCase().includes(searchValue.toLowerCase())
        );
    }

    onMount(() => {
        searchValue = selected.name;
    });
</script>

<div class="flex justify-between items-center relative">
    <input type="hidden" name={name} bind:value={selected.value}>
    <label for="id-select-{name}" class="w-1/3 md:w-1/4 mr-4 text-sm md:text-base"><slot /></label>

    <div class="w-2/3 md:w-3/4 relative pb-1">
        <div class="relative">
            {#key searchInputKey}
                <input
                    type="text"
                    name="select-{name}-search"
                    disabled={disabled}
                    bind:value={searchValue}
                    on:focusin={startSearch}
                    on:focusout={finishSearch}
                    on:input={handleInputChange}
                    class="
                        flex items-center justify-between w-full p-1 px-3 rounded-md border 
                        border-gray-400 focus:outline focus:outline-2 focus:outline-gray-400 
                        bg-white text-left { disabled ? 'text-gray-400' : '' }" 
                >
            {/key}
            {#if opened}
                <img 
                    src={down} 
                    class="h-5 absolute top-1/2 transform -translate-y-1/2 right-3 z-10" 
                    alt="Close"
                >
            {:else}
                <img 
                    src={up}
                    class="h-5 absolute top-1/2 transform -translate-y-1/2 right-3 z-10"
                    alt="Open"
                >
            {/if}
        </div>

        {#if opened}
            <div
                in:slide out:slide
                class="flex flex-col rounded-md border border-gray-400 w-full bg-white absolute top-full left-0 max-h-40 overflow-x-scroll z-30"
            >
                {#each searchOptions as opt (opt.value)}
                    <button
                        type="button"
                        on:click={setSelected(opt.value)}
                        class="text-left p-1 pl-3 hover:bg-gray-100 rounded-md"
                    >{opt.name}</button>
                {/each}

                {#if searchOptions.length === 0}
                    <div class="text-left p-1 pl-3 rounded-md">
                        No results
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</div>