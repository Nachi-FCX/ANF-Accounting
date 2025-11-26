<template>
  <div class="invoice-pdf-viewer">
  

    <div class="pdf-content" ref="contentRef" @mousedown="handlePanStart">
      <div 
        class="pdf-canvas-container"
        :style="{
          transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
          transformOrigin: 'top left'
        }"
      >
        <!-- For PDF files -->
        <iframe
          v-if="document && document.url && isPdfFile"
          :src="document.url"
          class="pdf-iframe"
          @load="handleImageLoad"
        />
        
        <!-- For image files -->
        <img
          v-else-if="document && document.url"
          :src="document.url"
          :alt="document.name"
          class="pdf-image"
          @load="handleImageLoad"
          @mousedown.prevent="handleTextSelection"
        />
        
        <!-- OCR Highlights -->
        <div
          v-if="ocrResults && showOcrHighlights"
          class="ocr-highlights"
        >
          <div
            v-for="(result, index) in ocrResults.ocr_results"
            :key="index"
            class="ocr-highlight"
            :style="getHighlightStyle(result)"
            :title="result.text"
            @click="handleHighlightClick(result)"
          />
        </div>
      </div>
    </div>

    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { FcxButton } from '@/components/buttoncomponents'
import { FcxCheckbox } from '@/components/formcomponents'
import type { PdfDocument } from '../types/invoice-pdf.types'

// Props
const props = defineProps<{
  document: PdfDocument
  ocrResults?: any
}>()

// Emits
const emit = defineEmits<{
  textSelected: [text: string]
  fieldMapped: [data: { field: string; value: string }]
}>()

// Refs
const contentRef = ref<HTMLElement>()
const zoom = ref(1)
const currentPage = ref(1)
const totalPages = ref(1)
const panX = ref(0)
const panY = ref(0)
const isPanning = ref(false)
const startPanX = ref(0)
const startPanY = ref(0)
const showOcrHighlights = ref(true)
const selectedText = ref('')

// Computed
const isPdfFile = computed(() => {
  if (!props.document || !props.document.name) return false
  return props.document.name.toLowerCase().endsWith('.pdf')
})

// Methods
const zoomIn = () => {
  if (zoom.value < 2) {
    zoom.value = Math.min(2, zoom.value + 0.25)
  }
}

const zoomOut = () => {
  if (zoom.value > 0.5) {
    zoom.value = Math.max(0.5, zoom.value - 0.25)
  }
}

const resetZoom = () => {
  zoom.value = 1
  panX.value = 0
  panY.value = 0
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const handleImageLoad = (event: Event) => {
  const target = event.target as HTMLImageElement | HTMLIFrameElement
  
  // Check if it's an image element (not iframe for PDF)
  if ('naturalWidth' in target && 'naturalHeight' in target) {
    console.log('Image loaded:', target.naturalWidth, 'x', target.naturalHeight)
  } else {
    console.log('PDF loaded successfully')
  }
}

const handlePanStart = (event: MouseEvent) => {
  if (event.button === 1 || (event.button === 0 && event.ctrlKey)) {
    // Middle mouse button or Ctrl+Left click for panning
    isPanning.value = true
    startPanX.value = event.clientX - panX.value
    startPanY.value = event.clientY - panY.value
    event.preventDefault()
  }
}

const handlePanMove = (event: MouseEvent) => {
  if (isPanning.value) {
    panX.value = event.clientX - startPanX.value
    panY.value = event.clientY - startPanY.value
  }
}

const handlePanEnd = () => {
  isPanning.value = false
}

const handleTextSelection = (event: MouseEvent) => {
  // Placeholder for text selection functionality
  const selection = window.getSelection()
  if (selection && selection.toString()) {
    selectedText.value = selection.toString()
    emit('textSelected', selectedText.value)
  }
}

const handleHighlightClick = (result: any) => {
  console.log('Highlight clicked:', result)
  selectedText.value = result.text
  emit('textSelected', result.text)
}

const getHighlightStyle = (result: any): Record<string, string> => {
  if (!result.bbox) return {}
  
  return {
    position: 'absolute',
    left: `${result.bbox.x}px`,
    top: `${result.bbox.y}px`,
    width: `${result.bbox.width}px`,
    height: `${result.bbox.height}px`,
    backgroundColor: 'rgba(255, 255, 0, 0.3)',
    border: '1px solid rgba(255, 255, 0, 0.6)',
    cursor: 'pointer',
    pointerEvents: 'auto'
  }
}

const downloadDocument = () => {
  if (props.document && props.document.url) {
    const link = document.createElement('a')
    link.href = props.document.url
    link.download = props.document.name
    link.click()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('mousemove', handlePanMove)
  document.addEventListener('mouseup', handlePanEnd)
  
  // Initialize page count
  if (props.document) {
    totalPages.value = props.document.pages || 1
    currentPage.value = props.document.currentPage || 1
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handlePanMove)
  document.removeEventListener('mouseup', handlePanEnd)
})
</script>

<style scoped lang="scss">
.invoice-pdf-viewer {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--surface-ground);
}

.pdf-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
  gap: 0.75rem;

  .toolbar-left,
  .toolbar-center,
  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .zoom-level,
  .page-info {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--text-color);
    min-width: 50px;
    text-align: center;
  }
}

.pdf-content {
  flex: 1;
  overflow: auto;
  position: relative;
  background: #f0f0f0;
  display: flex;
  flex-direction: column;

  &:active {
    cursor: grabbing;
  }
}

.pdf-canvas-container {
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.pdf-iframe {
  width: 100%;
  flex: 1;
  min-height: calc(100vh - 200px);
  border: none;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pdf-image {
  display: block;
  max-width: 100%;
  height: auto;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  user-select: text;
}

.ocr-highlights {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.ocr-highlight {
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 0, 0.5) !important;
    border-color: rgba(255, 255, 0, 0.8) !important;
  }
}

.pdf-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--surface-card);
  border-top: 1px solid var(--surface-border);

  .confidence-info {
    font-size: 0.875rem;
    color: var(--text-color-secondary);
    font-weight: 500;
  }
}
</style>
