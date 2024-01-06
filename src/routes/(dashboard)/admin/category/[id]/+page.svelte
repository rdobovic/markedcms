<script>
    import Form from '$lib/components/Form.svelte';
    import FormText from '$lib/components/FormText.svelte';
    import FormSelect from '$lib/components/FormSelect.svelte';
    import FormInput from '$lib/components/FormInput.svelte';
    import FormSection from '$lib/components/FormSection.svelte';
    import FormSelectSearch from '$lib/components/FormSelectSearch.svelte';
    import FormCheckbox from '$lib/components/FormCheckbox.svelte';

    import { onMount } from 'svelte';

    import titleToSlug from '$lib/helpers/titleToSlug.js';
    import getOldFunction from '$lib/helpers/getOldFunction.js';

    export let data;
    export let form;

    let customSlug = false;
    let title, slug, hasPage, categoryPage;

    $: old = getOldFunction(data?.category, form?.data);

    $: {
        old = old;
        populateForm();
    }

    const titleChange = () => {
        if (customSlug) return;
        slug = titleToSlug(title);
    }

    const useCustomSlug = () => {
        if (slug == '')
            customSlug = false;
        else
            customSlug = true;
    }

    const populateForm = async () => {
        title = old('title');
        slug = old('slug');
        hasPage = old('hasPage');
        categoryPage = old('bodyA');
    }
</script>

<h1 class="text-3xl font-bold mb-8">
    { data.action == 'create' ? 'Create new category' : 'Update category' }
</h1>

<Form>
    <FormSection
        title="Category options"
        submit="Save category"
    >
        <FormInput
            type="text"
            name="title"
            errors={form?.errors?.title}
            bind:value={title}
            on:input={titleChange}
        >Title</FormInput>

        <FormInput
            type="text"
            name="slug"
            errors={form?.errors?.slug}
            bind:value={slug}
            on:input={useCustomSlug}
            on:focusout={titleChange}
        >URL slug</FormInput>

        <FormCheckbox
            name="hasPage"
            bind:value={hasPage}
        >Has page</FormCheckbox>

        <FormCheckbox
            name="displayPosts"
            value={old('displayPosts', true)}
        >Display posts</FormCheckbox>

        <FormCheckbox
            name="display"
            value={old('display', true)}
        >Display in menu</FormCheckbox>

        <FormSelect
            name="authorId"
            options={data.authors}
            value={old('authorId', data.userId)}
        >Author</FormSelect>

        <FormSelectSearch
            name="parentId"
            options={data.categories}
            value={old('parentId')}
        >Parent category</FormSelectSearch>
    </FormSection>

    {#if hasPage}
        <FormText 
            title="Category page" 
            bind:value={categoryPage}
            name="bodyA"
            errors={form?.errors?.bodyA}
        ></FormText>
    {/if}
</Form>

