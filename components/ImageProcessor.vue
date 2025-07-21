<template>
  <v-container>
    <!-- Upload -->
    <v-file-input
      accept="image/*"
      label="Select image"
      prepend-icon="mdi-camera"
      @change="processImage"
      :loading="loading"
      :disabled="loading"
    ></v-file-input>

    <!-- Loading Spinner -->
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="my-4"
    ></v-progress-circular>

    <!-- Result Image -->
    <v-img
      v-if="result"
      :src="result"
      max-width="500"
      contain
      class="my-4"
    ></v-img>

    <!-- Action Buttons -->
    <div v-if="result" class="d-flex flex-wrap gap-2 mb-4">
      <v-btn color="primary" @click="downloadImage">
        <v-icon left>mdi-download</v-icon>
        Download Result
      </v-btn>
      <v-btn color="secondary" @click="reset">
        <v-icon left>mdi-refresh</v-icon>
        Process Another
      </v-btn>
    </div>

    <!-- Error Alert -->
    <v-alert
      v-if="error"
      type="error"
      dismissible
    >
      {{ error }}
    </v-alert>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    result: null,
    loading: false,
    error: null
  }),

  methods: {
    async processImage(file) {
      if (!file) return;

      this.loading = true;
      this.error = null;

      try {
        const base64 = await this.toBase64(file)

        const response = await fetch('https://hf.space/embed/Charon/Background-Removal/+/api/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: [base64]
          })
        })

        const result = await response.json()

        if (result?.data?.[0]) {
          this.result = this.base64ToBlobUrl(result.data[0])
        } else {
          throw new Error('Failed to remove background from image.')
        }
      } catch (err) {
        this.error = err.message || 'An error occurred'
        console.error('Free BG Remover Error:', err)
      } finally {
        this.loading = false
      }
    },

    toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    },

    base64ToBlobUrl(base64) {
      const byteString = atob(base64.split(',')[1])
      const mimeString = base64.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i)
      const blob = new Blob([ab], { type: mimeString })
      return URL.createObjectURL(blob)
    },

    downloadImage() {
      const link = document.createElement('a')
      link.href = this.result
      link.download = `bg-removed-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    reset() {
      this.result = null
      this.error = null
    }
  }
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
