<template>
  <v-container fluid class="light-bg py-12">
    <v-card class="mx-auto pa-8 rounded-xl" max-width="840" elevation="6">
      <v-card-title class="justify-center">
        <div class="text-center w-100">
          <v-icon size="40" color="blue darken-2">mdi-image-remove</v-icon>
          <h2 class="font-weight-bold mt-2 mb-1">Background Remover Tool</h2>
          <p class="text-subtitle-2 grey--text">Upload your image and remove the background instantly</p>
        </div>
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
          rounded
          dense
          class="mb-6"
        />

        <!-- Loading Spinner -->
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="blue darken-2"
          class="mb-4"
        />

        <!-- Image Comparison -->
        <v-row v-if="originalImageUrl || resultImage" class="my-6" dense>
          <v-col cols="12" md="6">
            <h4 class="subtitle-1 font-weight-bold mb-2 text-center">Original Image</h4>
            <v-img
              v-if="originalImageUrl"
              :src="originalImageUrl"
              class="rounded-lg elevation-2"
              max-height="300"
              contain
            />
          </v-col>

          <v-col cols="12" md="6">
            <h4 class="subtitle-1 font-weight-bold mb-2 text-center">Background Removed</h4>
            <v-img
              v-if="resultImage"
              :src="resultImage"
              class="rounded-lg elevation-2"
              max-height="300"
              contain
            />
          </v-col>
        </v-row>

        <!-- Action Buttons -->
        <div v-if="resultImage" class="text-center mt-4">
          <v-btn color="blue darken-2" dark class="mx-2" @click="downloadImage">
            <v-icon left>mdi-download</v-icon>
            Download
          </v-btn>
          <v-btn color="grey lighten-1" dark class="mx-2" @click="reset">
            <v-icon left>mdi-refresh</v-icon>
            Try Another
          </v-btn>
        </div>

        <!-- Error Alert -->
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
              'X-Api-Key': 'P4At48TEFkGFNsTwKozJF6Q1',
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
.light-bg {
  background: linear-gradient(to bottom, #f4f7fb, #ffffff);
}

.v-card-title h2 {
  font-family: 'Segoe UI', sans-serif;
}
</style>
