<script>
    import { enhance } from '$app/forms';
    import Form from '$lib/components/Form.svelte';
    import FormInput from '$lib/components/FormInput.svelte';
    import FormSection from '$lib/components/FormSection.svelte';
    import FormCheckbox from '$lib/components/FormCheckbox.svelte';

    export let form;
    let password = '';

    const handleSubmit = () => {
        password = '';
    }
</script>

<Form method="POST" action="" on:submit={handleSubmit}>
    <FormSection title="Login" error={form?.error} submit="Login">
        <FormInput 
            type="text" 
            name="username" 
            value={form?.username}
        >Username</FormInput>
        <FormInput 
            type="password" 
            name="password"
            bind:value={password}
        >Password</FormInput>
        <FormCheckbox
            name="remember"
        >Remember me</FormCheckbox>
    </FormSection>
</Form>