<template>
  <v-container>
    <!-- Auth Check -->
    <v-alert
      v-if="!$auth.loggedIn"
      type="warning"
      class="mb-6"
    >
      Please sign in to use the background remover.
    </v-alert>

    <!-- Main Content -->
    <v-card :disabled="!$auth.loggedIn">
      <v-card-title class="d-flex justify-space-between">
        <span>Upload Image</span>
        <v-btn
          v-if="$auth.loggedIn"
          color="red"
          text
          @click="$auth.logout()"
        >
          Sign Out
        </v-btn>
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

        <!-- Preview/Result -->
        <v-img
          v-if="resultImage"
          :src="resultImage"
          max-height="500"
          contain
          class="mb-4"
        ></v-img>

        <!-- Action Buttons -->
        <div class="d-flex flex-wrap gap-2">
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
    loading: false,
    error: null
  }),

  methods: {
    async processImage(file) {
      if (!file) return;
      
      this.loading = true;
      this.error = null;
      
      try {
        // Use remove.bg API via your plugin
        const formData = new FormData();
        formData.append('image_file', file);
        
        const result = await this.$axios.post('/remove-bg', formData, {
          headers: {
            'Authorization': `Bearer ${this.$auth.token}`,
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