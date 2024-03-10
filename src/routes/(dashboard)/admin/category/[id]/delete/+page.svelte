<script>
    import Form from '$lib/components/Form.svelte';
    import FormSection from '$lib/components/FormSection.svelte';
    import Button from '$lib/components/Button.svelte';

    import { formStore } from '$lib/stores/formStore.js';

    export let data;
    export let form;

    const formData = formStore({ name: 'category-delete-form' });
    
    $: formData.setErrors(form?.errors ?? {});
</script>

<Form store={formData}>
    <FormSection title="Delete category" name="global">
        <p>You are about to delete category <b>{data.category.title}</b></p>
        <p>Are you sure you want to delete it ?</p>
        <div slot="buttons" class="flex w-full gap-2">
            <Button class="w-full" slot="buttons" href={data.back}>Back</Button>
            <Button class="w-full text-red-700" slot="buttons">Delete</Button>
        </div>
    </FormSection>
</Form>
