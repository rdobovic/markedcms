<script>
    import { getContext } from "svelte";

    export let type;
    export let name;
    export let value = '';
    export let errors = [];
    export let disabled = false;

    const textTypes = ['text', 'password', 'date'];
    const typeHack = node => node.type = type;

    let inputKey = 0;
    const subscribeToFormSubmit = getContext('formSubmit');

    subscribeToFormSubmit(() => {
        ++inputKey;
    })
</script>

{#if textTypes.includes(type)}
    <div class="flex items-center">
        <label 
            for="input-id-{name}"
            class="w-1/3 md:w-1/4 mr-4 text-sm md:text-base"
        ><slot /></label>
        <div class="w-2/3 md:w-3/4">
            {#key inputKey}
                <input
                    use:typeHack
                    {name}
                    {disabled}
                    bind:value={value}
                    on:focusin
                    on:focusout
                    on:input
                    id="input-id-{name}"
                    class="w-full p-1 px-3 rounded-md border border-gray-400 focus:outline focus:outline-2 focus:outline-gray-400"
                />
            {/key}
            {#if errors && errors.length > 0}
                <p class="pl-1 text-xs text-red-500">{errors[0]}</p>
            {/if}
        </div>
    </div>    
{/if}

<div class=""></div>