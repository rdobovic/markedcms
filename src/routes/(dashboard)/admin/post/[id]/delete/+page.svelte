<script>
    import Form from '$lib/components/Form.svelte';
    import FormSection from '$lib/components/FormSection.svelte';
    import Button from '$lib/components/Button.svelte';

    export let data;
    export let form;
</script>

<Form>
    <FormSection title="Delete post" error={form?.error}>
        <p>You are about to delete post <b>{data.post.title}</b></p>
        <p>Are you sure you want to delete it ?</p>
        <div slot="buttons" class="flex w-full gap-2">
            <Button class="w-full" slot="buttons" href={data.back}>Back</Button>
            <Button class="w-full text-red-700" slot="buttons">Delete</Button>
        </div>
    </FormSection>
</Form>
