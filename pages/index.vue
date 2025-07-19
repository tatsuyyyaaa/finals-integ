<template>
  <v-container>
    <v-card class="pa-4" elevation="2">
      <v-card-title>
        <h3 class="text-h6 font-weight-bold">Upload Image</h3>
      </v-card-title>

      <v-card-text>
        <v-file-input
          v-model="imageFile"
          accept="image/*"
          label="Select image"
          prepend-icon="mdi-camera"
          :loading="loading"
          @change="processImage"
          :rules="[v => !v || v.size < 8000000 || 'Image size should be less than 8 MB']"
        ></v-file-input>

        <v-progress-linear
          v-if="loading"
          indeterminate
          color="primary"
          class="mb-4"
        />

        <v-row v-if="imageFile || resultImage" class="my-6">
          <v-col cols="12" md="6">
            <h4 class="mb-2">Original Image</h4>
            <v-img
              v-if="originalImageUrl"
              :src="originalImageUrl"
              max-height="400"
              contain
              class="rounded"
            />
          </v-col>

          <v-col cols="12" md="6">
            <h4 class="mb-2">Background Removed</h4>
            <v-img
              v-if="resultImage"
              :src="resultImage"
              max-height="400"
              contain
              class="rounded"
            />
          </v-col>
        </v-row>

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
        this.resultImage = await this.$removeBg(file); // 🔥 uses your plugin
      } catch (err) {
        this.error = err.message || 'Failed to remove background';
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
