const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

app.use((req, res, next) => {
  const allowedOrigins = ['https://playnext-six.vercel.app', 'http://localhost:5173']
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

app.use(express.json())

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  family: 4
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err))

const favouriteSchema = new mongoose.Schema({
  userId: String,
  gameId: Number,
  name: String,
  background_image: String,
  rating: Number,
  genres: Array,
  tags: Array,
})

const Favourite = mongoose.model('Favourite', favouriteSchema)

// Get favourites for a user
app.get('/api/favourites', async (req, res) => {
  const { userId } = req.query
  if (!userId) return res.json([])
  const favourites = await Favourite.find({ userId })
  res.json(favourites)
})

// Add a favourite
app.post('/api/favourites', async (req, res) => {
  const existing = await Favourite.findOne({ userId: req.body.userId, gameId: req.body.gameId })
  if (existing) return res.json(existing)
  const favourite = new Favourite(req.body)
  await favourite.save()
  res.json(favourite)
})

// Remove a favourite
app.delete('/api/favourites/:gameId', async (req, res) => {
  const { userId } = req.query
  await Favourite.deleteOne({ userId, gameId: Number(req.params.gameId) })
  res.json({ success: true })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))