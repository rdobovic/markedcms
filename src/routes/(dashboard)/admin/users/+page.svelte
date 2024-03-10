<script>
    import Form from '$lib/components/Form.svelte';
    import FormInput from '$lib/components/FormInput.svelte';
    import FormSection from '$lib/components/FormSection.svelte';
    
    import { formStore } from '$lib/stores/formStore.js';

    export let form;

    const formData = formStore({ name: 'users-form' });

    $: formData.setErrors(form?.errors ?? {});
    $: formData.setValues(form?.data ?? {});
</script>

<Form store={formData}>
    <FormSection submit="Create" title="Create user">
        <FormInput
            type="text"
            name="username"
        >Username</FormInput>
        <FormInput
            type="text"
            name="displayName"
        >Display name</FormInput>
        <FormInput
            type="password"
            name="password"
        >Password</FormInput>
        <FormInput
            type="password"
            name="passwordRetype"
        >Retype password</FormInput>
    </FormSection>
</Form>