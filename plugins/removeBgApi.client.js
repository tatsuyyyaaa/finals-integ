export default ({ $axios, $config }, inject) => {
  const removeBg = async (imageFile) => {
    const formData = new FormData();
    formData.append('image_file', imageFile);
    formData.append('size', 'auto');

    try {
      const response = await $axios.post(
        'https://api.remove.bg/v1.0/removebg',
        formData,
        {
          headers: {
            'X-Api-Key': $config.removeBgApiKey,
            'Content-Type': 'multipart/form-data'
          },
          responseType: 'blob'
        }
      );

      return URL.createObjectURL(response.data);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.title ||
        error?.response?.data?.message ||
        error?.message ||
        'Unknown error';

      throw new Error(`Background removal failed: ${errorMessage}`);
    }
  };

  inject('removeBg', removeBg);
};
