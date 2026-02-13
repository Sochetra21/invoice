<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <router-link to="/" class="text-xl font-semibold text-gray-900">
            SwiftInvoice
          </router-link>
        </div>

        <!-- Header Buttons -->
        <div class="flex items-center gap-3">
          <router-link
            to="/"
            class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            :class="{ 'bg-gray-100': isCreatePage }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New
          </router-link>

          <router-link
            to="/history"
            class="px-4 py-2 rounded-lg transition flex items-center gap-2"
            :class="isHistoryPage ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            History
          </router-link>

          <!-- Buy Me a Coffee Button -->
          <router-link
            to="/donation"
            class="hidden md:flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition shadow-sm"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.216 6.415l-.132-.666c-.119-.596-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-1.526-1.448-2.808-1.634-3.218-1.68a.11.11 0 00-.011-.002c-1.188-.137-2.381-.048-3.57.063-.099.009-.234.022-.387.037l-.35.035c-.95.094-1.902.188-2.855.228a.112.112 0 00-.012 0c-1.52.128-2.275 1.579-2.316 2.477l-.462 8.783c.099 2.052 1.343 3.489 3.12 3.86a24.225 24.225 0 005.864.1c1.547-.132 2.684-1.383 3.012-2.87l.21-1.026.47-.074c1.137-.179 2.518-.517 2.483-2.196-.006-.297-.035-.59-.089-.877zm-9.102 11.21c-2.434.148-4.404-.79-4.57-2.806a.032.032 0 00-.032-.03.031.031 0 00-.005 0 .03.03 0 00-.024.015l-.946-5.835c-.067-1.344.81-2.023 1.933-2.115l.182-.014c2.257-.167 4.515-.315 6.772-.116.326.029.626.07.892.126 1.36.278 1.916 1.258 2.034 2.146l.729 4.301c.21 1.23-.464 2.228-1.684 2.768a.03.03 0 00-.015.04.03.03 0 00.013.013c.277.106.549.208.815.304 1.745.63 3.203-1.01 3.203-2.548 0-1.255-.83-2.738-2.008-3.238l-.782-.122.138-.696c.054-.239.083-.483.088-.73.016-1.018-.62-1.355-1.082-1.428l-.346-.026c-.722-.054-1.59-.092-2.355-.098l-3.29-.028c-.086 0-.173.003-.26.01l-2.09.167-.183.015c-1.123.092-2.001.77-1.935 2.115l.946 5.834c.166 2.016 2.136 2.953 4.57 2.806z"/>
            </svg>
            <span class="whitespace-nowrap">Buy me a coffee</span>
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content - This is where child routes render -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 px-6 py-4 mt-auto">
      <div class="max-w-7xl mx-auto text-center text-sm text-gray-600">
        © 2026 SwiftInvoice. All data is saved locally in your browser.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isCreatePage = computed(() => route.path === '/')
const isHistoryPage = computed(() => route.path === '/history')
</script>
