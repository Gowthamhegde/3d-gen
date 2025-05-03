import React, { useState, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, Cylinder, Environment, TransformControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { ToastContainer, toast } from 'react-toastify'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

// This is a placeholder for the actual API endpoint
const API_ENDPOINT = 'https://api.example.com/generate-3d-model'

function GLTFModel({ modelPath, scale }) {
  const { scene } = useGLTF(modelPath)
  const ref = useRef()

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5
    }
  })

  return <primitive ref={ref} object={scene} scale={scale} />
}

function Scene({ modelDetails, scale, lightIntensity, materialPreset, sceneRef, gltfModelPath }) {
  const groupRef = useRef()
  
  // Create texture loaders with enhanced settings
  const textureLoader = new THREE.TextureLoader()
  textureLoader.crossOrigin = 'anonymous'
  
  // Add environment map for realistic reflections
  const envMap = new THREE.CubeTextureLoader().load([
    'https://threejs.org/examples/textures/cube/pisa/px.png',
    'https://threejs.org/examples/textures/cube/pisa/nx.png',
    'https://threejs.org/examples/textures/cube/pisa/py.png',
    'https://threejs.org/examples/textures/cube/pisa/ny.png',
    'https://threejs.org/examples/textures/cube/pisa/pz.png',
    'https://threejs.org/examples/textures/cube/pisa/nz.png'
  ])
  envMap.encoding = THREE.sRGBEncoding
  
  // Load common textures
  const woodTexture = textureLoader.load('https://threejs.org/examples/textures/hardwood2_diffuse.jpg')
  const woodNormalMap = textureLoader.load('https://threejs.org/examples/textures/hardwood2_normal.jpg')
  const woodRoughnessMap = textureLoader.load('https://threejs.org/examples/textures/hardwood2_roughness.jpg')
  const woodAOMap = textureLoader.load('https://threejs.org/examples/textures/hardwood2_ao.jpg')
  
  const metalTexture = textureLoader.load('https://threejs.org/examples/textures/metal_diffuse.jpg')
  const metalNormalMap = textureLoader.load('https://threejs.org/examples/textures/metal_normal.jpg')
  const metalRoughnessMap = textureLoader.load('https://threejs.org/examples/textures/metal_roughness.jpg')
  const metalAOMap = textureLoader.load('https://threejs.org/examples/textures/metal_ao.jpg')
  
  const stoneTexture = textureLoader.load('https://threejs.org/examples/textures/brick_diffuse.jpg')
  const stoneNormalMap = textureLoader.load('https://threejs.org/examples/textures/brick_normal.jpg')
  const stoneRoughnessMap = textureLoader.load('https://threejs.org/examples/textures/brick_roughness.jpg')
  const stoneAOMap = textureLoader.load('https://threejs.org/examples/textures/brick_ao.jpg')
  
  const leatherTexture = textureLoader.load('https://threejs.org/examples/textures/leather_diffuse.jpg')
  const leatherNormalMap = textureLoader.load('https://threejs.org/examples/textures/leather_normal.jpg')
  const leatherRoughnessMap = textureLoader.load('https://threejs.org/examples/textures/leather_roughness.jpg')
  const leatherAOMap = textureLoader.load('https://threejs.org/examples/textures/leather_ao.jpg')
  
  const fabricTexture = textureLoader.load('https://threejs.org/examples/textures/fabric_diffuse.jpg')
  const fabricNormalMap = textureLoader.load('https://threejs.org/examples/textures/fabric_normal.jpg')
  const fabricRoughnessMap = textureLoader.load('https://threejs.org/examples/textures/fabric_roughness.jpg')
  const fabricAOMap = textureLoader.load('https://threejs.org/examples/textures/fabric_ao.jpg')

  useFrame((state, delta) => {
    if (!groupRef.current || !modelDetails) return

    switch (modelDetails.animation) {
      case 'rotate':
        groupRef.current.rotation.y += delta * 0.5
        break
      case 'bounce':
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.3
        break
      case 'float':
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2 + 0.2
        groupRef.current.rotation.y += delta * 0.2
        break
    }
  })

  if (gltfModelPath) {
    return <GLTFModel modelPath={gltfModelPath} scale={scale} />
  }

  if (!modelDetails) {
    return (
      <group>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <Box args={[1, 1, 1]} castShadow receiveShadow>
          <meshPhysicalMaterial 
            color="gray"
            metalness={0.5}
            roughness={0.5}
            clearcoat={0.5}
            clearcoatRoughness={0.3}
            envMap={envMap}
            envMapIntensity={1}
          />
        </Box>
        <Environment preset={materialPreset} background blur={0.5} />
      </group>
    )
  }

  const { shape, color, size, features, metalness = 0.5, roughness = 0.5, animation = 'none' } = modelDetails

  const createModel = () => {
    switch (shape) {
      case 'house':
        return (
          <group ref={sceneRef}>
            {/* Main building */}
            <Box args={[2, 2, 2]} position={[0, 1, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial 
                map={stoneTexture}
                normalMap={stoneNormalMap}
                roughnessMap={stoneRoughnessMap}
                aoMap={stoneAOMap}
                normalScale={[0.5, 0.5]}
                metalness={0.2}
                roughness={0.8}
                clearcoat={0.5}
                clearcoatRoughness={0.3}
                envMapIntensity={1}
                aoMapIntensity={1.0}
              />
            </Box>
            {/* Roof */}
            <Box args={[2.5, 1, 2.5]} position={[0, 2.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <meshPhysicalMaterial 
                map={woodTexture}
                normalMap={woodNormalMap}
                roughnessMap={woodRoughnessMap}
                aoMap={woodAOMap}
                normalScale={[0.3, 0.3]}
                metalness={0.1}
                roughness={0.9}
                clearcoat={0.3}
                envMapIntensity={0.8}
                aoMapIntensity={0.8}
              />
            </Box>
            {/* Door */}
            <Box args={[0.5, 1, 0.1]} position={[0, 0.5, 1.01]} castShadow>
              <meshPhysicalMaterial 
                color="#4a3728"
                metalness={0.3}
                roughness={0.7}
                clearcoat={0.8}
              />
            </Box>
            {/* Windows */}
            <Box args={[0.3, 0.3, 0.1]} position={[-0.7, 1.2, 1.01]}>
              <meshPhysicalMaterial 
                color="#a7c5eb"
                metalness={0.9}
                roughness={0.1}
                transmission={0.6}
                thickness={0.5}
              />
            </Box>
            <Box args={[0.3, 0.3, 0.1]} position={[0.7, 1.2, 1.01]}>
              <meshPhysicalMaterial 
                color="#a7c5eb"
                metalness={0.9}
                roughness={0.1}
                transmission={0.6}
                thickness={0.5}
              />
            </Box>
          </group>
        )

      case 'car':
        return (
          <group ref={sceneRef}>
            {/* Car body */}
            <Box args={[2, 0.5, 1]} position={[0, 0.5, 0]} castShadow>
              <meshPhysicalMaterial 
                map={metalTexture}
                normalMap={metalNormalMap}
                roughnessMap={metalRoughnessMap}
                aoMap={metalAOMap}
                normalScale={[0.6, 0.6]}
                metalness={0.9}
                roughness={0.1}
                clearcoat={1}
                clearcoatRoughness={0.1}
                reflectivity={1}
                envMapIntensity={1.5}
                aoMapIntensity={0.5}
              />
            </Box>
            {/* Car top */}
            <Box args={[1.2, 0.4, 0.8]} position={[0, 0.9, 0]} castShadow>
              <meshPhysicalMaterial 
                map={metalTexture}
                normalMap={metalNormalMap}
                roughnessMap={metalRoughnessMap}
                aoMap={metalAOMap}
                normalScale={[0.6, 0.6]}
                metalness={0.9}
                roughness={0.1}
                clearcoat={1}
                clearcoatRoughness={0.1}
                reflectivity={1}
                envMapIntensity={1.5}
                aoMapIntensity={0.5}
              />
            </Box>
            {/* Wheels */}
            <Cylinder args={[0.3, 0.3, 0.2, 32]} position={[-0.8, 0.3, 0.6]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <meshPhysicalMaterial 
                color="#1a1a1a"
                metalness={0.9}
                roughness={0.4}
                clearcoat={0.5}
              />
            </Cylinder>
            <Cylinder args={[0.3, 0.3, 0.2, 32]} position={[0.8, 0.3, 0.6]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <meshPhysicalMaterial 
                color="#1a1a1a"
                metalness={0.9}
                roughness={0.4}
                clearcoat={0.5}
              />
            </Cylinder>
            <Cylinder args={[0.3, 0.3, 0.2, 32]} position={[-0.8, 0.3, -0.6]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <meshPhysicalMaterial 
                color="#1a1a1a"
                metalness={0.9}
                roughness={0.4}
                clearcoat={0.5}
              />
            </Cylinder>
            <Cylinder args={[0.3, 0.3, 0.2, 32]} position={[0.8, 0.3, -0.6]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <meshPhysicalMaterial 
                color="#1a1a1a"
                metalness={0.9}
                roughness={0.4}
                clearcoat={0.5}
              />
            </Cylinder>
          </group>
        )

      case 'robot':
        return (
          <group ref={sceneRef}>
            {/* Body */}
            <Box args={[1.2, 1.5, 0.8]} position={[0, 1.5, 0]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.9}
                roughness={0.2}
                clearcoat={1}
                clearcoatRoughness={0.1}
                reflectivity={1}
              />
            </Box>
            {/* Head */}
            <Box args={[0.8, 0.8, 0.8]} position={[0, 2.7, 0]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.9}
                roughness={0.2}
                clearcoat={1}
                clearcoatRoughness={0.1}
                reflectivity={1}
              />
            </Box>
            {/* Eyes */}
            <Box args={[0.2, 0.1, 0.1]} position={[-0.2, 2.8, 0.4]}>
              <meshPhysicalMaterial 
                color="#00ffff"
                emissive="#00ffff"
                emissiveIntensity={5}
                transmission={0.5}
                thickness={0.5}
              />
            </Box>
            <Box args={[0.2, 0.1, 0.1]} position={[0.2, 2.8, 0.4]}>
              <meshPhysicalMaterial 
                color="#00ffff"
                emissive="#00ffff"
                emissiveIntensity={5}
                transmission={0.5}
                thickness={0.5}
              />
            </Box>
            {/* Arms */}
            <Box args={[0.3, 1, 0.3]} position={[-0.75, 1.5, 0]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.9}
                roughness={0.3}
                clearcoat={0.8}
              />
            </Box>
            <Box args={[0.3, 1, 0.3]} position={[0.75, 1.5, 0]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.9}
                roughness={0.3}
                clearcoat={0.8}
              />
            </Box>
            {/* Legs */}
            <Box args={[0.4, 1.2, 0.4]} position={[-0.4, 0.6, 0]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.9}
                roughness={0.3}
                clearcoat={0.8}
              />
            </Box>
            <Box args={[0.4, 1.2, 0.4]} position={[0.4, 0.6, 0]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.9}
                roughness={0.3}
                clearcoat={0.8}
              />
            </Box>
          </group>
        )

      case 'spaceship':
        return (
          <group ref={sceneRef}>
            {/* Main body */}
            <Box args={[3, 0.8, 1.5]} position={[0, 1, 0]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.9}
                roughness={0.1}
                clearcoat={1}
                reflectivity={1}
              />
            </Box>
            {/* Cockpit */}
            <Sphere args={[0.6]} position={[1.2, 1.2, 0]} castShadow>
              <meshPhysicalMaterial 
                color="#a7c5eb"
                metalness={0.2}
                roughness={0.1}
                transmission={0.8}
                thickness={0.5}
              />
            </Sphere>
            {/* Wings */}
            <Box args={[1, 0.1, 2.5]} position={[0, 0.8, 0]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.9}
                roughness={0.1}
                clearcoat={1}
              />
            </Box>
            {/* Engines */}
            <Cylinder args={[0.3, 0.3, 0.8, 32]} position={[-1.2, 0.8, -0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <meshPhysicalMaterial 
                color="#ff4400"
                emissive="#ff4400"
                emissiveIntensity={2}
                metalness={0.9}
                roughness={0.1}
              />
            </Cylinder>
            <Cylinder args={[0.3, 0.3, 0.8, 32]} position={[-1.2, 0.8, 0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <meshPhysicalMaterial 
                color="#ff4400"
                emissive="#ff4400"
                emissiveIntensity={2}
                metalness={0.9}
                roughness={0.1}
              />
            </Cylinder>
          </group>
        )

      case 'tree':
        return (
          <group ref={sceneRef}>
            {/* Trunk */}
            <Cylinder args={[0.3, 0.4, 2, 8]} position={[0, 1, 0]} castShadow>
              <meshPhysicalMaterial 
                color="#8B4513"
                metalness={0.2}
                roughness={0.8}
              />
            </Cylinder>
            {/* Leaves */}
            <Sphere args={[1.2]} position={[0, 2.5, 0]} castShadow>
              <meshPhysicalMaterial 
                color="#228B22"
                metalness={0.1}
                roughness={0.9}
                clearcoat={0.3}
              />
            </Sphere>
            <Sphere args={[0.9]} position={[0.8, 2.2, 0.8]} castShadow>
              <meshPhysicalMaterial 
                color="#228B22"
                metalness={0.1}
                roughness={0.9}
                clearcoat={0.3}
              />
            </Sphere>
            <Sphere args={[0.9]} position={[-0.8, 2.2, -0.8]} castShadow>
              <meshPhysicalMaterial 
                color="#228B22"
                metalness={0.1}
                roughness={0.9}
                clearcoat={0.3}
              />
            </Sphere>
          </group>
        )

      case 'lamp':
        return (
          <group ref={sceneRef}>
            {/* Base */}
            <Cylinder args={[0.5, 0.7, 0.2, 32]} position={[0, 0.1, 0]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.9}
                roughness={0.1}
                clearcoat={1}
              />
            </Cylinder>
            {/* Stand */}
            <Cylinder args={[0.1, 0.1, 2, 32]} position={[0, 1.1, 0]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.9}
                roughness={0.1}
                clearcoat={1}
              />
            </Cylinder>
            {/* Lampshade */}
            <Cylinder args={[0.4, 0.8, 0.6, 32]} position={[0, 2.1, 0]} castShadow>
              <meshPhysicalMaterial 
                color="#ffffff"
                metalness={0.1}
                roughness={0.1}
                transmission={0.5}
                thickness={0.5}
                emissive="#ffffff"
                emissiveIntensity={1}
              />
            </Cylinder>
          </group>
        )

      case 'castle':
        return (
          <group ref={sceneRef}>
            {/* Main building */}
            <Box args={[4, 3, 4]} position={[0, 1.5, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.4}
                roughness={0.7}
                clearcoat={0.5}
                clearcoatRoughness={0.3}
              />
            </Box>
            {/* Towers */}
            <Cylinder args={[0.6, 0.6, 4, 32]} position={[-2, 2, -2]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.4}
                roughness={0.7}
                clearcoat={0.5}
              />
            </Cylinder>
            <Cylinder args={[0.6, 0.6, 4, 32]} position={[2, 2, -2]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.4}
                roughness={0.7}
                clearcoat={0.5}
              />
            </Cylinder>
            <Cylinder args={[0.6, 0.6, 4, 32]} position={[-2, 2, 2]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.4}
                roughness={0.7}
                clearcoat={0.5}
              />
            </Cylinder>
            <Cylinder args={[0.6, 0.6, 4, 32]} position={[2, 2, 2]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.4}
                roughness={0.7}
                clearcoat={0.5}
              />
            </Cylinder>
            {/* Tower tops */}
            <Cone args={[0.8, 1, 32]} position={[-2, 4.5, -2]} castShadow>
              <meshPhysicalMaterial
                color="#8B0000"
                metalness={0.3}
                roughness={0.7}
                clearcoat={0.5}
              />
            </Cone>
            <Cone args={[0.8, 1, 32]} position={[2, 4.5, -2]} castShadow>
              <meshPhysicalMaterial
                color="#8B0000"
                metalness={0.3}
                roughness={0.7}
                clearcoat={0.5}
              />
            </Cone>
            <Cone args={[0.8, 1, 32]} position={[-2, 4.5, 2]} castShadow>
              <meshPhysicalMaterial
                color="#8B0000"
                metalness={0.3}
                roughness={0.7}
                clearcoat={0.5}
              />
            </Cone>
            <Cone args={[0.8, 1, 32]} position={[2, 4.5, 2]} castShadow>
              <meshPhysicalMaterial
                color="#8B0000"
                metalness={0.3}
                roughness={0.7}
                clearcoat={0.5}
              />
            </Cone>
            {/* Gate */}
            <Box args={[1.5, 2, 0.5]} position={[0, 1, 2.2]} castShadow>
              <meshPhysicalMaterial
                color="#4a3728"
                metalness={0.3}
                roughness={0.7}
                clearcoat={0.8}
              />
            </Box>
          </group>
        )

      case 'tree':
        return (
          <group ref={sceneRef}>
            {/* Trunk */}
            <Cylinder args={[0.3, 0.4, 2, 8]} position={[0, 1, 0]} castShadow>
              <meshPhysicalMaterial
                color="#8B4513"
                metalness={0.2}
                roughness={0.8}
              />
            </Cylinder>
            {/* Leaves */}
            <Sphere args={[1.2]} position={[0, 2.5, 0]} castShadow>
              <meshPhysicalMaterial
                color="#228B22"
                metalness={0.1}
                roughness={0.9}
                clearcoat={0.3}
              />
            </Sphere>
            <Sphere args={[0.9]} position={[0.8, 2.2, 0.8]} castShadow>
              <meshPhysicalMaterial
                color="#228B22"
                metalness={0.1}
                roughness={0.9}
                clearcoat={0.3}
              />
            </Sphere>
            <Sphere args={[0.9]} position={[-0.8, 2.2, -0.8]} castShadow>
              <meshPhysicalMaterial
                color="#228B22"
                metalness={0.1}
                roughness={0.9}
                clearcoat={0.3}
              />
            </Sphere>
          </group>
        )

      case 'dragon':
        return (
          <group ref={sceneRef}>
            {/* Body */}
            <Box args={[3, 0.8, 1]} position={[0, 1, 0]} rotation={[0, 0.3, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.7}
                roughness={0.3}
                clearcoat={1}
                iridescence={0.5}
                iridescenceIOR={1.5}
              />
            </Box>
            {/* Neck */}
            <Box args={[0.6, 1.2, 0.6]} position={[1.2, 1.8, 0]} rotation={[0, 0, -0.5]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.7}
                roughness={0.3}
                clearcoat={1}
              />
            </Box>
            {/* Head */}
            <Box args={[1, 0.8, 0.7]} position={[1.8, 2.2, 0]} rotation={[0, 0.3, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.7}
                roughness={0.3}
                clearcoat={1}
              />
            </Box>
            {/* Wings */}
            <Box args={[1.5, 0.1, 2]} position={[-0.5, 1.5, 0]} rotation={[0.3, 0.2, 0.5]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.5}
                roughness={0.2}
                transmission={0.2}
                thickness={0.5}
              />
            </Box>
            {/* Eyes */}
            <Sphere args={[0.1, 32, 32]} position={[2, 2.3, 0.2]}>
              <meshPhysicalMaterial
                color="#ff0000"
                emissive="#ff0000"
                emissiveIntensity={2}
                metalness={1}
                roughness={0}
              />
            </Sphere>
          </group>
        )

      case 'crystal':
        return (
          <group ref={sceneRef}>
            {/* Crystal base */}
            <Box args={[1, 2, 1]} position={[0, 1, 0]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.1}
                roughness={0.1}
                transmission={0.8}
                thickness={0.5}
                ior={2.5}
                clearcoat={1}
              />
            </Box>
            {/* Crystal top */}
            <Box args={[0.8, 1, 0.8]} position={[0, 2.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.1}
                roughness={0.1}
                transmission={0.8}
                thickness={0.5}
                ior={2.5}
                clearcoat={1}
              />
            </Box>
          </group>
        )

      case 'motorcycle':
        return (
          <group ref={sceneRef}>
            {/* Main body */}
            <Box args={[1.5, 0.4, 0.4]} position={[0, 0.6, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.9}
                roughness={0.1}
                clearcoat={1}
                reflectivity={1}
              />
            </Box>
            {/* Seat */}
            <Box args={[0.8, 0.1, 0.4]} position={[0, 0.8, 0]} castShadow>
              <meshPhysicalMaterial
                color="#1a1a1a"
                roughness={0.8}
              />
            </Box>
            {/* Wheels */}
            <Cylinder args={[0.4, 0.4, 0.1, 32]} position={[-0.7, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <meshPhysicalMaterial
                color="#1a1a1a"
                metalness={0.8}
                roughness={0.2}
              />
            </Cylinder>
            <Cylinder args={[0.4, 0.4, 0.1, 32]} position={[0.7, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <meshPhysicalMaterial
                color="#1a1a1a"
                metalness={0.8}
                roughness={0.2}
              />
            </Cylinder>
            {/* Handlebars */}
            <Cylinder args={[0.05, 0.05, 0.6, 8]} position={[0.7, 0.9, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <meshPhysicalMaterial
                color="#4a4a4a"
                metalness={0.8}
                roughness={0.2}
              />
            </Cylinder>
          </group>
        )

      case 'truck':
        return (
          <group ref={sceneRef}>
            {/* Cabin */}
            <Box args={[1.2, 1.2, 1.5]} position={[1, 1.1, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.9}
                roughness={0.1}
                clearcoat={1}
              />
            </Box>
            {/* Cargo area */}
            <Box args={[2.5, 1.5, 1.8]} position={[-0.8, 1.25, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.7}
                roughness={0.3}
              />
            </Box>
            {/* Wheels */}
            {[[-1.8, 0.4, 0.9], [-1.8, 0.4, -0.9], [1, 0.4, 0.9], [1, 0.4, -0.9]].map((pos, i) => (
              <Cylinder key={i} args={[0.4, 0.4, 0.3, 32]} position={pos} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <meshPhysicalMaterial
                  color="#1a1a1a"
                  metalness={0.8}
                  roughness={0.2}
                />
              </Cylinder>
            ))}
          </group>
        )

      case 'skyscraper':
        return (
          <group ref={sceneRef}>
            {/* Main building */}
            <Box args={[2, 8, 2]} position={[0, 4, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.8}
                roughness={0.2}
                clearcoat={1}
                reflectivity={1}
              />
            </Box>
            {/* Windows */}
            {Array.from({ length: 8 }).map((_, i) => (
              <Box key={i} args={[1.5, 0.3, 0.1]} position={[0, i + 1, 1.1]} castShadow>
                <meshPhysicalMaterial
                  color="#a7c5eb"
                  metalness={0.9}
                  roughness={0.1}
                  transmission={0.5}
                  thickness={0.5}
                />
              </Box>
            ))}
          </group>
        )

      case 'bridge':
        return (
          <group ref={sceneRef}>
            {/* Main span */}
            <Box args={[8, 0.3, 1.5]} position={[0, 2, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.8}
                roughness={0.2}
              />
            </Box>
            {/* Towers */}
            <Box args={[0.5, 4, 0.5]} position={[-2, 2, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.8}
                roughness={0.2}
              />
            </Box>
            <Box args={[0.5, 4, 0.5]} position={[2, 2, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.8}
                roughness={0.2}
              />
            </Box>
            {/* Cables */}
            {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
              <Cylinder key={i} args={[0.05, 0.05, 4]} position={[x, 3, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
                <meshPhysicalMaterial
                  color="#4a4a4a"
                  metalness={0.9}
                  roughness={0.1}
                />
              </Cylinder>
            ))}
          </group>
        )

      case 'waterfall':
        return (
          <group ref={sceneRef}>
            {/* Rock formation */}
            <Box args={[4, 3, 2]} position={[0, 1.5, -1]} castShadow>
              <meshPhysicalMaterial
                color="#808080"
                metalness={0.2}
                roughness={0.8}
              />
            </Box>
            {/* Water */}
            {Array.from({ length: 5 }).map((_, i) => (
              <Box key={i} args={[2, 0.1, 0.5]} position={[0, 3 - i * 0.5, 0]} castShadow>
                <meshPhysicalMaterial
                  color="#a7c5eb"
                  metalness={0.1}
                  roughness={0.1}
                  transmission={0.8}
                  thickness={0.5}
                  ior={1.33}
                />
              </Box>
            ))}
            {/* Pool */}
            <Box args={[3, 0.1, 2]} position={[0, 0.05, 1]} castShadow>
              <meshPhysicalMaterial
                color="#a7c5eb"
                metalness={0.1}
                roughness={0.1}
                transmission={0.8}
                thickness={0.5}
                ior={1.33}
              />
            </Box>
          </group>
        )

      case 'flower':
        return (
          <group ref={sceneRef}>
            {/* Stem */}
            <Cylinder args={[0.05, 0.05, 2, 8]} position={[0, 1, 0]} castShadow>
              <meshPhysicalMaterial
                color="#228B22"
                metalness={0.1}
                roughness={0.8}
              />
            </Cylinder>
            {/* Petals */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * Math.PI * 2) / 8
              return (
                <Box
                  key={i}
                  args={[0.3, 0.1, 0.8]}
                  position={[
                    Math.cos(angle) * 0.4,
                    2,
                    Math.sin(angle) * 0.4
                  ]}
                  rotation={[0, angle, 0]}
                  castShadow
                >
                  <meshPhysicalMaterial
                    color={color}
                    metalness={0.1}
                    roughness={0.2}
                    clearcoat={0.5}
                  />
                </Box>
              )
            })}
            {/* Center */}
            <Sphere args={[0.2]} position={[0, 2, 0]} castShadow>
              <meshPhysicalMaterial
                color="#FFD700"
                metalness={0.3}
                roughness={0.7}
                emissive="#FFD700"
                emissiveIntensity={0.2}
              />
            </Sphere>
          </group>
        )

      case 'table':
        return (
          <group ref={sceneRef}>
            {/* Table top */}
            <Box args={[2, 0.1, 1.2]} position={[0, 1, 0]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.3}
                roughness={0.7}
                clearcoat={0.5}
              />
            </Box>
            {/* Table legs */}
            <Cylinder args={[0.1, 0.1, 1, 8]} position={[-0.8, 0.5, 0.5]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.3}
                roughness={0.7}
              />
            </Cylinder>
            <Cylinder args={[0.1, 0.1, 1, 8]} position={[0.8, 0.5, 0.5]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.3}
                roughness={0.7}
              />
            </Cylinder>
            <Cylinder args={[0.1, 0.1, 1, 8]} position={[-0.8, 0.5, -0.5]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.3}
                roughness={0.7}
              />
            </Cylinder>
            <Cylinder args={[0.1, 0.1, 1, 8]} position={[0.8, 0.5, -0.5]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.3}
                roughness={0.7}
              />
            </Cylinder>
          </group>
        )

      case 'spaceship':
        return (
          <group ref={sceneRef}>
            {/* Main body */}
            <Box args={[2, 0.5, 1]} position={[0, 1, 0]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.9}
                roughness={0.1}
                clearcoat={1}
              />
            </Box>
            {/* Cockpit */}
            <Sphere args={[0.4]} position={[0.8, 1.2, 0]} castShadow>
              <meshPhysicalMaterial 
                color="#a7c5eb"
                metalness={0.2}
                roughness={0.1}
                transmission={0.8}
                thickness={0.5}
              />
            </Sphere>
            {/* Wings */}
            <Box args={[0.8, 0.1, 2]} position={[-0.5, 1, 0]} castShadow>
              <meshPhysicalMaterial 
                color={color}
                metalness={0.9}
                roughness={0.1}
                clearcoat={1}
              />
            </Box>
            {/* Engines */}
            <Cylinder args={[0.2, 0.2, 0.5, 32]} position={[-0.8, 1, -0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <meshPhysicalMaterial 
                color="#ff4400"
                emissive="#ff4400"
                emissiveIntensity={2}
                metalness={0.9}
                roughness={0.1}
              />
            </Cylinder>
            <Cylinder args={[0.2, 0.2, 0.5, 32]} position={[-0.8, 1, 0.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <meshPhysicalMaterial 
                color="#ff4400"
                emissive="#ff4400"
                emissiveIntensity={2}
                metalness={0.9}
                roughness={0.1}
              />
            </Cylinder>
          </group>
        )

      case 'sword':
        return (
          <group ref={sceneRef}>
            {/* Blade */}
            <Box args={[0.2, 3, 0.1]} position={[0, 2, 0]} castShadow>
              <meshPhysicalMaterial
                color="#silver"
                metalness={1}
                roughness={0.1}
                clearcoat={1}
                reflectivity={1}
              />
            </Box>
            {/* Handle */}
            <Box args={[0.3, 0.8, 0.2]} position={[0, 0.4, 0]} castShadow>
              <meshPhysicalMaterial
                color="#4a3728"
                metalness={0.3}
                roughness={0.7}
              />
            </Box>
            {/* Guard */}
            <Box args={[0.8, 0.15, 0.3]} position={[0, 0.9, 0]} castShadow>
              <meshPhysicalMaterial
                color="#gold"
                metalness={1}
                roughness={0.1}
                clearcoat={1}
              />
            </Box>
          </group>
        )

      case 'temple':
        return (
          <group ref={sceneRef}>
            {/* Base */}
            <Box args={[6, 0.5, 6]} position={[0, 0.25, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.3}
                roughness={0.7}
              />
            </Box>
            {/* Pillars */}
            <Cylinder args={[0.3, 0.3, 4, 32]} position={[-2, 2.25, -2]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.4}
                roughness={0.6}
              />
            </Cylinder>
            <Cylinder args={[0.3, 0.3, 4, 32]} position={[2, 2.25, -2]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.4}
                roughness={0.6}
              />
            </Cylinder>
            <Cylinder args={[0.3, 0.3, 4, 32]} position={[-2, 2.25, 2]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.4}
                roughness={0.6}
              />
            </Cylinder>
            <Cylinder args={[0.3, 0.3, 4, 32]} position={[2, 2.25, 2]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.4}
                roughness={0.6}
              />
            </Cylinder>
            {/* Roof */}
            <Box args={[7, 0.5, 7]} position={[0, 4.5, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.3}
                roughness={0.7}
              />
            </Box>
            {/* Ornaments */}
            <Sphere args={[0.4, 32, 32]} position={[0, 5, 0]}>
              <meshPhysicalMaterial
                color="#gold"
                metalness={1}
                roughness={0.1}
                clearcoat={1}
              />
            </Sphere>
          </group>
        )

      case 'ship':
        return (
          <group ref={sceneRef}>
            {/* Hull */}
            <Box args={[4, 1, 1.5]} position={[0, 0.5, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.4}
                roughness={0.6}
                clearcoat={0.5}
              />
            </Box>
            {/* Deck */}
            <Box args={[3.5, 0.2, 1.2]} position={[0, 1.1, 0]} castShadow>
              <meshPhysicalMaterial
                color="#8B4513"
                metalness={0.2}
                roughness={0.8}
              />
            </Box>
            {/* Mast */}
            <Cylinder args={[0.1, 0.1, 3, 32]} position={[0, 2.7, 0]} castShadow>
              <meshPhysicalMaterial
                color="#8B4513"
                metalness={0.2}
                roughness={0.8}
              />
            </Cylinder>
            {/* Sail */}
            <Box args={[0.1, 2, 1.5]} position={[0.3, 2.7, 0]} rotation={[0, 0, 0.1]} castShadow>
              <meshPhysicalMaterial
                color="#FFFFFF"
                metalness={0}
                roughness={0.5}
                transmission={0.1}
              />
            </Box>
          </group>
        )

      case 'phoenix':
        return (
          <group ref={sceneRef}>
            {/* Body */}
            <Box args={[1.5, 0.8, 0.8]} position={[0, 1.5, 0]} rotation={[0, 0.3, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                emissive={color}
                emissiveIntensity={2}
                metalness={0.3}
                roughness={0.7}
                clearcoat={1}
              />
            </Box>
            {/* Wings */}
            <Box args={[0.1, 1.5, 2]} position={[-0.8, 1.5, 0]} rotation={[0.3, 0.2, 0.5]} castShadow>
              <meshPhysicalMaterial
                color={color}
                emissive={color}
                emissiveIntensity={3}
                metalness={0.2}
                roughness={0.3}
                transmission={0.3}
              />
            </Box>
            <Box args={[0.1, 1.5, 2]} position={[0.8, 1.5, 0]} rotation={[0.3, -0.2, -0.5]} castShadow>
              <meshPhysicalMaterial
                color={color}
                emissive={color}
                emissiveIntensity={3}
                metalness={0.2}
                roughness={0.3}
                transmission={0.3}
              />
            </Box>
            {/* Tail */}
            <Box args={[0.4, 1.2, 0.1]} position={[-0.6, 1.2, 0]} rotation={[0, 0, -0.8]} castShadow>
              <meshPhysicalMaterial
                color={color}
                emissive={color}
                emissiveIntensity={2}
                metalness={0.3}
                roughness={0.6}
              />
            </Box>
          </group>
        )

      case 'unicorn':
        return (
          <group ref={sceneRef}>
            {/* Body */}
            <Box args={[2, 1.2, 0.8]} position={[0, 1.2, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.3}
                roughness={0.7}
                clearcoat={1}
                iridescence={0.5}
              />
            </Box>
            {/* Head */}
            <Box args={[0.8, 0.8, 0.6]} position={[1.2, 2, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.3}
                roughness={0.7}
                clearcoat={1}
              />
            </Box>
            {/* Horn */}
            <Cylinder args={[0.1, 0, 1, 32]} position={[1.2, 2.8, 0]} rotation={[0, 0, -0.3]} castShadow>
              <meshPhysicalMaterial
                color="#FFD700"
                metalness={1}
                roughness={0.1}
                clearcoat={1}
                iridescence={1}
              />
            </Cylinder>
            {/* Mane */}
            <Box args={[1.2, 0.4, 0.2]} position={[0.6, 2.2, 0]} rotation={[0, 0, 0.3]} castShadow>
              <meshPhysicalMaterial
                color="#FF69B4"
                metalness={0.2}
                roughness={0.8}
                clearcoat={0.5}
                sheen={1}
              />
            </Box>
          </group>
        )

      case 'mech':
        return (
          <group ref={sceneRef}>
            {/* Torso */}
            <Box args={[2, 2, 1.5]} position={[0, 2, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.9}
                roughness={0.2}
                clearcoat={1}
                reflectivity={1}
              />
            </Box>
            {/* Head */}
            <Box args={[1, 1, 1]} position={[0, 3.5, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.9}
                roughness={0.2}
                clearcoat={1}
              />
            </Box>
            {/* Visor */}
            <Box args={[0.8, 0.2, 0.1]} position={[0, 3.6, 0.5]}>
              <meshPhysicalMaterial
                color="#FF0000"
                emissive="#FF0000"
                emissiveIntensity={3}
                transmission={0.5}
              />
            </Box>
            {/* Shoulders */}
            <Cylinder args={[0.5, 0.5, 0.8, 32]} position={[-1.2, 3, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.9}
                roughness={0.3}
              />
            </Cylinder>
            <Cylinder args={[0.5, 0.5, 0.8, 32]} position={[1.2, 3, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.9}
                roughness={0.3}
              />
            </Cylinder>
          </group>
        )

      case 'submarine':
        return (
          <group ref={sceneRef}>
            {/* Main Hull */}
            <Cylinder args={[1, 1, 4, 32]} position={[0, 1, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.8}
                roughness={0.2}
                clearcoat={1}
              />
            </Cylinder>
            {/* Conning Tower */}
            <Cylinder args={[0.4, 0.4, 1, 32]} position={[0, 2, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.8}
                roughness={0.2}
                clearcoat={1}
              />
            </Cylinder>
            {/* Periscope */}
            <Cylinder args={[0.1, 0.1, 0.8, 32]} position={[0, 2.8, 0]} castShadow>
              <meshPhysicalMaterial
                color="#1a1a1a"
                metalness={0.9}
                roughness={0.1}
              />
            </Cylinder>
            {/* Windows */}
            <Sphere args={[0.2, 32, 32]} position={[1.5, 1, 0.5]}>
              <meshPhysicalMaterial
                color="#a7c5eb"
                metalness={0.9}
                roughness={0.1}
                transmission={0.8}
                thickness={0.5}
              />
            </Sphere>
          </group>
        )

      case 'helicopter':
        return (
          <group ref={sceneRef}>
            {/* Main Body */}
            <Box args={[3, 1.2, 1.2]} position={[0, 1.5, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.8}
                roughness={0.2}
                clearcoat={1}
              />
            </Box>
            {/* Tail Boom */}
            <Box args={[2, 0.4, 0.4]} position={[-2.5, 1.8, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.8}
                roughness={0.2}
                clearcoat={1}
              />
            </Box>
            {/* Main Rotor */}
            <Box args={[5, 0.1, 0.3]} position={[0, 2.5, 0]} castShadow>
              <meshPhysicalMaterial
                color="#1a1a1a"
                metalness={0.9}
                roughness={0.1}
              />
            </Box>
            {/* Tail Rotor */}
            <Box args={[0.1, 1, 0.1]} position={[-3.5, 2, 0]} castShadow>
              <meshPhysicalMaterial
                color="#1a1a1a"
                metalness={0.9}
                roughness={0.1}
              />
            </Box>
          </group>
        )

      case 'pyramid':
        return (
          <group ref={sceneRef}>
            {/* Base */}
            <Box args={[4, 0.2, 4]} position={[0, 0.1, 0]} castShadow>
              <meshPhysicalMaterial
                color="#8B4513"
                metalness={0.3}
                roughness={0.8}
              />
            </Box>
            {/* Pyramid Structure */}
            <Cylinder args={[0, 2, 4, 4]} position={[0, 2.1, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.4}
                roughness={0.6}
                clearcoat={0.5}
              />
            </Cylinder>
            {/* Entrance */}
            <Box args={[1, 1.5, 0.1]} position={[0, 0.85, 2]} castShadow>
              <meshPhysicalMaterial
                color="#4a3728"
                metalness={0.3}
                roughness={0.7}
              />
            </Box>
          </group>
        )

      case 'lighthouse':
        return (
          <group ref={sceneRef}>
            {/* Base */}
            <Cylinder args={[1.5, 2, 1, 32]} position={[0, 0.5, 0]} castShadow>
              <meshPhysicalMaterial
                color="#808080"
                metalness={0.4}
                roughness={0.7}
              />
            </Cylinder>
            {/* Tower */}
            <Cylinder args={[1, 1, 5, 32]} position={[0, 3.5, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.4}
                roughness={0.6}
                clearcoat={0.5}
              />
            </Cylinder>
            {/* Light Room */}
            <Cylinder args={[1.2, 1.2, 1, 32]} position={[0, 6.5, 0]} castShadow>
              <meshPhysicalMaterial
                color="#FFD700"
                metalness={0.9}
                roughness={0.1}
                clearcoat={1}
                transmission={0.5}
                thickness={0.5}
              />
            </Cylinder>
            {/* Light Beam */}
            <Box args={[0.5, 0.5, 3]} position={[0, 6.5, 1.5]} castShadow>
              <meshPhysicalMaterial
                color="#FFFF00"
                emissive="#FFFF00"
                emissiveIntensity={5}
                transmission={0.9}
              />
            </Box>
          </group>
        )

      case 'windmill':
        return (
          <group ref={sceneRef}>
            {/* Base Tower */}
            <Cylinder args={[1, 1.5, 5, 32]} position={[0, 2.5, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.4}
                roughness={0.7}
              />
            </Cylinder>
            {/* Blades */}
            <Box args={[0.3, 5, 0.1]} position={[0, 5, 0]} castShadow>
              <meshPhysicalMaterial
                color="#8B4513"
                metalness={0.3}
                roughness={0.8}
              />
            </Box>
            <Box args={[0.3, 5, 0.1]} position={[0, 5, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
              <meshPhysicalMaterial
                color="#8B4513"
                metalness={0.3}
                roughness={0.8}
              />
            </Box>
          </group>
        )

      case 'volcano':
        return (
          <group ref={sceneRef}>
            {/* Mountain Base */}
            <Cylinder args={[3, 5, 4, 32]} position={[0, 2, 0]} castShadow>
              <meshPhysicalMaterial
                color="#4a3728"
                metalness={0.3}
                roughness={0.9}
              />
            </Cylinder>
            {/* Crater */}
            <Cylinder args={[1, 2, 1, 32]} position={[0, 4.5, 0]} castShadow>
              <meshPhysicalMaterial
                color="#8B0000"
                emissive="#FF4500"
                emissiveIntensity={2}
                metalness={0.8}
                roughness={0.2}
              />
            </Cylinder>
            {/* Lava Flow */}
            <Box args={[0.8, 3, 0.3]} position={[1.5, 2, 1]} rotation={[0, 0, -0.5]} castShadow>
              <meshPhysicalMaterial
                color="#FF4500"
                emissive="#FF4500"
                emissiveIntensity={3}
                metalness={0.7}
                roughness={0.3}
                transmission={0.3}
              />
            </Box>
          </group>
        )

      case 'tower':
        return (
          <group ref={sceneRef}>
            {/* Base */}
            <Cylinder args={[1.2, 1.5, 5, 32]} position={[0, 2.5, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.4}
                roughness={0.6}
                clearcoat={0.3}
              />
            </Cylinder>
            {/* Top */}
            <Cylinder args={[1.7, 1.2, 1, 32]} position={[0, 5.5, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.4}
                roughness={0.6}
                clearcoat={0.3}
              />
            </Cylinder>
            {/* Windows */}
            <Box args={[0.3, 0.5, 0.1]} position={[0, 2, 1.2]} castShadow>
              <meshPhysicalMaterial
                color="#a7c5eb"
                metalness={0.9}
                roughness={0.1}
                transmission={0.5}
              />
            </Box>
            <Box args={[0.3, 0.5, 0.1]} position={[0, 3.5, 1.2]} castShadow>
              <meshPhysicalMaterial
                color="#a7c5eb"
                metalness={0.9}
                roughness={0.1}
                transmission={0.5}
              />
            </Box>
          </group>
        )

      case 'mountain':
        return (
          <group ref={sceneRef}>
            {/* Main Peak */}
            <Cylinder args={[2, 0.1, 4, 4]} position={[0, 2, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.2}
                roughness={0.8}
                clearcoat={0.2}
              />
            </Cylinder>
            {/* Snow Cap */}
            <Cylinder args={[0.5, 0, 1, 4]} position={[0, 4.5, 0]} castShadow>
              <meshPhysicalMaterial
                color="#FFFFFF"
                metalness={0.2}
                roughness={0.7}
                clearcoat={0.5}
              />
            </Cylinder>
          </group>
        )

      case 'fountain':
        return (
          <group ref={sceneRef}>
            {/* Base */}
            <Cylinder args={[1.5, 1.8, 0.5, 32]} position={[0, 0.25, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.6}
                roughness={0.4}
                clearcoat={0.5}
              />
            </Cylinder>
            {/* Middle Tier */}
            <Cylinder args={[0.8, 1, 1, 32]} position={[0, 1, 0]} castShadow>
              <meshPhysicalMaterial
                color={color}
                metalness={0.6}
                roughness={0.4}
                clearcoat={0.5}
              />
            </Cylinder>
            {/* Top Tier */}
            <Sphere args={[0.3, 32, 32]} position={[0, 2, 0]}>
              <meshPhysicalMaterial
                color="#a7c5eb"
                metalness={0.9}
                roughness={0.1}
                transmission={0.8}
                thickness={0.5}
                ior={1.5}
              />
            </Sphere>
            {/* Water Effect */}
            <group position={[0, 0.5, 0]}>
              {[...Array(8)].map((_, i) => (
                <Box
                  key={i}
                  args={[0.1, 0.8, 0.1]}
                  position={[
                    Math.cos((i * Math.PI) / 4) * 0.8,
                    Math.random() * 0.5,
                    Math.sin((i * Math.PI) / 4) * 0.8
                  ]}
                  rotation={[Math.random() * 0.2, 0, Math.random() * 0.2]}
                >
                  <meshPhysicalMaterial
                    color="#a7c5eb"
                    metalness={0.9}
                    roughness={0.1}
                    transmission={0.8}
                    thickness={0.5}
                    ior={1.5}
                  />
                </Box>
              ))}
            </group>
          </group>
        )

      case 'sphere':
        return (
          <Sphere args={[size/2, 32, 32]} position={[0, size/2, 0]}>
            <meshPhysicalMaterial 
              color={color}
              metalness={0.8}
              roughness={0.2}
              clearcoat={1}
              clearcoatRoughness={0.1}
              reflectivity={1}
              iridescence={0.3}
              iridescenceIOR={1.5}
              sheen={1}
              sheenRoughness={0.5}
              transmission={0.2}
            />
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
            <meshPhysicalMaterial 
              color={color}
              metalness={0.8}
              roughness={0.2}
              clearcoat={1}
              clearcoatRoughness={0.1}
              reflectivity={1}
              iridescence={0.3}
              iridescenceIOR={1.5}
              sheen={1}
              sheenRoughness={0.5}
              transmission={0.2}
            />
          </Box>
        )
    }
  }

  return (
    <>
      <TransformControls>
        <group ref={groupRef} scale={scale}>
          {createModel()}
        </group>
      </TransformControls>
      <OrbitControls enableDamping dampingFactor={0.05} />
      <Environment preset={materialPreset} background blur={0.5} />
      <ambientLight intensity={lightIntensity} />
      <pointLight position={[10, 10, 10]} intensity={lightIntensity * 2.0} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={lightIntensity * 1.0} color="#ff9999" />
      <pointLight position={[0, 10, -10]} intensity={lightIntensity * 1.2} color="#66ccff" />
      <spotLight position={[5, 5, 5]} angle={0.4} penumbra={0.7} intensity={lightIntensity * 2.0} castShadow />
      <spotLight position={[-5, 5, -5]} angle={0.3} penumbra={0.5} intensity={lightIntensity * 1.5} castShadow color="#ffcc66" />
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
  const [lightIntensity, setLightIntensity] = useState(0.8)
  const [materialPreset, setMaterialPreset] = useState('sunset')
  const [savedModels, setSavedModels] = useState([])
  const [showGallery, setShowGallery] = useState(false)
  const [gltfModelPath, setGltfModelPath] = useState(null)
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
    } else if (lowerText.includes('robot')) {
      shape = 'robot'
    } else if (lowerText.includes('spaceship') || lowerText.includes('spacecraft')) {
      shape = 'spaceship'
    } else if (lowerText.includes('castle') || lowerText.includes('fortress')) {
      shape = 'castle'
    } else if (lowerText.includes('dragon')) {
      shape = 'dragon'
    } else if (lowerText.includes('crystal') || lowerText.includes('gem')) {
      shape = 'crystal'
    } else if (lowerText.includes('sword') || lowerText.includes('blade')) {
      shape = 'sword'
    } else if (lowerText.includes('temple') || lowerText.includes('shrine')) {
      shape = 'temple'
    } else if (lowerText.includes('ship') || lowerText.includes('boat')) {
      shape = 'ship'
    } else if (lowerText.includes('tower')) {
      shape = 'tower'
    } else if (lowerText.includes('mountain') || lowerText.includes('peak')) {
      shape = 'mountain'
    } else if (lowerText.includes('fountain')) {
      shape = 'fountain'
    } else if (lowerText.includes('phoenix')) {
      shape = 'phoenix'
    } else if (lowerText.includes('unicorn')) {
      shape = 'unicorn'
    } else if (lowerText.includes('mech')) {
      shape = 'mech'
    } else if (lowerText.includes('submarine')) {
      shape = 'submarine'
    } else if (lowerText.includes('helicopter')) {
      shape = 'helicopter'
    } else if (lowerText.includes('pyramid')) {
      shape = 'pyramid'
    } else if (lowerText.includes('lighthouse')) {
      shape = 'lighthouse'
    } else if (lowerText.includes('windmill')) {
      shape = 'windmill'
    } else if (lowerText.includes('volcano')) {
      shape = 'volcano'
    } else if (lowerText.includes('motorcycle')) {
      shape = 'motorcycle'
    } else if (lowerText.includes('truck')) {
      shape = 'truck'
    } else if (lowerText.includes('skyscraper')) {
      shape = 'skyscraper'
    } else if (lowerText.includes('bridge')) {
      shape = 'bridge'
    } else if (lowerText.includes('waterfall')) {
      shape = 'waterfall'
    } else if (lowerText.includes('flower')) {
      shape = 'flower'
    } else if (lowerText.includes('table')) {
      shape = 'table'
    } else if (lowerText.includes('phoenix')) {
      shape = 'phoenix'
    } else if (lowerText.includes('unicorn')) {
      shape = 'unicorn'
    } else if (lowerText.includes('mech')) {
      shape = 'mech'
    } else if (lowerText.includes('submarine')) {
      shape = 'submarine'
    } else if (lowerText.includes('helicopter')) {
      shape = 'helicopter'
    } else if (lowerText.includes('pyramid')) {
      shape = 'pyramid'
    } else if (lowerText.includes('lighthouse')) {
      shape = 'lighthouse'
    } else if (lowerText.includes('windmill')) {
      shape = 'windmill'
    } else if (lowerText.includes('volcano')) {
      shape = 'volcano'
    } else if (lowerText.includes('tower')) {
      shape = 'tower'
    } else if (lowerText.includes('mountain')) {
      shape = 'mountain'
    } else if (lowerText.includes('fountain')) {
      shape = 'fountain'
    } else if (lowerText.includes('sphere')) {
      shape = 'sphere'
    } else if (lowerText.includes('cylinder')) {
      shape = 'cylinder'
    } else if (lowerText.includes('sword')) {
      shape = 'sword'
    } else if (lowerText.includes('temple')) {
      shape = 'temple'
    } else if (lowerText.includes('ship')) {
      shape = 'ship'
    } else if (lowerText.includes('dragon')) {
      shape = 'dragon'
    } else if (lowerText.includes('crystal')) {
      shape = 'crystal'
    } else if (lowerText.includes('motorcycle')) {
      shape = 'motorcycle'
    } else if (lowerText.includes('truck')) {
      shape = 'truck'
    } else if (lowerText.includes('skyscraper')) {
      shape = 'skyscraper'
    } else if (lowerText.includes('bridge')) {
      shape = 'bridge'
    } else if (lowerText.includes('waterfall')) {
      shape = 'waterfall'
    } else if (lowerText.includes('flower')) {
      shape = 'flower'
    }

    // Extract size
    let size = 1
    if (lowerText.includes('large') || lowerText.includes('big')) {
      size = 2
    } else if (lowerText.includes('small') || lowerText.includes('tiny')) {
      size = 0.5
    }

    // Extract material properties
    let metalness = 0.5
    let roughness = 0.5
    if (lowerText.includes('metallic') || lowerText.includes('shiny')) {
      metalness = 0.9
      roughness = 0.1
    } else if (lowerText.includes('matte') || lowerText.includes('rough')) {
      metalness = 0.1
      roughness = 0.9
    }

    // Extract animation
    let animation = 'none'
    if (lowerText.includes('spin') || lowerText.includes('rotate')) {
      animation = 'rotate'
    } else if (lowerText.includes('bounce') || lowerText.includes('jump')) {
      animation = 'bounce'
    } else if (lowerText.includes('float') || lowerText.includes('hover')) {
      animation = 'float'
    }

    return {
      shape,
      color,
      size,
      metalness,
      roughness,
      animation,
      features: []
    }
  }

  const handleGenerate = async () => {
    if (!prompt) return
    setIsGenerating(true)
    setShowPreview(false)

    try {
      // Call backend API to generate or fetch 3D model based on prompt
      const response = await fetch('http://localhost:5000/api/generate-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate model')
      }

      const data = await response.json()
      if (!data.model || !data.model.filePath) {
        throw new Error('Invalid model data received')
      }

      setGltfModelPath(data.model.filePath)
      setModelDetails({ shape: data.model.name, description: data.model.description })
      setAnalysis({
        keywords: prompt.toLowerCase().split(' '),
        complexity: prompt.length > 100 ? 'complex' : 'simple',
        type: data.model.name
      })
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
    if (modelDetails) {
      setSavedModels([...savedModels, { ...modelDetails, id: Date.now(), prompt }])
      toast.success('Model saved to gallery!')
      setShowPreview(false)
    }
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
          <div className="gallery-toggle">
            <button onClick={() => setShowGallery(!showGallery)} className="gallery-button">
              {showGallery ? 'Hide Gallery' : 'Show Gallery'}
            </button>
          </div>
          
          {showGallery && (
            <div className="gallery-section">
              <h3>Saved Models</h3>
              <div className="gallery-grid">
                {savedModels.map((model) => (
                  <div key={model.id} className="gallery-item" onClick={() => {
                    setModelDetails(model)
                    setPrompt(model.prompt)
                    setShowPreview(true)
                    setShowGallery(false)
                  }}>
                    <div className="gallery-item-preview" style={{ backgroundColor: model.color }}></div>
                    <div className="gallery-item-details">
                      <span className="gallery-item-shape">{model.shape}</span>
                      <span className="gallery-item-prompt">{model.prompt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            <div className="control-group">
              <button
                className="download-button"
                onClick={() => {
                  if (!sceneRef.current) {
                    toast.error('No model to export')
                    return
                  }
                  const exporter = new GLTFExporter()
                  try {
                    exporter.parse(
                      sceneRef.current,
                      (gltf) => {
                        try {
                          const blob = new Blob([gltf], { type: 'model/gltf-binary' })
                          const url = URL.createObjectURL(blob)
                          const link = document.createElement('a')
                          link.href = url
                          link.download = `${modelDetails?.shape || 'model'}.glb`
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                          URL.revokeObjectURL(url)
                          toast.success('Model downloaded successfully!')
                        } catch (error) {
                          console.error('Error creating download:', error)
                          toast.error('Failed to create download: ' + error.message)
                        }
                      },
                      (error) => {
                        console.error('Error exporting model:', error)
                        toast.error('Failed to export model: ' + error.message)
                      },
                      { binary: true, maxTextureSize: 4096, embedImages: true }
                    )
                  } catch (error) {
                    console.error('Error initializing export:', error)
                    toast.error('Failed to initialize export: ' + error.message)
                  }
                }}
              >
                Download Model
              </button>
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
              <div className="light-control">
                <label>Light:</label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={lightIntensity}
                  onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                />
              </div>
              <div className="material-control">
                <label>Environment:</label>
                <select
                  value={materialPreset}
                  onChange={(e) => setMaterialPreset(e.target.value)}
                >
                  <option value="sunset">Sunset</option>
                  <option value="dawn">Dawn</option>
                  <option value="night">Night</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="forest">Forest</option>
                  <option value="apartment">Apartment</option>
                  <option value="studio">Studio</option>
                  <option value="city">City</option>
                  <option value="park">Park</option>
                  <option value="lobby">Lobby</option>
                </select>
              </div>
            </div>
          </div>
          <Canvas
            camera={{ position: [0, 2, 5], fov: 75 }}
            style={{ width: '100%', height: '100%' }}
            shadows
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.2,
              outputEncoding: THREE.sRGBEncoding,
              physicallyCorrectLights: true
            }}
          >
            <Suspense fallback={null}>
              <Scene modelDetails={modelDetails} scale={scale} lightIntensity={lightIntensity} materialPreset={materialPreset} />
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