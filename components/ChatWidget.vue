<script setup lang="ts"></script>

<template>
    <div class="w-screen h-screen flex flex-col bg-gray-50">
        <div class="w-full relative overflow-hidden flex flex-grow">
            <div class="flex flex-col w-full h-full">
                <header
                    class="flex items-center px-6 h-14 w-full bg-white border-b border-gray-200 shadow-sm fixed top-0 z-10"
                >
                    <h1 class="font-semibold text-lg">My Q&A chat tool</h1>
                </header>

                <div
                    class="p-6 mt-14 h-full flex flex-col-reverse overflow-y-auto"
                >
                    <PartsChain />
                </div>
            </div>
        </div>
    </div>
</template>
