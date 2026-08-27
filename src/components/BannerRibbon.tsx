import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import type { Group } from 'three'
import * as THREE from 'three'

const LABELS = ['SYED KABEER AHMED', 'AI ENGINEER', 'MERN STACK'] as const

/** Wider wrap so full name clears Iron Man on the sides */
const RING_RADIUS = 5.05
const BAND_HEIGHT = 1.28
const BAND_THICKNESS = 0.16

function paintTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 4096
  canvas.height = 320
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  ctx.fillStyle = '#6a1422'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const sheen = ctx.createLinearGradient(0, 0, 0, canvas.height)
  sheen.addColorStop(0, 'rgba(255, 220, 230, 0.12)')
  sheen.addColorStop(0.18, 'rgba(255, 220, 230, 0)')
  sheen.addColorStop(0.82, 'rgba(0, 0, 0, 0)')
  sheen.addColorStop(1, 'rgba(0, 0, 0, 0.22)')
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#f7eef0'
  ctx.font = '700 188px Anton, Arial Narrow, sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
  ctx.shadowBlur = 8
  ctx.shadowOffsetY = 2

  const units: string[] = []
  for (let i = 0; i < 3; i += 1) {
    for (const label of LABELS) {
      units.push(label)
    }
  }

  const text = units.join('   ◆   ') + '   ◆   '
  ctx.fillText(text, 40, canvas.height * 0.52)

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

function SmoothBanner() {
  const group = useRef<Group>(null)
  const reduced = useRef(false)
  const map = useMemo(() => paintTexture(), [])

  const outerGeo = useMemo(() => {
    return new THREE.CylinderGeometry(
      RING_RADIUS,
      RING_RADIUS,
      BAND_HEIGHT,
      128,
      1,
      true,
    )
  }, [])

  const innerGeo = useMemo(() => {
    return new THREE.CylinderGeometry(
      RING_RADIUS - BAND_THICKNESS,
      RING_RADIUS - BAND_THICKNESS,
      BAND_HEIGHT * 0.98,
      128,
      1,
      true,
    )
  }, [])

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    return () => {
      map.dispose()
    }
  }, [map])

  useEffect(() => {
    return () => {
      outerGeo.dispose()
      innerGeo.dispose()
    }
  }, [outerGeo, innerGeo])

  useFrame((state) => {
    if (!group.current) return
    if (reduced.current) {
      group.current.rotation.y = -0.35
      return
    }
    group.current.rotation.y = -state.clock.elapsedTime * ((Math.PI * 2) / 36)
  })

  return (
    <group ref={group}>
      <mesh geometry={outerGeo}>
        <meshStandardMaterial
          map={map}
          side={THREE.DoubleSide}
          roughness={0.45}
          metalness={0.12}
        />
      </mesh>
      <mesh geometry={innerGeo}>
        <meshStandardMaterial
          color="#4a0d18"
          side={THREE.DoubleSide}
          roughness={0.55}
          metalness={0.08}
        />
      </mesh>
    </group>
  )
}

function BannerLights() {
  return (
    <>
      <ambientLight intensity={0.95} color="#f0d0d4" />
      <directionalLight position={[2.5, 3, 5]} intensity={1.25} color="#fff2ea" />
      <directionalLight position={[-2.5, 1.5, 2]} intensity={0.45} color="#ff7a8a" />
    </>
  )
}

/** Single continuous circular banner — no panel edges */
export function SmoothCircularBanner() {
  return (
    <Canvas
      className="hero__ticker-canvas"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.28, 9.4], fov: 32, near: 0.1, far: 50 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
      }}
    >
      <BannerLights />
      <SmoothBanner />
    </Canvas>
  )
}
