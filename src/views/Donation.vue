<template>
  <div class="px-4 py-12 min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <!-- Header -->
      <div class="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-center">
        <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg class="w-8 h-8 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.216 6.415l-.132-.666c-.119-.596-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-1.526-1.448-2.808-1.634-3.218-1.68a.11.11 0 00-.011-.002c-1.188-.137-2.381-.048-3.57.063-.099.009-.234.022-.387.037l-.35.035c-.95.094-1.902.188-2.855.228a.112.112 0 00-.012 0c-1.52.128-2.275 1.579-2.316 2.477l-.462 8.783c.099 2.052 1.343 3.489 3.12 3.86a24.225 24.225 0 005.864.1c1.547-.132 2.684-1.383 3.012-2.87l.21-1.026.47-.074c1.137-.179 2.518-.517 2.483-2.196-.006-.297-.035-.59-.089-.877zm-9.102 11.21c-2.434.148-4.404-.79-4.57-2.806a.032.032 0 00-.032-.03.031.031 0 00-.005 0 .03.03 0 00-.024.015l-.946-5.835c-.067-1.344.81-2.023 1.933-2.115l.182-.014c2.257-.167 4.515-.315 6.772-.116.326.029.626.07.892.126 1.36.278 1.916 1.258 2.034 2.146l.729 4.301c.21 1.23-.464 2.228-1.684 2.768a.03.03 0 00-.015.04.03.03 0 00.013.013c.277.106.549.208.815.304 1.745.63 3.203-1.01 3.203-2.548 0-1.255-.83-2.738-2.008-3.238l-.782-.122.138-.696c.054-.239.083-.483.088-.73.016-1.018-.62-1.355-1.082-1.428l-.346-.026c-.722-.054-1.59-.092-2.355-.098l-3.29-.028c-.086 0-.173.003-.26.01l-2.09.167-.183.015c-1.123.092-2.001.77-1.935 2.115l.946 5.834c.166 2.016 2.136 2.953 4.57 2.806z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">Buy Me a Coffee</h1>
        <p class="text-yellow-100 text-sm">Support the development of SwiftInvoice</p>
      </div>

      <!-- Content -->
      <div class="p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Select an amount</h2>
        
        <!-- Preset Options -->
        <div class="grid grid-cols-1 gap-3 mb-6">
          <button
            v-for="option in options"
            :key="option.id"
            @click="selectOption(option)"
            class="flex items-center justify-between p-4 rounded-xl border-2 transition-all relative overflow-hidden"
            :class="selectedOption?.id === option.id ? 'border-yellow-400 bg-yellow-50' : 'border-gray-100 hover:border-yellow-200 hover:bg-gray-50'"
          >
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ option.emoji }}</span>
              <div class="text-left">
                <div class="font-bold text-gray-900">{{ option.name }}</div>
                <div class="text-xs text-gray-500">{{ option.desc }}</div>
              </div>
            </div>
            <div class="font-bold text-lg text-gray-900">${{ option.price }}</div>
            
            <!-- Checkmark -->
            <div v-if="selectedOption?.id === option.id" class="absolute right-0 top-0 p-1 bg-yellow-400 rounded-bl-lg">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </button>
        </div>

        <!-- Custom Amount -->
        <div class="mb-8">
          <label class="block text-sm font-medium text-gray-700 mb-2">Or enter custom amount</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              v-model="customAmount"
              @focus="selectedOption = null"
              type="number"
              step="0.50"
              min="0.50"
              placeholder="0.00"
              class="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent font-medium text-lg"
            />
          </div>
        </div>

        <!-- Total and Action -->
        <div class="space-y-4">
          <div class="flex justify-between items-center text-sm font-medium">
            <span class="text-gray-600">Total Contribution</span>
            <span class="text-xl font-bold text-gray-900">${{ displayAmount }}</span>
          </div>

          <button
            @click="processDonation"
            :disabled="!isValidAmount"
            class="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl shadow-lg shadow-yellow-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Support Now
          </button>
          
          <button @click="$router.back()" class="w-full text-center text-sm text-gray-500 hover:text-gray-800 p-2">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const options = [
  { id: 1, name: 'Coffee', price: 1, emoji: '☕', desc: 'Fuel for coding' },
  { id: 2, name: 'Small Meal', price: 2, emoji: '🥯', desc: 'Keep me going' },
  { id: 3, name: 'Big Meal', price: 3, emoji: '🍕', desc: 'Coding power boost' },
]

const selectedOption = ref(options[1]) // Default to Small Meal
const customAmount = ref('')

const selectOption = (option) => {
  selectedOption.value = option
  customAmount.value = ''
}

const displayAmount = computed(() => {
  if (customAmount.value) {
    return Number(customAmount.value).toFixed(2)
  }
  return selectedOption.value ? selectedOption.value.price.toFixed(2) : '0.00'
})

const isValidAmount = computed(() => {
  const amount = Number(displayAmount.value)
  return amount > 0 && !isNaN(amount)
})

const processDonation = () => {
  alert(`Thank you! This would process a payment of $${displayAmount.value} (Demo)`)
}
</script>
