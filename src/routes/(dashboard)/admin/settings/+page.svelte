<script>
    import Form from '$lib/components/Form.svelte';
    import FormSection from '$lib/components/FormSection.svelte';
    import FormInput from '$lib/components/FormInput.svelte';
    import FormSelectSearch from '$lib/components/FormSelectSearch.svelte';
    import FormCheckbox from '$lib/components/FormCheckbox.svelte';
    import { formStore } from '$lib/stores/formStore.js';

    export let data;
    export let form;

    const formData = formStore({ name: 'options-form' });

    $: formData.setErrors(form?.errors ?? {});

    $: formData.setValues({
        homePageId: 0,

        ...(data?.options ?? {}),
        ...(form?.data    ?? {}),
    });

</script>

<h1 class="text-3xl font-bold mb-8">Update site settings</h1>

<Form store={formData}>
    <FormSection title="Global settings" submit="Update settings">
        <FormInput 
            name="siteTitle"
            type="text"
        >Site title</FormInput>
        <FormInput 
            name="footerCopyRight" 
            type="text"
        >Site footer</FormInput>
        <FormSelectSearch
            name="homePageId"
            options={data.pages}
        >Home page</FormSelectSearch>
        
        <FormCheckbox name="numeratePosts">Numerate posts</FormCheckbox>
        <FormCheckbox name="showPlainPosts">Show plain posts</FormCheckbox>
    </FormSection>
</Form>

