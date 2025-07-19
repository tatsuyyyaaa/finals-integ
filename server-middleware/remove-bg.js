const express = require('express')
const multer = require('multer')
const axios = require('axios')
const FormData = require('form-data')

const upload = multer()
const app = express()

app.post('/', upload.single('image_file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  try {
    const formData = new FormData()
    formData.append('image_file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    })
    formData.append('size', 'auto')

    const response = await axios.post(
      'https://api.remove.bg/v1.0/removebg',
      formData,
      {
        headers: {
          'X-Api-Key': process.env.REMOVE_BG_API_KEY,
          ...formData.getHeaders()
        },
        responseType: 'arraybuffer'
      }
    )

    res.set('Content-Type', 'image/png')
    res.send(response.data)
  } catch (err) {
    console.error('Remove.bg API Error:', err.response?.data || err.message)
    res.status(err.response?.status || 500).json({
      error: err.response?.data?.errors?.[0]?.title || 'Background removal failed'
    })
  }
})

module.exports = app

