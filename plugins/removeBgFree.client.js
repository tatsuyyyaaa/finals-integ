export default (_, inject) => {
  const removeBgFree = async (imageFile) => {
    const formData = new FormData();
    formData.append('image_file', imageFile);

    try {
      const response = await fetch('https://api-inference.huggingface.co/models/briaai/RMBG-1.4', {
        method: 'POST',
        headers: {
          // ✅ No API key needed for public models
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to remove background');
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error('Free BG Removal Error:', err);
      throw new Error(err.message || 'Unknown error');
    }
  };

  inject('removeBgFree', removeBgFree);
};
