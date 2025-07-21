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

      const formData = new FormData();
      formData.append('source_image_file', file);
      formData.append('crop', 'true'); // Optional: adjust or remove if you want full image

      try {
        const response = await fetch('https://api.slazzer.com/v2.0/remove_image_background', {
          method: 'POST',
          headers: {
            'API-KEY': '1c0d6c0a5d2e407e8c5bcfb33019e4e6'
          },
          body: formData
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to remove background');
        }

        const blob = await response.blob();
        this.result = URL.createObjectURL(blob);
      } catch (err) {
        this.error = err.message || 'An error occurred';
        console.error('Slazzer Error:', err);
      } finally {
        this.loading = false;
      }
    },

    downloadImage() {
      const link = document.createElement('a');
      link.href = this.result;
      link.download = `bg-removed-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    reset() {
      this.result = null;
      this.error = null;
    }
  }
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
