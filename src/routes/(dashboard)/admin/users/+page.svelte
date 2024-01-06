<script>
    import Form from '$lib/components/Form.svelte';
    import FormInput from '$lib/components/FormInput.svelte';
    import FormSection from '$lib/components/FormSection.svelte';
    import Button from '$lib/components/Button.svelte';

    import getOldFunction from '$lib/helpers/getOldFunction.js';

    export let form;

    let pass, passRetype;
    $: old = getOldFunction(null, form?.data);

    const handleSubmit = () => {
        pass = passRetype = '';
    }

</script>

<Form on:submit={handleSubmit}>
    <FormSection submit="Create" title="Create user">
        <FormInput
            type="text"
            name="username"
            value={old('username')}
            errors={form?.errors?.username}
        >Username</FormInput>
        <FormInput
            type="text"
            name="displayName"
            value={old('displayName')}
            errors={form?.errors?.displayName}
        >Display name</FormInput>
        <FormInput
            type="password"
            name="password"
            bind:value={pass}
            errors={form?.errors?.password}
        >Password</FormInput>
        <FormInput
            type="password"
            name="passwordRetype"
            bind:value={passRetype}
            errors={form?.errors?.passwordRetype}
        >Retype password</FormInput>
    </FormSection>
</Form>