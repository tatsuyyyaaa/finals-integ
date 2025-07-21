export default (context, inject) => {
  const { $config } = context

  const removeBg = async (file) => {
    const formData = new FormData()
    formData.append('image_file', file)
    formData.append('size', 'auto')

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': $config.removeBgApiKey
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      const message = errorData?.errors?.[0]?.title || 'Unknown error'
      throw new Error(message)
    }

    const blob = await response.blob()
    return URL.createObjectURL(blob)
  }

  inject('removeBg', removeBg)
}
