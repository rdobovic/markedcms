<script>
    import { formStore } from '$lib/stores/formStore.js';

    import Form from '$lib/components/Form.svelte';
    import FormInput from '$lib/components/FormInput.svelte';
    import FormSection from '$lib/components/FormSection.svelte';
    import Button from '$lib/components/Button.svelte';

    export let data;
    export let form;

    const formData = formStore({ name: 'users-edit-form' });

    $: formData.setErrors(form?.errors ?? {});
    $: formData.setValues({
        ...(data?.user ?? {}),
        ...(form?.data ?? {}),
    });

</script>

<Form store={formData}>
    <FormSection title="Edit user">
        <FormInput
            type="text"
            disabled={true}
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