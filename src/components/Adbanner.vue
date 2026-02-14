<template>
  <div class="ad-banner-wrapper" :class="sizeClass">
    <div class="ad-container" :style="bannerStyle">
      <!-- 
        ============================================
        PASTE YOUR AD CODE HERE
        ============================================
        
        Example for Google AdSense:
        
        <ins class="adsbygoogle"
             style="display:inline-block;width:728px;height:90px"
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="XXXXXXXXXX"></ins>
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
        
        Or other ad networks - just paste their code here!
        ============================================
      -->
      
      
      
      
      <!-- Don't remove this placeholder - it shows until you add real ads -->
      <div v-if="!hasAdCode" class="ad-placeholder">
        <span class="placeholder-label">{{ size.toUpperCase() }} AD SPACE</span>
        <span class="placeholder-size">{{ getSizeText() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'leaderboard',
    validator: (value) => ['leaderboard', 'rectangle', 'banner', 'skyscraper', 'mobile-banner'].includes(value)
  }
})

// Set this to true once you paste your ad code above
const hasAdCode = false

const sizeConfig = {
  'leaderboard': { width: '728px', height: '90px', maxWidth: '100%' },
  'rectangle': { width: '300px', height: '250px', maxWidth: '100%' },
  'banner': { width: '468px', height: '60px', maxWidth: '100%' },
  'skyscraper': { width: '160px', height: '600px', maxWidth: '100%' },
  'mobile-banner': { width: '320px', height: '50px', maxWidth: '100%' }
}

const sizeClass = computed(() => `ad-banner-${props.size}`)

const bannerStyle = computed(() => {
  const config = sizeConfig[props.size] || sizeConfig.leaderboard
  return {
    width: config.width,
    height: config.height,
    maxWidth: config.maxWidth
  }
})

const getSizeText = () => {
  const config = sizeConfig[props.size]
  return `${config.width} × ${config.height}`
}
</script>

<style scoped>
.ad-banner-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.ad-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

/* Placeholder shown until real ads are added */
.ad-placeholder {
  width: 100%;
  height: 100%;
  background: #f9fafb;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.placeholder-label {
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.placeholder-size {
  font-size: 9px;
  color: #d1d5db;
}

/* Responsive */
@media (max-width: 768px) {
  .ad-banner-wrapper {
    padding: 0 8px;
  }
}
</style>