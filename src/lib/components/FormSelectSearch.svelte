<script>
    import up from '$lib/images/up.svg'
    import down from '$lib/images/down.svg'

    import { slide } from 'svelte/transition';
    import { FORM_CONTEXT_KEY } from '$lib/stores/formStore.js';
    import { createEventDispatcher, onMount, tick, getContext, onDestroy } from 'svelte';

    export let name;
    export let options = [
        { name: 'Option 1', value: 'opt_1'}, // Demo options
        { name: 'Option 2', value: 'opt_2'},
        { name: 'Option 3', value: 'opt_3'}
    ];

    export let disabled = false;

    const formStore = getContext(FORM_CONTEXT_KEY);
    const subscribeToFormSubmit = getContext('formSubmit');

    const componentId = Math.random().toString(32).split('.')[1];

    const dispatch = createEventDispatcher();
    const dispatchChange = () => {
        dispatch('change', selected);
    }

    $: if (!options.find(o => o.value == $formStore.values[name])) {
        formStore.setValue(name, options[0].value);
    }

    $: selected = options.find(o => o.value == $formStore.values[name]);

    $: if (!opened) {
        searchValue = selected.name;
    }

    let opened = false;
    let searchValue = '';
    let searchOptions = options;
    let searchInputKey = 0;

    const handleSubmit = async () => {
        searchInputKey += 1;
        await tick();
    }

    subscribeToFormSubmit(handleSubmit);

    const setSelected = (val) => async () => {
        opened = false;
        formStore.setValue(name, val);
        dispatchChange();
    }

    const startSearch = () => {
        if (disabled) return;

        opened = true;
        searchValue = '';
        searchOptions = options;
    }

    const finishSearch = () => {
        opened = false;
        searchValue = selected.name;
    }

    const handleInputChange = () => {
        searchOptions = options.filter(
            opt => opt.name.toLowerCase().includes(searchValue.toLowerCase())
        );
    }

    const handleWindowClick = ({ target }) => {
        if (target.closest('.form-select-search-toggle-' + componentId)) {
            opened ? finishSearch() : startSearch();
            return;
        }

        if (target.closest('.form-select-search-input-' + componentId)) {
            if (!opened)
                startSearch();
            return;
        }

        if (target.closest('.form-select-search-option-' + componentId)) {
            return;
        }

        finishSearch();
    }
</script>

<svelte:window on:click={handleWindowClick} />

<div class="flex justify-between items-center relative">
    <input type="hidden" name={name} value={selected.value}>
    <label for="id-select-{name}" class="w-1/3 md:w-1/4 mr-4 text-sm md:text-base"><slot /></label>

    <div class="w-2/3 md:w-3/4 relative">
        <div class="relative">
            {#key searchInputKey}
                <input
                    type="text"
                    name="select-{name}-search"
                    disabled={disabled}
                    bind:value={searchValue}
                    
                    on:input={handleInputChange}
                    class="
                        form-select-search-input-{componentId}
                        flex items-center justify-between w-full p-1 px-3 rounded-md border 
                        border-gray-400 focus:outline focus:outline-2 focus:outline-gray-400 
                        bg-white text-left { disabled ? 'text-gray-400' : '' }"
                >
            {/key}
            {#if opened}
                <img 
                    src={down} 
                    class="
                        form-select-search-toggle-{componentId}
                        h-5 absolute top-1/2 transform -translate-y-1/2 right-3 z-10 cursor-pointer"
                    alt="Close"
                >
            {:else}
                <img 
                    src={up}
                    class="
                        form-select-search-toggle-{componentId}
                        h-5 absolute top-1/2 transform -translate-y-1/2 right-3 z-10 cursor-pointer"
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
                        class="
                            form-select-search-option-{componentId}
                            text-left p-1 pl-3 hover:bg-gray-100 rounded-md"
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