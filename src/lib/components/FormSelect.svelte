<script>
    import up from '$lib/images/up.svg';
    import down from '$lib/images/down.svg';

    import { slide } from 'svelte/transition';
    import { FORM_CONTEXT_KEY } from '$lib/stores/formStore.js';
    import { createEventDispatcher, getContext } from 'svelte';

    import FormError from './FormError.svelte';

    // Name of the form input
    export let name;
    // List of all available options
    export let options = [
        { name: 'Option 1', value: 'opt_1'}, // Demo options
        { name: 'Option 2', value: 'opt_2'},
        { name: 'Option 3', value: 'opt_3'}
    ];

    const formStore = getContext(FORM_CONTEXT_KEY);

    const componentId = Math.random().toString(32).split('.')[1];

    const dispatch = createEventDispatcher();
    const dispatchChange = () => {
        dispatch('change', selected);
    }

    $: if (!options.find(o => o.value == $formStore.values[name])) {
        formStore.setValue(name, options[0].value);
    }

    let opened = false;
    $: selected = options.find(o => o.value == $formStore.values[name]);

    const setSelected = (val) => async () => {
        opened = false;
        formStore.setValue(name, val);
        dispatchChange();
    }

    const toggleDropdown = () => {
        opened = !opened;
    }

    const handleWindowClick = ({ target }) => {
        if (target.closest('.form-select-option-' + componentId))
            return;

        if (target.closest('.form-select-toggle-' + componentId)) {
            opened = !opened;
            return;
        }

        opened = false;
    }
</script>

<svelte:window on:click={handleWindowClick} />

<div class="flex justify-between items-center relative">
    <input type="hidden" {name} value={$formStore.values[name]}>
    <label for="id-select-{name}" class="w-1/3 md:w-1/4 mr-4 text-sm md:text-base"><slot /></label>

    <div class="w-2/3 md:w-3/4 relative pb-1">
        <div class="relative">
            <button
                type="button"
                
                
                class="
                    form-select-toggle-{componentId}
                    flex items-center justify-between w-full p-1 px-3 rounded-md border border-gray-400 
                    focus:outline focus:outline-2 focus:outline-gray-400 bg-white text-left"
            >
                <span>{selected?.name}</span>
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
                            class="
                                form-select-option-{componentId}
                                text-left p-1 pl-3 hover:bg-gray-100 rounded-md"
                        >{opt.name}</button>
                    {/each}
                </div>
            {/if}
        </div>

        <FormError {name} />
    </div>
</div>