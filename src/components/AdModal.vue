<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" @click="close"></div>

      <!-- Modal Content -->
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all">
        
        <!-- Header -->
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Advertisement</h3>
          <button @click="close" class="text-gray-400 hover:text-gray-600 transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Ad Body -->
        <div class="p-6 flex flex-col items-center">
           <!-- Placeholder for Ad Content -->
           <div class="w-full h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 mb-6 group relative overflow-hidden">
             
             <!-- PASTE YOUR AD CODE HERE -->
             <!-- <ins class="adsbygoogle" ...></ins> -->
             
             <span class="text-3xl mb-2">📢</span>
             <span class="font-medium">Ad Space (300x250)</span>
             <span class="text-xs mt-2">Support us by viewing this ad</span>

              <!-- Hover effect -->
              <div class="absolute inset-0 bg-gray-500 bg-opacity-0 group-hover:bg-opacity-5 transition-all flex items-center justify-center">
                <span class="opacity-0 group-hover:opacity-100 bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-600 shadow-sm border border-gray-200">
                  Replace with Ad Code
                </span>
              </div>
           </div>

           <p class="text-center text-gray-600 mb-6">
             Your download is ready! Please support our free tool by checking out our sponsors.
           </p>

           <!-- Action Button -->
           <button 
             @click="close"
             class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
           >
             <span>Continue to Download</span>
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
             </svg>
           </button>
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
