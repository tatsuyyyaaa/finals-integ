<template>
  <v-container class="py-12">
    <v-card class="mx-auto pa-6" max-width="800" elevation="4">
      <v-card-title class="headline font-weight-bold justify-center">
        Background Remover Tool
      </v-card-title>

      <v-card-text>
        <!-- Image Upload -->
        <v-file-input
          v-model="imageFile"
          accept="image/*"
          label="Upload an image"
          prepend-icon="mdi-upload"
          :disabled="loading"
          @change="processImage"
          :rules="[v => !v || v.size < 8 * 1024 * 1024 || 'Max 8MB']"
          outlined
          dense
        />

        <!-- Loading Spinner -->
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="primary"
          class="mb-4"
        />

        <!-- Image Preview -->
        <v-row v-if="originalImageUrl || resultImage" class="my-6" dense>
          <v-col cols="12" md="6">
            <h4 class="subtitle-1 font-weight-bold mb-2 text-center">Original</h4>
            <v-img
              v-if="originalImageUrl"
              :src="originalImageUrl"
              class="rounded-lg"
              max-height="300"
              contain
            />
          </v-col>

          <v-col cols="12" md="6">
            <h4 class="subtitle-1 font-weight-bold mb-2 text-center">No Background</h4>
            <v-img
              v-if="resultImage"
              :src="resultImage"
              class="rounded-lg"
              max-height="300"
              contain
            />
          </v-col>
        </v-row>

        <!-- Actions -->
        <div v-if="resultImage" class="text-center mt-4">
          <v-btn color="primary" class="mx-2" @click="downloadImage">
            <v-icon left>mdi-download</v-icon>
            Download
          </v-btn>
          <v-btn color="secondary" class="mx-2" @click="reset">
            <v-icon left>mdi-refresh</v-icon>
            Try Another
          </v-btn>
        </div>

        <!-- Error Message -->
        <v-alert v-if="error" type="error" class="mt-4" dismissible>
          {{ error }}
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    imageFile: null,
    originalImageUrl: null,
    resultImage: null,
    loading: false,
    error: null
  }),

  methods: {
    async processImage(file) {
      if (!file) return;

      this.loading = true;
      this.error = null;
      this.originalImageUrl = URL.createObjectURL(file);

      const formData = new FormData();
      formData.append('image_file', file);
      formData.append('size', 'auto');

      try {
        const response = await axios.post(
          'https://api.remove.bg/v1.0/removebg',
          formData,
          {
            headers: {
              'X-Api-Key': 'P4At48TEFkGFNsTwKozJF6Q1', // Replace with your working API key
              'Content-Type': 'multipart/form-data'
            },
            responseType: 'blob'
          }
        );

        this.resultImage = URL.createObjectURL(response.data);
      } catch (err) {
        this.error =
          err.response?.data?.errors?.[0]?.title ||
          err.response?.data?.message ||
          err.message;
        console.error('[Remove.bg Error]', err);
      } finally {
        this.loading = false;
      }
    },

    downloadImage() {
      const link = document.createElement('a');
      link.href = this.resultImage;
      link.download = `no-bg-${Date.now()}.png`;
      link.click();
    },

    reset() {
      this.imageFile = null;
      this.originalImageUrl = null;
      this.resultImage = null;
      this.error = null;
    }
  }
}
</script>

<style scoped>
.v-card-title {
  font-family: 'Segoe UI', sans-serif;
}
</style>
