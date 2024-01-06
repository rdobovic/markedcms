<script>
    import Form from '$lib/components/Form.svelte';
    import FormInput from '$lib/components/FormInput.svelte';
    import FormSection from '$lib/components/FormSection.svelte';
    import FormSelect from '$lib/components/FormSelect.svelte';
    import FormText from '$lib/components/FormText.svelte';
    import TaskListItem from '$lib/components/TaskListItem.svelte';

    const tasks = [
        {
            task: '<h2>Task 1</h2><p>This is some random text asdjfhajsd hfalkjsdhfl akjsdhfl ajksdhflakjsdhf lajksdhflajksdh dasdhf lakjsd flakjsd fhlasdjh falsjdfhalsjkdhfajsd hflajsdhf lasjdh flakjsdh f asdjfhajsd hfalkjsdhfl akjsdhfl ajksdhflakjsdhf lajksdhflajksdh dasdhf lakjsd flakjsd fhlasdjh falsjdfhalsjkdhfajsd hflajsdhf lasjdh flakjsdh f asdjfhajsd hfalkjsdhfl akjsdhfl ajksdhflakjsdhf lajksdhflajksdh dasdhf lakjsd flakjsd fhlasdjh falsjdfhalsjkdhfajsd hflajsdhf lasjdh flakjsdh f asdjfhajsd hfalkjsdhfl akjsdhfl ajksdhflakjsdhf lajksdhflajksdh dasdhf lakjsd flakjsd fhlasdjh falsjdfhalsjkdhfajsd hflajsdhf lasjdh flakjsdh f </p>',
            subtasks: [
                '<h2>Subtask 1</h2><p>This is some random text</p>',
                '<h2>Subtask 2</h2><p>This is some random text</p>',
                '<h2>Subtask 3</h2><p>This is some random text</p>',
            ]
        },{
            task: '<p>This is some random text</p>',
            subtasks: [
                '<h2>Subtask 1</h2><p>This is some random text</p>',
                '<h2>Subtask 2</h2><p>This is some random text</p>',
                '<h2>Subtask 3</h2><p>This is some random text</p>',
            ]
        },{
            task: '<h2>Task 3</h2><p>This is some random text</p>',
            subtasks: [
                '<h2>Subtask 1</h2><p>This is some random text</p>',
                '<h2>Subtask 2</h2><p>This is some random text</p>',
                '<h2>Subtask 3</h2><p>This is some random text</p>',
            ]
        },{
            task: '<p>How how are you ??</p>',
            subtasks: [],
        }
    ]

    export let data;
</script>

<h2>Welcome to SvelteKit, {data.test}</h2>

{#if data.user}
    <h1>Your name is {data.user}</h1>
{/if}
<div class=" p-5 flex flex-col gap-5">
    {#each tasks as tk}
        <TaskListItem task={tk.task} subtasks={tk.subtasks} taskUrl="/test"/>
    {/each}
</div>

<Form method="POST" action="?/login">
    <FormSection title="Login" error="Test error" submit="Login">
        <FormInput 
            type="text" 
            name="username" 
        >Username</FormInput>
        <FormInput 
            type="password" 
            name="password" 
        >Password</FormInput>
    </FormSection>
    <FormSection title="Test">
        <FormInput type="text" name="some">Something</FormInput>
    </FormSection>
    <FormText title="testing"></FormText>
    <FormSection submit="save">
        <FormSelect>Select Option</FormSelect>
        <FormInput type="date" name="some2">Something</FormInput>
    </FormSection>
</Form>