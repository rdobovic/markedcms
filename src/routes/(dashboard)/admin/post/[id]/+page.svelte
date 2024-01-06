<script>
    import Form from '$lib/components/Form.svelte';
    import FormText from '$lib/components/FormText.svelte';
    import FormSelect from '$lib/components/FormSelect.svelte';
    import FormInput from '$lib/components/FormInput.svelte';
    import FormSection from '$lib/components/FormSection.svelte';
    import FormSelectSearch from '$lib/components/FormSelectSearch.svelte';
    import FormCheckbox from '$lib/components/FormCheckbox.svelte';

    import titleToSlug from '$lib/helpers/titleToSlug.js';
    import getOldFunction from '$lib/helpers/getOldFunction.js';

    export let data;
    export let form;

    let customSlug = false;
    let title, slug, postBodyA, postBodyB, parent, postType;

    $: old = getOldFunction(data?.post, form?.data);

    $: {
        old = old;
        populateForm();
    }

    const postTypes = [
        { name: 'Single body', value: 'single' },
        { name: 'Split body', value: 'split' },
    ];

    const setPostType = (typeData) => {
        postType = typeData.detail.value;
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
        postBodyA = old('bodyA');
        postBodyB = old('bodyB');
        parent = old('parentId', null);
        postType = old('postType', 'single');
    }
</script>

<h1 class="text-3xl font-bold mb-8">
    { data.action == 'create' ? 'Create new post' : 'Update post' }
</h1>

<Form>
    <FormSection
        title="Post options"
        submit="Save post"
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

        <FormSelect 
            value={old('postType', 'single')}
            name="postType"
            options={postTypes}
            on:change={setPostType}
        >Body type</FormSelect>

        <FormCheckbox
            name="displayPosts"
            value={old('displayPosts', true)}
        >Display posts</FormCheckbox>

        <FormCheckbox
            name="display"
            value={old('display')}
        >Display in menu</FormCheckbox>

        <FormSelect
            name="authorId" 
            options={data.authors}
            value={old('authorId', data.userId)}
        >Author</FormSelect>

        <FormSelectSearch 
            name="categoryId" 
            options={data.categories}
            value={old('categoryId')}
            disabled={parent != 0}
        >Categories</FormSelectSearch>

        <FormSelectSearch
            name="parentId"
            options={data.posts}
            bind:value={parent}
            disabled={data?.post?.hasChildren}
        >Parent post</FormSelectSearch>
    </FormSection>

    {#if postType === 'single'}
        <FormText 
            title="Post body" 
            bind:value={postBodyA}
            name="bodyA"
            errors={form?.errors?.bodyA}
        ></FormText>
    {:else}
        <FormText 
            title="Post header" 
            bind:value={postBodyA} 
            name="bodyA"
            errors={form?.errors?.bodyA}
        ></FormText>
        <FormText 
            title="Post body" 
            bind:value={postBodyB} 
            name="bodyB"
        ></FormText>
    {/if}
</Form>

