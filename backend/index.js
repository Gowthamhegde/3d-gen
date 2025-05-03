require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const use = require('@tensorflow-models/universal-sentence-encoder')
const tf = require('@tensorflow/tfjs-node')

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB')
}).catch((err) => {
  console.error('MongoDB connection error:', err)
})

// 3D Model schema
const modelSchema = new mongoose.Schema({
  name: String,
  description: String,
  tags: [String],
  filePath: String,
  embedding: { type: [Number], default: [] }
})

const Model = mongoose.model('Model', modelSchema)

let modelUSE = null

// Load Universal Sentence Encoder model on startup
async function loadUSEModel() {
  modelUSE = await use.load()
  console.log('Universal Sentence Encoder model loaded')
  await precomputeModelEmbeddings()
}

// Precompute embeddings for all models in the database
async function precomputeModelEmbeddings() {
  const models = await Model.find()
  for (const m of models) {
    if (!m.embedding || m.embedding.length === 0) {
      const sentences = [m.description || m.name || '']
      const embeddings = await modelUSE.embed(sentences)
      const embeddingArray = embeddings.arraySync()[0]
      m.embedding = embeddingArray
      await m.save()
    }
  }
  console.log('Precomputed embeddings for all models')
}

// Compute cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0)
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))
  if (magnitudeA === 0 || magnitudeB === 0) return 0
  return dotProduct / (magnitudeA * magnitudeB)
}

// API endpoint to get best matching 3D model for a prompt using ML embeddings
app.post('/api/generate-model', async (req, res) => {
  const { prompt } = req.body
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' })
  }

  try {
    if (!modelUSE) {
      return res.status(503).json({ error: 'Model not loaded yet' })
    }

    const promptEmbeddingTensor = await modelUSE.embed([prompt])
    const promptEmbedding = promptEmbeddingTensor.arraySync()[0]

    const models = await Model.find()
    if (models.length === 0) {
      return res.status(404).json({ error: 'No models found in database' })
    }

    let bestModel = null
    let bestScore = -1
    for (const model of models) {
      if (!model.embedding || model.embedding.length === 0) continue
      const score = cosineSimilarity(promptEmbedding, model.embedding)
      if (score > bestScore) {
        bestScore = score
        bestModel = model
      }
    }

    if (!bestModel) {
      return res.status(404).json({ error: 'No matching model found' })
    }

    res.json({
      model: {
        id: bestModel._id,
        name: bestModel.name,
        filePath: bestModel.filePath,
        description: bestModel.description
      }
    })
  } catch (error) {
    console.error('Error in /api/generate-model:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  loadUSEModel()
})
