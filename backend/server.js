const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors({
  origin: ['https://playnext-six.vercel.app', 'http://localhost:5173']
}))
app.use(express.json())

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  family: 4
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err))

// Favourite schema
const favouriteSchema = new mongoose.Schema({
  gameId: Number,
  name: String,
  background_image: String,
  rating: Number,
  genres: Array,
})

const Favourite = mongoose.model('Favourite', favouriteSchema)

// Get all favourites
app.get('/api/favourites', async (req, res) => {
  const favourites = await Favourite.find()
  res.json(favourites)
})

// Add a favourite
app.post('/api/favourites', async (req, res) => {
  const existing = await Favourite.findOne({ gameId: req.body.gameId })
  if (existing) return res.json(existing)
  const favourite = new Favourite(req.body)
  await favourite.save()
  res.json(favourite)
})

// Remove a favourite
app.delete('/api/favourites/:gameId', async (req, res) => {
  await Favourite.deleteOne({ gameId: Number(req.params.gameId) })
  res.json({ success: true })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))