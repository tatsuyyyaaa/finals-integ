<template>
  <v-container>
    <v-card class="pa-4" elevation="2">
      <v-card-title>
        <h3 class="text-h6 font-weight-bold">Background Remover</h3>
      </v-card-title>

      <v-card-text>
        <!-- Image Upload -->
        <v-file-input
          v-model="imageFile"
          accept="image/*"
          label="Select image"
          prepend-icon="mdi-camera"
          :loading="loading"
          @change="processImage"
          :rules="[v => !v || v.size < 8000000 || 'Max 8MB image']"
        />

        <!-- Loading Spinner -->
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
          class="my-4"
        />

        <!-- Processed Result Image -->
        <v-img
          v-if="resultImage"
          :src="resultImage"
          max-width="500"
          contain
          class="my-4"
        />

        <!-- Error Message -->
        <v-alert v-if="error" type="error" dismissible>
          {{ error }}
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      imageFile: null,
      resultImage: null,
      loading: false,
      error: null
    }
  },
  methods: {
    async processImage() {
      if (!this.imageFile) return

      this.loading = true
      this.error = null
      this.resultImage = null

      const formData = new FormData()
      formData.append('image_file', this.imageFile)
      formData.append('size', 'auto')

      try {
        const response = await axios.post(
          'https://api.remove.bg/v1.0/removebg',
          formData,
          {
            headers: {
              'X-Api-Key': 'P4At48TEFkGFNsTwKozJF6Q1', // ⚠️ Replace with your own API key
              'Content-Type': 'multipart/form-data'
            },
            responseType: 'blob'
          }
        )

        this.resultImage = URL.createObjectURL(response.data)
      } catch (err) {
        this.error =
          err.response?.data?.errors?.[0]?.title ||
          err.response?.data?.message ||
          err.message
        console.error('[Remove.bg Error]', err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.my-4 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>
