<template>
  <v-container fluid class="light-bg py-12">
    <v-card class="mx-auto pa-10 rounded-2xl elevation-10 shadow-lg" max-width="860">
      <!-- Title -->
      <v-card-title class="justify-center">
        <div class="text-center w-100">
          <v-icon size="48" color="primary">mdi-image-remove</v-icon>
          <h2 class="font-weight-bold mt-3 mb-1 display-1">Remove Background</h2>
          <p class="text-subtitle-1 grey--text">Upload your image and let AI handle the rest</p>
        </div>
      </v-card-title>

      <!-- Body -->
      <v-card-text>
        <!-- Upload Input -->
        <v-file-input
          v-model="imageFile"
          accept="image/*"
          label="Choose an image to upload"
          prepend-icon="mdi-upload"
          :disabled="loading"
          @change="processImage"
          :rules="[v => !v || v.size < 8 * 1024 * 1024 || 'Max 8MB']"
          outlined
          rounded
          dense
          class="mb-8"
        />

        <!-- Progress Indicator -->
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="primary"
          height="6"
          class="mb-6"
        />

        <!-- Image Comparison -->
        <v-row v-if="originalImageUrl || resultImage" class="my-6 d-flex" align="center" justify="center">
          <v-col cols="12" md="6">
            <div class="text-center">
              <h4 class="subtitle-1 font-weight-medium mb-2">Original</h4>
              <v-img
                :src="originalImageUrl"
                class="rounded-xl elevation-3"
                max-height="320"
                contain
              />
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-center">
              <h4 class="subtitle-1 font-weight-medium mb-2">Without Background</h4>
              <v-img
                :src="resultImage"
                class="rounded-xl elevation-3"
                max-height="320"
                contain
              />
            </div>
          </v-col>
        </v-row>

        <!-- Action Buttons -->
        <div v-if="resultImage" class="text-center mt-6">
          <v-btn
            color="primary"
            class="mx-2 px-6 py-3"
            @click="downloadImage"
            :loading="loading"
            elevation="3"
            rounded
          >
            <v-icon left>mdi-download</v-icon>
            Download
          </v-btn>

          <v-btn
            color="grey lighten-1"
            class="mx-2 px-6 py-3"
            @click="reset"
            :disabled="loading"
            elevation="3"
            rounded
          >
            <v-icon left>mdi-refresh</v-icon>
            Try Another
          </v-btn>
        </div>

        <!-- Error Alert -->
        <v-alert v-if="error" type="error" class="mt-6" dismissible>
          {{ error }}
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  middleware: 'auth',

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

      try {
        const base64 = await this.toBase64(file);

        const response = await fetch('https://hf.space/embed/Charon/Background-Removal/+/api/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ data: [base64] })
        });

        const result = await response.json();

        if (result?.data?.[0]) {
          this.resultImage = this.base64ToBlobUrl(result.data[0]);
        } else {
          throw new Error('Background removal failed');
        }
      } catch (err) {
        this.error = err.message || 'An error occurred';
        console.error('[Rembg Error]', err);
      } finally {
        this.loading = false;
      }
    },

    toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },

    base64ToBlobUrl(base64) {
      const byteString = atob(base64.split(',')[1]);
      const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      const blob = new Blob([ab], { type: mimeString });
      return URL.createObjectURL(blob);
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
};
</script>

<style scoped>
.light-bg {
  background: linear-gradient(to bottom right, #f5f9ff, #ffffff);
}
.v-card-title h2 {
  font-family: 'Segoe UI', sans-serif;
}
</style>
