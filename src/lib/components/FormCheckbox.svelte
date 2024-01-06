<script>
    import { getContext } from "svelte";
    export let name;
    export let value = false;

    let inputKey = 0;
    const subscribeToFormSubmit = getContext('formSubmit');

    subscribeToFormSubmit(() => {
        ++inputKey;
    });
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
                    bind:checked={value}
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