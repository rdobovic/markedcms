<script>
    import ContentItem from './ContentItem.svelte';
    import ContentForm from './ContentForm.svelte';

    export let data;

    const handleSave = async (e) => {
        const commands = e.detail;

        if (commands.length === 0)
            return;

        const result = await fetch('/api/content-structure', {
            method: 'PUT',
            body: JSON.stringify(commands),
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
</script>

<h1 class="text-3xl font-bold mb-8">Menu and post structure</h1>

<ContentForm 
    on:save={handleSave} 
    items={data.structure}
/>