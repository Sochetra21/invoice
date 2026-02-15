<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <!-- Logo -->
        <div class="flex items-center gap-2"> 
          <img src="@/assets/icon.png" alt="Logo" class="w-8 h-8 sm:w-10 sm:h-10">
          <span class="text-lg sm:text-xl font-semibold text-gray-900">Invoxify</span>
        </div>

        <!-- Header Buttons -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- New Invoice Button -->
          <router-link
            to="/"
            class="px-3 sm:px-4 py-2 rounded-lg transition flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
            :class="isCreatePage ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
          >
            <!-- Plus icon for New -->
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span class="hidden sm:inline">New</span>
          </router-link>

          <!-- History Button -->
          <router-link
            to="/history"
            class="px-3 sm:px-4 py-2 rounded-lg transition flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
            :class="isHistoryPage ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
          >
            <!-- Clock icon for History -->
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="hidden sm:inline">History</span>
          </router-link>

          <!-- Buy Me a Coffee Button (Desktop Only) -->
          <!-- <button
            @click="showCoffeeModal = true"
            class="hidden md:flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition shadow-sm"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.216 6.415l-.132-.666c-.119-.596-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-1.526-1.448-2.808-1.634-3.218-1.68a.11.11 0 00-.011-.002c-1.188-.137-2.381-.048-3.57.063-.099.009-.234.022-.387.037l-.35.035c-.95.094-1.902.188-2.855.228a.112.112 0 00-.012 0c-1.52.128-2.275 1.579-2.316 2.477l-.462 8.783c.099 2.052 1.343 3.489 3.12 3.86a24.225 24.225 0 005.864.1c1.547-.132 2.684-1.383 3.012-2.87l.21-1.026.47-.074c1.137-.179 2.518-.517 2.483-2.196-.006-.297-.035-.59-.089-.877zm-9.102 11.21c-2.434.148-4.404-.79-4.57-2.806a.032.032 0 00-.032-.03.031.031 0 00-.005 0 .03.03 0 00-.024.015l-.946-5.835c-.067-1.344.81-2.023 1.933-2.115l.182-.014c2.257-.167 4.515-.315 6.772-.116.326.029.626.07.892.126 1.36.278 1.916 1.258 2.034 2.146l.729 4.301c.21 1.23-.464 2.228-1.684 2.768a.03.03 0 00-.015.04.03.03 0 00.013.013c.277.106.549.208.815.304 1.745.63 3.203-1.01 3.203-2.548 0-1.255-.83-2.738-2.008-3.238l-.782-.122.138-.696c.054-.239.083-.483.088-.73.016-1.018-.62-1.355-1.082-1.428l-.346-.026c-.722-.054-1.59-.092-2.355-.098l-3.29-.028c-.086 0-.173.003-.26.01l-2.09.167-.183.015c-1.123.092-2.001.77-1.935 2.115l.946 5.834c.166 2.016 2.136 2.953 4.57 2.806z"/>
            </svg>
            <span class="whitespace-nowrap">Buy me a coffee</span>
          </button> -->
        </div>
      </div>
    </header>

    <!-- Main Content - This is where child routes render -->
    <main class="flex-1 pb-20 sm:pb-6">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 mt-auto">
      <div class="max-w-7xl mx-auto text-center text-xs sm:text-sm text-gray-600">
        © 2026 Invoxify. All data is saved locally in your browser.
      </div>
    </footer>

    <!-- Floating Buy Me a Coffee Button -->
    <button
      @click="showCoffeeModal = true"
      class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-[#FFDD00] text-gray-900 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95"
      :class="[
        'md:flex md:items-center md:gap-2 md:group md:hover:scale-105',
        'flex items-center justify-center',
        'w-14 h-14 sm:w-16 sm:h-16 md:w-auto md:h-auto md:px-3 md:py-3'
      ]"
      aria-label="Buy me a coffee"
    >
      <!-- Mobile: Just icon -->
      <div class="flex items-center justify-center md:hidden">
        <span class="text-2xl sm:text-3xl">☕</span>
      </div>
      
      <!-- Desktop: Icon in circle + expandable text -->
      <div class="hidden md:flex items-center gap-2">
        <div class="w-8 h-8 flex items-center justify-center bg-white rounded-full bg-opacity-20">
          <span class="text-xl">☕</span>
        </div>
        <span class="font-bold pr-2 hidden group-hover:inline transition-all duration-300 whitespace-nowrap">
          Buy me a coffee
        </span>
      </div>
    </button>

    <!-- Buy Me Coffee Modal -->
    <BuyMeCoffee :show="showCoffeeModal" @close="showCoffeeModal = false" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import BuyMeCoffee from '../components/BuyMeCoffee.vue'

const route = useRoute()
const showCoffeeModal = ref(false)

const isCreatePage = computed(() => route.path === '/')
const isHistoryPage = computed(() => route.path === '/history')
</script>

<style scoped>
/* Ensure the floating button is always visible and accessible */
@media (max-width: 640px) {
  /* Add safe area for devices with notches */
  .fixed.bottom-4 {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Smooth transitions for button interactions */
button:active {
  transform: scale(0.95);
}

/* Ensure button doesn't interfere with scrolling */
@supports (backdrop-filter: blur(10px)) {
  .fixed {
    backdrop-filter: blur(10px);
  }
}
</style>