import React, { useState, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, Cylinder, Environment, TransformControls } from '@react-three/drei'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

// This is a placeholder for the actual API endpoint
const API_ENDPOINT = 'https://api.example.com/generate-3d-model'

function Scene({ modelDetails, scale }) {
  if (!modelDetails) {
    return (
      <Box args={[1, 1, 1]}>
        <meshStandardMaterial color="gray" />
      </Box>
    )
  }

  const { shape, color, size, features } = modelDetails

  const createModel = () => {
    switch (shape) {
      case 'house':
        return (
          <group>
            {/* Main building */}
            <Box args={[2, 2, 2]} position={[0, 1, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            {/* Roof */}
            <Box args={[2.5, 1, 2.5]} position={[0, 2.5, 0]} rotation={[0, Math.PI / 4, 0]}>
              <meshStandardMaterial color="brown" />
            </Box>
            {/* Door */}
            <Box args={[0.5, 1, 0.1]} position={[0, 0.5, 1.01]}>
              <meshStandardMaterial color="darkbrown" />
            </Box>
            {/* Windows */}
            <Box args={[0.3, 0.3, 0.1]} position={[-0.7, 1.2, 1.01]}>
              <meshStandardMaterial color="lightblue" transparent opacity={0.7} />
            </Box>
            <Box args={[0.3, 0.3, 0.1]} position={[0.7, 1.2, 1.01]}>
              <meshStandardMaterial color="lightblue" transparent opacity={0.7} />
            </Box>
          </group>
        )

      case 'car':
        return (
          <group>
            {/* Car body */}
            <Box args={[2, 0.5, 1]} position={[0, 0.5, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            {/* Car top */}
            <Box args={[1.2, 0.4, 0.8]} position={[0, 0.9, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            {/* Wheels */}
            <Cylinder args={[0.3, 0.3, 0.2, 32]} position={[-0.8, 0.3, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="black" />
            </Cylinder>
            <Cylinder args={[0.3, 0.3, 0.2, 32]} position={[0.8, 0.3, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="black" />
            </Cylinder>
            <Cylinder args={[0.3, 0.3, 0.2, 32]} position={[-0.8, 0.3, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="black" />
            </Cylinder>
            <Cylinder args={[0.3, 0.3, 0.2, 32]} position={[0.8, 0.3, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="black" />
            </Cylinder>
          </group>
        )

      case 'tree':
        return (
          <group>
            {/* Trunk */}
            <Cylinder args={[0.2, 0.2, 1.5, 32]} position={[0, 0.75, 0]}>
              <meshStandardMaterial color="brown" />
            </Cylinder>
            {/* Leaves */}
            <Sphere args={[0.8, 32, 32]} position={[0, 2, 0]}>
              <meshStandardMaterial color="green" />
            </Sphere>
          </group>
        )

      case 'sphere':
        return (
          <Sphere args={[size/2, 32, 32]} position={[0, size/2, 0]}>
            <meshStandardMaterial color={color} />
          </Sphere>
        )

      case 'cylinder':
        return (
          <Cylinder args={[size/2, size/2, size, 32]} position={[0, size/2, 0]}>
            <meshStandardMaterial color={color} />
          </Cylinder>
        )

      default:
        return (
          <Box args={[size, size, size]} position={[0, size/2, 0]}>
            <meshStandardMaterial color={color} />
          </Box>
        )
    }
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <TransformControls>
        <group scale={scale}>
          {createModel()}
        </group>
      </TransformControls>
      <OrbitControls />
      <Environment preset="city" />
    </>
  )
}

function App() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [modelDetails, setModelDetails] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [scale, setScale] = useState(1)
  const [showPreview, setShowPreview] = useState(false)
  const canvasRef = useRef(null)

  const analyzeText = (text) => {
    // Convert text to lowercase for easier matching
    const lowerText = text.toLowerCase()
    
    // Extract color
    const colorKeywords = {
      red: 'red',
      blue: 'blue',
      green: 'green',
      yellow: 'yellow',
      purple: 'purple',
      orange: 'orange',
      black: 'black',
      white: 'white',
      gray: 'gray',
      grey: 'gray'
    }
    
    let color = 'gray'
    for (const [keyword, value] of Object.entries(colorKeywords)) {
      if (lowerText.includes(keyword)) {
        color = value
        break
      }
    }

    // Extract shape
    let shape = 'cube'
    if (lowerText.includes('house') || lowerText.includes('building')) {
      shape = 'house'
    } else if (lowerText.includes('car') || lowerText.includes('vehicle')) {
      shape = 'car'
    } else if (lowerText.includes('tree') || lowerText.includes('plant')) {
      shape = 'tree'
    } else if (lowerText.includes('sphere') || lowerText.includes('ball')) {
      shape = 'sphere'
    } else if (lowerText.includes('cylinder') || lowerText.includes('tube')) {
      shape = 'cylinder'
    }

    // Extract size
    let size = 1
    if (lowerText.includes('large') || lowerText.includes('big')) {
      size = 2
    } else if (lowerText.includes('small') || lowerText.includes('tiny')) {
      size = 0.5
    }

    return {
      shape,
      color,
      size,
      features: []
    }
  }

  const handleGenerate = async () => {
    if (!prompt) return
    setIsGenerating(true)
    setShowPreview(false)

    try {
      const details = analyzeText(prompt)
      setModelDetails(details)
      setAnalysis({
        keywords: prompt.toLowerCase().split(' '),
        complexity: prompt.length > 100 ? 'complex' : 'simple',
        type: details.shape
      })
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowPreview(true)
      toast.success('3D model generated successfully!')
    } catch (error) {
      toast.error('Failed to generate 3D model. Please try again.')
      console.error('Error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAccept = () => {
    toast.success('Model accepted!')
    setShowPreview(false)
  }

  const handleRegenerate = () => {
    setShowPreview(false)
    handleGenerate()
  }

  const handleScaleChange = (e) => {
    const newScale = parseFloat(e.target.value)
    setScale(newScale)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>3D Model Generator</h1>
        <p className="subtitle">Transform your ideas into 3D reality</p>
      </header>

      <div className="main-content">
        <div className="input-section">
          <div className="input-container">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the 3D model you want to generate (e.g., 'A red car' or 'A large house with windows')..."
              className="prompt-input"
              rows={4}
            />
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="generate-button"
            >
              {isGenerating ? 'Generating...' : 'Generate Model'}
            </button>
          </div>

          {analysis && (
            <div className="analysis-section">
              <h3>Text Analysis:</h3>
              <div className="analysis-grid">
                <div className="analysis-item">
                  <span className="label">Shape:</span>
                  <span className="value">{analysis.type}</span>
                </div>
                <div className="analysis-item">
                  <span className="label">Complexity:</span>
                  <span className="value">{analysis.complexity}</span>
                </div>
                <div className="analysis-item">
                  <span className="label">Keywords:</span>
                  <span className="value">{analysis.keywords.join(', ')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="viewer-section" ref={canvasRef}>
          <div className="viewer-controls">
            <div className="scale-control">
              <label htmlFor="scale">Model Scale:</label>
              <input
                type="range"
                id="scale"
                min="0.1"
                max="5"
                step="0.1"
                value={scale}
                onChange={handleScaleChange}
              />
              <span className="scale-value">{scale.toFixed(1)}x</span>
            </div>
          </div>
          <Canvas>
            <Suspense fallback={null}>
              <Scene modelDetails={modelDetails} scale={scale} />
            </Suspense>
          </Canvas>
          
          {showPreview && (
            <div className="preview-overlay">
              <div className="preview-content">
                <h3>Preview Generated Model</h3>
                <p>Is this the model you wanted?</p>
                <div className="preview-actions">
                  <button 
                    onClick={handleAccept}
                    className="accept-button"
                  >
                    Accept Model
                  </button>
                  <button 
                    onClick={handleRegenerate}
                    className="regenerate-button"
                  >
                    Generate New Model
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="app-footer">
        <p>Use your mouse to rotate and zoom the 3D model</p>
      </footer>

      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default App 