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

    const formData = formStore({ name: 'post-form' });

    $: formData.setErrors(form?.errors ?? {});

    $: formData.setValues({
        subType: 'single',
        parentId: null,

        ...(data?.post ?? {}),
        ...(form?.data ?? {}),
    });

    const subTypes = [
        { name: 'Single body', value: 'single' },
        { name: 'Split body',  value: 'split'  },
    ];

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
    { data.action == 'create' ? 'Create new post' : 'Update post' }
</h1>

<Form store={formData}>
    <FormSection
        title="Post options"
        submit="Save post"
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

        <FormSelect 
            name="subType"
            options={subTypes}
        >Body type</FormSelect>

        <FormCheckbox name="displayPosts">Display posts</FormCheckbox>
        <FormCheckbox name="display">Display in menu</FormCheckbox>

        <FormSelect
            name="authorId" 
            options={data.authors}
        >Author</FormSelect>

        <FormSelectSearch 
            name="categoryIdString" 
            options={data.categoryIdStrings}
            disabled={!!$formData.values.parentId}
        >Categories</FormSelectSearch>

        <FormSelectSearch
            name="parentId"
            options={data.posts}
            disabled={data?.post?.hasChildren}
        >Parent post</FormSelectSearch>
    </FormSection>
    
    {#if $formData.values.subType === 'single'}
        <FormText name="bodyA" title="Post body"></FormText>
    {:else}
        <FormText name="bodyA" title="Post header"></FormText>
        <FormText name="bodyB" title="Post body"></FormText>
    {/if}
</Form>

