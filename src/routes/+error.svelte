<script>
    import { page } from '$app/stores';

    import PageLayout from './PageLayout.svelte';

    export let data;
</script>

<PageLayout sidebarHidden={true} title={data.title} footer={data.footer}>
    <h1
        class="text-center text-4xl font-bold mb-8"
    >Error { $page.status }</h1>
    <p>
        The content you are looking for doesn't exist or some other error
        occured, look into error code for more details. If you are an
        administrator of this website and this is the MarkedCMS error you can
        report it on our issue tracker on GitHub.
    </p>
</PageLayout>