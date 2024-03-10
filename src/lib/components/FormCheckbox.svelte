<script>
    import { getContext } from "svelte";
    import { FORM_CONTEXT_KEY } from '$lib/stores/formStore.js';
    export let name;

    let inputKey = 0;
    const formStore = getContext(FORM_CONTEXT_KEY);
    const subscribeToFormSubmit = getContext('formSubmit');

    $: if (typeof $formStore.values[name] != 'boolean') {
        formStore.setValue(name,
            [true, 'on', 'true', 'yes'].includes($formStore.values[name])
        );
    }

    subscribeToFormSubmit(() => {
        ++inputKey;
    });

    const handleChange = (event) => {
        formStore.setValue(name, event.target.checked);
    }
</script>

<div class="flex justify-center items-center">
    <p
        class="w-1/3 md:w-1/4 mr-4 text-sm md:text-base"
    ><slot /></p>
    <div class="w-2/3 md:w-3/4 py-1">
        <label 
            for="checkbox-id-{name}"
            class="block bg-white relative w-12 h-6 rounded-full border border-gray-400 box-content cursor-pointer"
        >
            {#key inputKey}
                <input
                    {name}
                    type="checkbox"
                    id="checkbox-id-{name}"
                    class="sr-only peer hidden"
                    on:change={handleChange}
                    checked={$formStore.values[name]}
                >
            {/key}
            <span class="
                w-4 h-4 bg-gray-400 absolute rounded-full left-1 top-1 
                peer-checked:bg-gray-600 peer-checked:left-7
                transition-all duration-400
            "></span>
        </label>
    </div>
</div>