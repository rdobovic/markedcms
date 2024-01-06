<div class="flex flex-col">
    <div class="overflow-x-auto">
        <div class="min-w-full inline-block">
            <div class="border border-gray-400 overflow-hidden rounded-md bg-gray-100">
                <table class="min-w-full divide-y divide-gray-400 text-center">
                    <thead>
                        <slot name="heading" />
                    </thead>
                    <tbody class="divide-y divide-gray-400">
                        <slot />
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>