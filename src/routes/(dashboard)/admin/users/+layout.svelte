<script>
    import Table from '$lib/components/Table.svelte';
    import TableData from '$lib/components/TableData.svelte';
    import TableHeading from '$lib/components/TableHeading.svelte';
    import TableRow from '$lib/components/TableRow.svelte';
    import Button from '$lib/components/Button.svelte';

    import checkIcon from '$lib/images/check.svg';

    export let data;
</script>

<div class="flex flex-col gap-5">
    <h1 class="text-3xl font-bold mb-3">User manager</h1>

    <slot />

    <Table>
        <TableRow slot="heading">
            <TableHeading class="w-10">ID</TableHeading>
            <TableHeading>You</TableHeading>
            <TableHeading>Username</TableHeading>
            <TableHeading>Display name</TableHeading>
            <TableHeading class="w-36">Actions</TableHeading>
        </TableRow>

        {#each data.users as user}
            <TableRow>
                <TableData>{user.id}</TableData>
                <TableData>
                    {#if user.id === data.userId}
                        <img class="inline w-6" src={checkIcon} alt="YES" />
                    {/if}
                </TableData>
                <TableData>{user.username}</TableData>
                <TableData>{user.displayName}</TableData>
                <TableData class="flex gap-2 justify-center items-center">
                    <Button 
                        class="w-16 mt-0"
                        href={'/admin/users/edit/' + user.id}
                    >Edit</Button>
                    <Button 
                        class="w-16 mt-0 { user.id === data.userId ? '' : 'text-red-700' }"
                        href={'/admin/users/delete/' + user.id}
                        disabled={user.id === data.userId}
                    >Delete</Button>
                </TableData>
            </TableRow>
        {/each}
    </Table>
</div>