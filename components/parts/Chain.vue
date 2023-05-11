<script setup lang="ts">
const {
    askQuestion,
    question,
    isLoadingMessage,
    uiChatHistory,
    clearHistory,
    error,
} = useChain();

function convertReferenceUrlIntoFileName(url: string) {
    const splitUrl = url.split('/');
    return splitUrl[splitUrl.length - 1];
}
</script>

<template>
    <div
        class="flex flex-col w-full max-w-screen-md mx-auto"
        :class="{
            'h-full': !uiChatHistory.length, // enables empty state
        }"
    >
        <!-- Empty state -->
        <div
            v-if="!uiChatHistory.length"
            class="h-full w-full flex flex-col items-center justify-center text-gray-400"
        >
            <svg
                class="w-14 h-14 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
            >
                <path
                    d="M73.6 40.7H41.1c-3.6 0-6.5 2.9-6.5 6.5v19.7c0 3.6 2.9 6.5 6.5 6.5h22.3l7.4 7.4c.5.5 1.1.7 1.7.7.6 0 1.2-.2 1.7-.7s.8-1.1.8-1.8v-5.8c3-.6 5.2-3.2 5.2-6.4V47.3c-.1-3.6-3-6.6-6.6-6.6zm2 26.2a2 2 0 0 1-2 2h-3.2V74l-5.1-5.1H41.1a2 2 0 0 1-2-2V47.3c0-1.1.9-2 2-2h32.5a2 2 0 0 1 2 2zM64.3 53c0 1.1-.3 2.2-1 3.2s-1.6 1.7-2.6 2.3c-.6.4-1 .8-1.2 1.2-.1.3-.2.7-.3 1.2 0 .4-.4.6-.7.6h-3.2c-.4 0-.8-.4-.7-.8.1-.9.3-1.6.7-2.1.5-.6 1.3-1.4 2.5-2.2.6-.4 1.1-.9 1.5-1.4.4-.6.5-1.2.5-2s-.2-1.4-.6-1.8c-.4-.5-1-.7-1.8-.7-.6 0-1.1.2-1.5.6-.3.2-.4.5-.5.9-.1.5-.6.8-1.1.7l-3-.1c-.4 0-.7-.3-.6-.7.1-1.6.7-2.8 1.8-3.6 1.2-1 2.9-1.4 4.9-1.4 2.2 0 3.9.6 5.2 1.7 1 1.1 1.7 2.5 1.7 4.4zm-5.2 11.6v1.7c0 .6-.5 1-1 1h-2.6a1 1 0 0 1-1-1v-1.7c0-.6.5-1 1-1h2.6c.6-.1 1 .4 1 1zm-19-28.2a9.7 9.7 0 0 0-9.7 9.7v13.1h-3.9c-3.6 0-6.5-2.9-6.5-6.5V33.1c0-3.5 2.8-6.4 6.3-6.5v-5.7c0-1.5 1.4-2.7 3-2.4.5.1.9.4 1.2.7l7.3 7.3H59c3.6 0 6.5 2.9 6.5 6.5v3.4z"
                />
            </svg>
            <span class="mt-2">Ask questions of our knowledge base</span>
        </div>

        <div class="w-full flex flex-col space-y-6">
            <span
                class="p-3 font-semibold text-sm rounded-lg flex flex-col"
                :class="
                    chatItem.role === 'user'
                        ? 'self-end ml-10 bg-gray-200 text-gray-800'
                        : 'self-start mr-10 bg-indigo-600 text-white'
                "
                v-for="(chatItem, idx) in uiChatHistory"
                :key="idx"
            >
                {{ chatItem.message }}

                <ol
                    v-if="chatItem.references?.length"
                    class="mt-2 flex items-center gap-2 flex-wrap"
                >
                    <li
                        v-for="(reference, idx) in chatItem.references"
                        :key="idx"
                    >
                        <a :href="reference" class="text-indigo-200"
                            >[{{
                                convertReferenceUrlIntoFileName(reference)
                            }}]</a
                        >
                    </li>
                </ol>
            </span>

            <!-- "Typing" loading indicator indicator -->
            <span
                v-if="isLoadingMessage"
                class="p-1.5 rounded bg-gray-200 text-gray-400 flex items-center space-x-2 self-start"
            >
                <div
                    class="bg-current p-1 rounded-full animate-bounce"
                    style="animation-delay: 0.1s"
                ></div>
                <div
                    class="bg-current p-1 rounded-full animate-bounce"
                    style="animation-delay: 0.2s"
                ></div>
                <div
                    class="bg-current p-1 rounded-full animate-bounce"
                    style="animation-delay: 0.3s"
                ></div>
            </span>
        </div>

        <div v-if="error" class="p-4 bg-red-100 text-red-800 mt-4">
            {{ error }}
        </div>

        <form
            @submit.prevent="askQuestion"
            class="flex flex-col w-full"
            :class="{
                'mt-6': uiChatHistory.length > 0,
            }"
        >
            <input
                v-model="question"
                :disabled="isLoadingMessage"
                type="text"
                placeholder="Ask your question..."
                class="h-14 px-3 border border-gray-200 disabled:bg-gray-50"
            />

            <div class="font-medium text-xs text-gray-400 mt-1.5">
                <div
                    v-if="!isLoadingMessage"
                    class="w-full flex items-center justify-between"
                >
                    <p>Press enter to ask...</p>

                    <button
                        v-if="uiChatHistory.length > 0"
                        @click="clearHistory"
                        class="text-inidgo-600 underline"
                        type="button"
                    >
                        Reset topic
                    </button>
                </div>
                <p class="animate-pulse" v-else>
                    Analysing the knowledge base...
                </p>
            </div>
        </form>
    </div>
</template>
