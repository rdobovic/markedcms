<script>
    import { enhance } from '$app/forms';
    import Form from '$lib/components/Form.svelte';
    import FormInput from '$lib/components/FormInput.svelte';
    import FormSection from '$lib/components/FormSection.svelte';
    import FormCheckbox from '$lib/components/FormCheckbox.svelte';

    import { formStore } from '$lib/stores/formStore.js';

    export let form;

    const formData = formStore({ name: 'login-form' });

    $: formData.setErrors(form?.errors ?? {});
    $: formData.setValues(form?.data ?? {});
</script>

<Form store={formData}>
    <FormSection title="Login" submit="Login" name="global">
        <FormInput 
            type="text" 
            name="username" 
        >Username</FormInput>
        <FormInput 
            type="password"
            name="password"
        >Password</FormInput>
        <FormCheckbox
            name="remember"
        >Remember me</FormCheckbox>
    </FormSection>
</Form>