<template>
  <v-container>
    <!-- Auth Check -->
    <v-alert
      v-if="!$auth.loggedIn"
      type="warning"
      class="mb-6 d-flex align-center justify-space-between"
    >
      <div>Please sign in to use the background remover.</div>
      <v-btn color="primary" @click="$auth.loginWith('google')">Sign In</v-btn>
    </v-alert>

    <!-- Main Content -->
    <v-card :disabled="!$auth.loggedIn" class="pa-4" elevation="2">
      <v-card-title>
        <h3 class="text-h6 font-weight-bold">Upload Image</h3>
      </v-card-title>

      <v-card-text>
        <!-- File Upload -->
        <v-file-input
          v-model="imageFile"
          accept="image/*"
          label="Select image"
          prepend-icon="mdi-camera"
          :loading="loading"
          :disabled="!$auth.loggedIn"
          @change="processImage"
          :rules="[v => !v || v.size < 5000000 || 'Image size should be less than 5 MB']"
        ></v-file-input>

        <!-- Progress bar -->
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="primary"
          class="mb-4"
        ></v-progress-linear>

        <!-- Image Comparison -->
        <v-row v-if="imageFile || resultImage" class="my-6">
          <v-col cols="12" md="6">
            <h4 class="mb-2">Original Image</h4>
            <v-img
              v-if="imageFile"
              :src="originalImageUrl"
              max-height="400"
              contain
              class="rounded"
            />
          </v-col>

          <v-col cols="12" md="6">
            <h4 class="mb-2">Result Image (Background Removed)</h4>
            <v-img
              v-if="resultImage"
              :src="resultImage"
              max-height="400"
              contain
              class="rounded"
            />
            <div v-else class="grey--text text-caption mt-4">
              No processed image yet.
            </div>
          </v-col>
        </v-row>

        <!-- Action Buttons -->
        <div class="d-flex flex-wrap gap-2 mt-4">
          <v-btn
            v-if="resultImage"
            color="primary"
            @click="downloadImage"
            :loading="loading"
          >
            <v-icon left>mdi-download</v-icon>
            Download Result
          </v-btn>

          <v-btn
            v-if="resultImage"
            color="secondary"
            @click="reset"
          >
            <v-icon left>mdi-refresh</v-icon>
            Process Another
          </v-btn>
        </div>

        <!-- Error Display -->
        <v-alert
          v-if="error"
          type="error"
          class="mt-4"
        >
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
    resultImage: null,
    originalImageUrl: null,
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
        const formData = new FormData();
        formData.append('image_file', file);

        const result = await this.$axios.post('/remove-bg', formData, {
          headers: {
            Authorization: `Bearer ${this.$auth.token}`,
            'Content-Type': 'multipart/form-data'
          },
          responseType: 'blob'
        });

        this.resultImage = URL.createObjectURL(result.data);
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to remove background';
        console.error('Background removal error:', err);
      } finally {
        this.loading = false;
      }
    },

    downloadImage() {
      const link = document.createElement('a');
      link.href = this.resultImage;
      link.download = `bg-removed-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    reset() {
      this.imageFile = null;
      this.resultImage = null;
      this.originalImageUrl = null;
      this.error = null;
    }
  }
};
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
