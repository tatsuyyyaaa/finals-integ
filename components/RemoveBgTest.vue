<!-- components/RemoveBgTest.vue -->
<template>
  <v-container>
    <v-btn color="primary" @click="removeBg">Remove Background</v-btn>

    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      class="my-4"
    ></v-progress-circular>

    <v-img
      v-if="resultImage"
      :src="resultImage"
      max-width="500"
      contain
      class="my-4"
    ></v-img>

    <v-alert v-if="error" type="error" dismissible>
      {{ error }}
    </v-alert>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      resultImage: null,
      loading: false,
      error: null
    }
  },
  methods: {
    async removeBg() {
      this.loading = true
      this.error = null
      this.resultImage = null

      const formData = new FormData()
      formData.append('image_url', 'https://www.remove.bg/example.jpg') // ✅ test image
      formData.append('size', 'auto')

      try {
        const response = await axios.post(
          'https://api.remove.bg/v1.0/removebg',
          formData,
          {
            headers: {
              'X-Api-Key': 'P4At48TEFkGFNsTwKozJF6Q1',
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
