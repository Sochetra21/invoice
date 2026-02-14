<template>
  <Transition name="modal">
    <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-container" @click.stop>
        <!-- Close Button (only shows after countdown) -->
        <button 
          v-if="canSkip" 
          class="modal-close" 
          @click="closeModal" 
          aria-label="Close"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Modal Content -->
        <div class="modal-content">
          <!-- 
            ============================================
            PASTE YOUR AD CODE HERE
            ============================================
            
            Example for Google AdSense (Responsive):
            
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                 data-ad-slot="XXXXXXXXXX"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script>
              (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
            
            Or for Video Ads:
            <div id="video-ad-container"></div>
            <script>
              // Your video ad script
            </script>
            
            Or other ad networks - paste their code here!
            ============================================
          -->
          
          
          
          
          <!-- Don't remove this placeholder - it shows until you add real ads -->
          <div v-if="!hasAdCode" class="ad-placeholder">
            <div class="placeholder-icon">📢</div>
            <h3 class="placeholder-title">Advertisement Space</h3>
            <p class="placeholder-text">Paste your ad code in AdModal.vue</p>
            <p class="placeholder-hint">This modal shows before PDF download</p>
          </div>

          <!-- Skip/Continue Button -->
          <div class="modal-footer">
            <button 
              v-if="canSkip" 
              class="continue-button" 
              @click="closeModal"
            >
              Continue to Download →
            </button>
            <div v-else class="countdown-message">
              <svg class="countdown-spinner" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Please wait {{ countdown }} seconds...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  // How long before user can skip (in seconds)
  skipDelay: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['close'])

// Set this to true once you paste your ad code above
const hasAdCode = false

const countdown = ref(props.skipDelay)
const canSkip = ref(false)
let countdownInterval = null

// Start countdown when modal shows
watch(() => props.show, (newVal) => {
  if (newVal) {
    startCountdown()
  } else {
    stopCountdown()
  }
})

const startCountdown = () => {
  countdown.value = props.skipDelay
  canSkip.value = false

  countdownInterval = setInterval(() => {
    countdown.value--
    
    if (countdown.value <= 0) {
      canSkip.value = true
      stopCountdown()
    }
  }, 1000)
}

const stopCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}

const closeModal = () => {
  stopCountdown()
  emit('close')
}

const handleOverlayClick = () => {
  if (canSkip.value) {
    closeModal()
  }
}

onBeforeUnmount(() => {
  stopCountdown()
})
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
}

/* Modal Container */
.modal-container {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Close Button */
.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  color: #4b5563;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

/* Modal Content */
.modal-content {
  padding: 32px 24px 24px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

/* Ad Placeholder */
.ad-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 48px 24px;
  background: #f9fafb;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 20px;
}

.placeholder-icon {
  font-size: 64px;
}

.placeholder-title {
  font-size: 24px;
  font-weight: 700;
  color: #374151;
  margin: 0;
}

.placeholder-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.placeholder-hint {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
  font-style: italic;
}

/* Modal Footer */
.modal-footer {
  margin-top: auto;
  padding-top: 16px;
}

.continue-button {
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
}

.continue-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(37, 99, 235, 0.4);
}

.continue-button:active {
  transform: translateY(0);
}

.countdown-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: #f3f4f6;
  border-radius: 12px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

.countdown-spinner {
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
  color: #3b82f6;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .modal-container {
    border-radius: 12px;
    max-width: 95%;
  }

  .modal-content {
    padding: 24px 16px 16px;
    min-height: 250px;
  }

  .ad-placeholder {
    padding: 32px 16px;
  }

  .placeholder-icon {
    font-size: 48px;
  }

  .placeholder-title {
    font-size: 20px;
  }

  .continue-button {
    font-size: 15px;
    padding: 14px 24px;
  }
}

/* Custom scrollbar */
.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: #f3f4f6;
}

.modal-container::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>