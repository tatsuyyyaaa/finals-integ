<template>
  <div>
    <v-file-input
      accept="image/*"
      label="Select image"
      prepend-icon="mdi-camera"
      @change="processImage"
    ></v-file-input>
    
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-circular>
    
    <v-img
      v-if="result"
      :src="result"
      max-width="500"
      contain
    ></v-img>
    
    <v-alert
      v-if="error"
      type="error"
      dismissible
    >
      {{ error }}
    </v-alert>
  </div>
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
        formData.append('size', 'auto'); // 'auto', 'preview', or 'full'
        
        const { data } = await this.$axios.post(
          'https://api.remove.bg/v1.0/removebg',
          formData,
          {
            headers: {
              'X-Api-Key': this.$config.removeBgApiKey,
              'Content-Type': 'multipart/form-data'
            },
            responseType: 'blob'
          }
        );
        
        this.result = URL.createObjectURL(data);
      } catch (err) {
        this.error = `Failed to remove background: ${err.response?.data?.errors?.[0]?.title || err.message}`;
        console.error('API Error:', err);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>