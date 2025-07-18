<template>
  <v-container>
    <v-card>
      <v-card-title>Upload Image</v-card-title>
      <v-card-text>
        <!-- File Upload -->
        <v-file-input
          v-model="imageFile"
          accept="image/*"
          label="Select image"
          prepend-icon="mdi-camera"
          @change="processImage"
        ></v-file-input>

        <!-- Preview/Result -->
        <v-img
          v-if="resultImage"
          :src="resultImage"
          max-height="500"
          contain
        ></v-img>

        <!-- Download Button -->
        <v-btn
          v-if="resultImage"
          color="primary"
          @click="downloadImage"
          class="mt-4"
        >
          <v-icon left>mdi-download</v-icon>
          Download Result
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    imageFile: null,
    resultImage: null
  }),
  methods: {
    async processImage(file) {
      if (!file) return;
      
      try {
        this.$nuxt.$loading.start();
        this.resultImage = await this.$bgRemove.process(file);
      } catch (error) {
        this.$toast.error(error.message);
      } finally {
        this.$nuxt.$loading.finish();
      }
    },
    downloadImage() {
      const link = document.createElement('a');
      link.href = this.resultImage;
      link.download = 'background-removed.png';
      link.click();
    }
  }
}
</script>