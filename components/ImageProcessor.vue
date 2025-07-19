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
        const formData = new FormData();
        formData.append('image_file', file);

        const response = await this.$axios.post('/api/remove-bg', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          responseType: 'blob'
        });

        this.result = URL.createObjectURL(response.data);
      } catch (err) {
        this.error = `Failed to remove background: ${err.response?.data?.error || err.message}`;
        console.error('API Error:', err);
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
