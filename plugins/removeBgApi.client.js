export default ({ $axios, $config }, inject) => {
  const removeBg = async (imageFile) => {
    const formData = new FormData()
    formData.append('image_file', imageFile)
    formData.append('size', 'auto')

    try {
      const { data } = await $axios.post(
        'https://api.remove.bg/v1.0/removebg',
        formData,
        {
          headers: {
            'X-Api-Key': $config.removeBgApiKey,
            'Content-Type': 'multipart/form-data'
          },
          responseType: 'blob'
        }
      )
      return URL.createObjectURL(data)
    } catch (error) {
      console.error('API Error:', error)
      throw new Error('Background removal failed. Please try another image.')
    }
  }

  inject('removeBg', removeBg)
}