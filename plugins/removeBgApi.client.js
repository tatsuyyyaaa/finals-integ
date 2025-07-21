export default ({ $axios }, inject) => {
  const removeBg = async (imageFile) => {
    const formData = new FormData();
    formData.append('source_image_file', imageFile);
    formData.append('crop', 'true'); // or false if you want full image

    try {
      const response = await $axios.post(
        'https://api.slazzer.com/v2.0/remove_image_background',
        formData,
        {
          headers: {
            'API-KEY': '1c0d6c0a5d2e407e8c5bcfb33019e4e6', // ✅ Slazzer API Key
            'Content-Type': 'multipart/form-data'
          },
          responseType: 'blob'
        }
      );

      return URL.createObjectURL(response.data);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error || error?.message || 'Unknown error';
      throw new Error(`Background removal failed: ${errorMessage}`);
    }
  };

  inject('removeBg', removeBg);
};
