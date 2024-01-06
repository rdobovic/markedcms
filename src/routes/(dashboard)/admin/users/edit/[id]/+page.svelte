<script>
    import Form from '$lib/components/Form.svelte';
    import FormInput from '$lib/components/FormInput.svelte';
    import FormSection from '$lib/components/FormSection.svelte';
    import Button from '$lib/components/Button.svelte';

    import getOldFunction from '$lib/helpers/getOldFunction.js';

    export let data;
    export let form;

    let pass, passRetype;
    $: old = getOldFunction(data.user, form?.data);

    const handleSubmit = () => {
        pass = passRetype = '';
    }

</script>

<Form on:submit={handleSubmit}>
    <FormSection title="Edit user">
        <FormInput
            type="text"
            disabled={true}
            name="username"
            value={data.user.username}
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

        <div slot="buttons" class="flex w-full gap-2">
            <Button 
                class="w-full"
                href="/admin/users"
            >Back</Button>
            <Button 
                class="w-full"
            >Save</Button>
        </div>
    </FormSection>
</Form>