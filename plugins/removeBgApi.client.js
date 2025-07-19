export default ({ $axios }, inject) => {
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
            // ✅ Directly include your API key here
            'X-Api-Key': 'P4At48TEFkGFNsTwKozJF6Q1',
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
