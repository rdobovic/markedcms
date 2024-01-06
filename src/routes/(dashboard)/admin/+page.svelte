<script>
    import Table from '$lib/components/Table.svelte';
    import TableData from '$lib/components/TableData.svelte';
    import TableHeading from '$lib/components/TableHeading.svelte';
    import TableRow from '$lib/components/TableRow.svelte';
    import Button from '$lib/components/Button.svelte';

    export let data;
</script>

<h1 class="text-3xl font-bold mb-3">Welcome {data.userDisplayName}</h1>
<p class="mb-6">This is your admin dashboard, use it to shape your website</p>

<h2 class="text-xl font-bold mb-2">Website statistics</h2>
<p class="mb-6">Table below will show you how many posts and categories are created on this website</p>

<Table>
    <TableRow slot="heading">
        <TableHeading>Created</TableHeading>
        <TableHeading>by You</TableHeading>
        <TableHeading>Total</TableHeading>
    </TableRow>
    <TableRow>
        <TableData>Posts</TableData>
        <TableData>{data.postsUser}</TableData>
        <TableData>{data.postsTotal}</TableData>
    </TableRow>
    <TableRow>
        <TableData>Categories</TableData>
        <TableData>{data.categoriesUser}</TableData>
        <TableData>{data.categoriesTotal}</TableData>
    </TableRow>
</Table>
