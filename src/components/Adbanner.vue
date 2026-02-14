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
  'leaderboard': { width: 728, height: 90 },
  'rectangle': { width: 300, height: 250 },
  'banner': { width: 468, height: 60 },
  'skyscraper': { width: 160, height: 600 },
  'mobile-banner': { width: 320, height: 50 }
}

const sizeClass = computed(() => `ad-banner-${props.size}`)

const bannerStyle = computed(() => {
  const config = sizeConfig[props.size] || sizeConfig.leaderboard
  return {
    width: '100%',
    maxWidth: `${config.width}px`,
    aspectRatio: `${config.width} / ${config.height}`,
    minHeight: '50px' // Prevent collapse on very small screens
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
  width: 100%;
  padding: 0 16px; /* Add horizontal padding */
  box-sizing: border-box;
}

.ad-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-sizing: border-box;
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
  min-height: 50px; /* Ensure minimum height on mobile */
  box-sizing: border-box;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .ad-banner-wrapper {
    padding: 0 8px; /* Reduce padding on mobile */
  }
  
  /* Make leaderboard ads more compact on mobile */
  .ad-banner-leaderboard .ad-container {
    max-width: 100%;
  }
  
  /* Scale down text on very small screens */
  .placeholder-label {
    font-size: 9px;
  }
  
  .placeholder-size {
    font-size: 8px;
  }
}

@media (max-width: 480px) {
  .ad-banner-wrapper {
    padding: 0 4px; /* Even less padding on very small screens */
  }
  
  /* Further reduce text size */
  .placeholder-label {
    font-size: 8px;
  }
  
  .placeholder-size {
    font-size: 7px;
  }
}

/* Specific size adjustments for better mobile experience */
.ad-banner-skyscraper {
  display: none; /* Hide skyscrapers on mobile - they're too tall */
}

@media (min-width: 1024px) {
  .ad-banner-skyscraper {
    display: flex; /* Show on desktop */
  }
}
</style>