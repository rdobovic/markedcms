<script>
    import Form from '$lib/components/Form.svelte';
    import FormText from '$lib/components/FormText.svelte';
    import FormSelect from '$lib/components/FormSelect.svelte';
    import FormInput from '$lib/components/FormInput.svelte';
    import FormSection from '$lib/components/FormSection.svelte';
    import FormSelectSearch from '$lib/components/FormSelectSearch.svelte';
    import FormCheckbox from '$lib/components/FormCheckbox.svelte';

    import titleToSlug from '$lib/helpers/titleToSlug.js';
    import { formStore } from '$lib/stores/formStore.js';

    export let data;
    export let form;

    let customSlug = false;
    const formData = formStore({ name: 'category-form' });

    $: formData.setErrors(form?.errors ?? {});
    $: formData.setValues({
        hasPage: false,
        authorId: data.userId,
        display: true,
        
        ...(data?.category ?? {}),
        ...(form?.data     ?? {}),
    });

    const titleChange = () => {
        if (customSlug) return;
        formData.setValue('slug', titleToSlug($formData.values.title));
    }

    const useCustomSlug = () => {
        if ($formData.values.slug == '')
            customSlug = false;
        else
            customSlug = true;
    }
</script>

<h1 class="text-3xl font-bold mb-8">
    { data.action == 'create' ? 'Create new category' : 'Update category' }
</h1>

<Form store={formData}>
    <FormSection
        title="Category options"
        submit="Save category"
    >
        <FormInput
            type="text"
            name="title"
            on:input={titleChange}
        >Title</FormInput>

        <FormInput
            type="text"
            name="slug"
            on:input={useCustomSlug}
            on:focusout={titleChange}
        >URL slug</FormInput>

        <FormCheckbox
            name="hasPage"
        >Has page</FormCheckbox>

        <FormCheckbox
            name="displayPosts"
        >Display posts</FormCheckbox>

        <FormCheckbox
            name="display"
        >Display in menu</FormCheckbox>

        <FormSelect
            name="authorId"
            options={data.authors}
        >Author</FormSelect>

        <FormSelectSearch
            name="parentId"
            options={data.categories}
        >Parent category</FormSelectSearch>
    </FormSection>

    {#if $formData.values.hasPage}
        <FormText 
            title="Category page"
            name="bodyA"
        ></FormText>
    {/if}
</Form>

