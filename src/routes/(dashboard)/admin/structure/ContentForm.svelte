<script>
    import ContentItem from "./ContentItem.svelte";
    import Button from "$lib/components/Button.svelte";
    import { setContext, createEventDispatcher } from "svelte";

    export let items;

    let orderCommands = [];
    let displayCommands = [];

    const dispatch = createEventDispatcher();

    const runCommand = (cmd) => {
        // Handle display commands
        if (cmd.name === 'display') {
            const oldCmd = displayCommands.find(
                c => c.id === cmd.id
            );

            if (!oldCmd) {
                displayCommands.push({
                    id: cmd.id,
                    name: 'display',
                    state: cmd.state,
                });
            } else {
                oldCmd.state = cmd.state;
            }
        }
        // Handle move commands
        if (cmd.name === 'move') {
            const last = orderCommands.length - 1;

            if (last >= 0 && orderCommands[last].id === cmd.id) {
                orderCommands[last].move += cmd.move;
            } else {
                orderCommands.push({
                    id: cmd.id,
                    name: 'move',
                    move: cmd.move,
                });
            }
        }
    }

    setContext('contentFormRun', runCommand);

    const handleSaveStructure = () => {
        const commands = [ 
            ...displayCommands,
            ...orderCommands.filter(cmd => cmd.move !== 0),
        ];

        dispatch('save', commands);

        orderCommands = [];
        displayCommands = [];
    }
</script>

<div class="flex flex-col gap-6 w-full">
    <div class="bg-gray-200 rounded-md p-4 flex flex-col border border-gray-400 w-full">
        <p>
            Once you finished editing post and category hierarchy below, press
            following save button or your changes will be lost once you leave
            this page.
        </p>
        <Button on:click={handleSaveStructure} class="mt-6">Save</Button>
    </div>

    <div class="overflow-x-auto w-full p-4">
        <ContentItem dummy={true} dummyText="Everything is within this category" item={{
            type: 'category',
            title: 'Root category',
            display: true,
            children: items,
        }} />
    </div>
</div>

