<script>
    import Form from '$lib/components/Form.svelte';
    import FormSection from '$lib/components/FormSection.svelte';
    import FormSelect from '$lib/components/FormSelect.svelte';
    import Button from '$lib/components/Button.svelte';

    import { formStore } from '$lib/stores/formStore.js';

    export let data;
    export let form;

    const formData = formStore({ name: 'user-delete-form' });

    $: formData.setErrors(form?.errors ?? {});
    $: formData.setValues(form?.data ?? {});
</script>

<Form store={formData}>
    <FormSection title="Delete user" name="global">
        <p class="mb-4">
            You are about to delete user 
            <b>{data.user.username} ({data.user.displayName})</b>, 
            before deleting him/her you must choose whom to leave his/her 
            content to.
        </p>
        <FormSelect
            name="leaveTo"
            options={data.users}
        >Leave content to</FormSelect>
        <div slot="buttons" class="flex w-full gap-2">
            <Button 
                class="w-full" 
                href="/admin/users">Back</Button>
            <Button class="w-full text-red-700" slot="buttons">Delete</Button>
        </div>
    </FormSection>
</Form>