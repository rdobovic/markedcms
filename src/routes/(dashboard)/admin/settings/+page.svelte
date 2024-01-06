<script>
    import Form from '$lib/components/Form.svelte';
    import FormSection from '$lib/components/FormSection.svelte';
    import FormInput from '$lib/components/FormInput.svelte';
    import FormSelectSearch from '$lib/components/FormSelectSearch.svelte';

    import getOldFunction from '$lib/helpers/getOldFunction.js';

    export let data;
    export let form;

    $: old = getOldFunction(data.options, form?.data);

</script>

<h1 class="text-3xl font-bold mb-8">Update site settings</h1>

<Form>
    <FormSection title="Global settings" submit="Update settings">
        <FormInput 
            name="siteTitle"
            type="text"
            value={old('siteTitle')}
            errors={form?.errors?.siteTitle}
        >Site title</FormInput>
        <FormInput 
            name="footerCopyRight" 
            type="text"
            value={old('footerCopyRight')}
            errors={form?.errors?.footerCopyRight}
        >Site footer</FormInput>
        <FormSelectSearch
            name="homePageId"
            options={data.pages}
            value={old('homePageId', 0)}
        >Home page</FormSelectSearch>
    </FormSection>
</Form>

