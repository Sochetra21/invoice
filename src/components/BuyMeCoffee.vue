<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" @click="close"></div>

      <!-- Modal Content -->
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all">
        
        <!-- Header -->
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Support</h3>
          <button @click="close" class="text-gray-400 hover:text-gray-600 transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Ad Body -->
        <div class="p-6 flex flex-col items-center">
           <!-- Placeholder for Ad Content -->
          <!-- Buy Me a Coffee Section -->
          <!-- Buy Me a Coffee Section -->
          <a href="https://buymeacoffee.com/sozin" target="_blank" rel="noopener noreferrer" 
             class="w-full bg-[#FFDD00] rounded-xl flex flex-col items-center justify-center text-gray-800 mb-6 p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-all group hover:-translate-y-1 block cursor-pointer">
            
            <div class="relative z-10 flex flex-col items-center">
              <span class="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">☕</span>
              <span class="font-bold text-lg mb-1">Buy me a coffee</span>
              <span class="text-sm font-medium text-gray-700 text-center">Support the developer to keep this tool free!</span>
              
              <div class="mt-4 px-6 py-2 bg-black text-white rounded-full font-bold text-sm shadow-md group-hover:bg-gray-800 transition-colors">
                Support Now
              </div>
            </div>

            <!-- Decorative background circles -->
            <div class="absolute -top-6 -left-6 w-24 h-24 bg-white opacity-20 rounded-full z-0 pointer-events-none"></div>
            <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-white opacity-20 rounded-full z-0 pointer-events-none"></div>
          </a>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: Boolean
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script> 

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
