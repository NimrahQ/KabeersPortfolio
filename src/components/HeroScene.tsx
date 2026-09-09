import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import {
  Suspense,
  useLayoutEffect,
  useMemo,
  useRef,
  type MutableRefObject,
} from 'react'
import type { Group, Mesh, Points } from 'three'
import * as THREE from 'three'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'


const MODEL_URL = '/models/iron-man_mark_85__web.glb'
const TARGET_HEIGHT = 6.2
const MODEL_BASE_Y = -2.05
const PLUME_COUNT = 22
const BREAK_COUNT = 5000
/** After Summary → convert through Skills, dissolve before Spider-Man.
 *  0.48 → 0.62 was too early (fully spread before even reaching the "Tools
 *  and Technologies" heading); pushed a bit later so the full spread lands
 *  closer to when that heading comes into view. */
const BREAK_START = 0.38
const BREAK_END = 0.56
const DISSOLVE_START = 0.56
const DISSOLVE_END = 0.70
/** Fraction of the actual visible viewport (0–1) the scattered field is
 *  allowed to fill on each axis at full dissolve. 1.0 = corner-to-corner;
 *  lower it slightly if particles feel like they're leaving the section. */
const SCATTER_VIEWPORT_FILL = 0.95
/** Depth range (world units, both directions) particles scatter into so the
 *  cloud isn't a flat plane — kept modest so perspective doesn't make edge
 *  particles balloon or shrink too much. */
const SCATTER_DEPTH = 1.6
/** Visible bust only (waist → head) — feet are off-screen so full-height dissolve looked stuck */
const VIS_BODY_MIN_Y = -1.35
const VIS_BODY_MAX_Y = 2.95
const VIS_BODY_SPAN = VIS_BODY_MAX_Y - VIS_BODY_MIN_Y

function createAshTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const g = ctx.createRadialGradient(
    size * 0.5,
    size * 0.5,
    0,
    size * 0.5,
    size * 0.5,
    size * 0.5,
  )
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.4, 'rgba(255,220,200,0.9)')
  g.addColorStop(0.75, 'rgba(180,80,60,0.3)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

function createSmokeTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const g = ctx.createRadialGradient(
    size * 0.5,
    size * 0.5,
    0,
    size * 0.5,
    size * 0.5,
    size * 0.5,
  )
  g.addColorStop(0, 'rgba(240,240,245,0.85)')
  g.addColorStop(0.35, 'rgba(200,200,210,0.5)')
  g.addColorStop(0.7, 'rgba(150,150,160,0.15)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
  tex.needsUpdate = true
  return tex
}
/**
 * Build a particle cloud in fitted hero space (height ≈ TARGET_HEIGHT).
 * Volume profile matches the body so particles are always where the suit is.
 */


function sampleBreakCloud(count: number) {
  const origins = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  const color = new THREE.Color()
  for (let i = 0; i < count; i++) {
    // Bias samples to the on-screen bust (waist → head)
    const y = VIS_BODY_MIN_Y + Math.random() * VIS_BODY_SPAN
    let halfW = 0.55
    let halfD = 0.4
    if (y > 1.85) {
      halfW = 0.42
      halfD = 0.38
    } else if (y > 0.55) {
      halfW = 1.25
      halfD = 0.5
    } else if (y > -0.4) {
      halfW = 0.95
      halfD = 0.48
    } else {
      halfW = 0.85
      halfD = 0.45
    }
const x = (Math.random() - 0.5) * 2 * halfW
    const z = (Math.random() - 0.5) * 2 * halfD
    origins[i * 3] = x
    origins[i * 3 + 1] = y
    origins[i * 3 + 2] = z
    const roll = Math.random()
    if (roll < 0.5) color.set('#ff2f55')
    else if (roll < 0.85) color.set('#ffbf3f')
    else color.set('#ffffff')
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
    seeds[i] = Math.random()
  }
  return { origins, colors, seeds }
}



type SmokePlume = {
  x: number
  y: number
  z: number
  nx: number
  ny: number
  scaleX: number
  scaleY: number
  rot: number
  spin: number
  phase: number
  speed: number
  life: number
  tint: number
}
type HeroModelProps = {
  scrollProgress: MutableRefObject<number>
}
type HeroMat = THREE.MeshStandardMaterial & {
  userData: {
    uTime?: { value: number }
    uEdgeFire?: { value: number }
    uBreak?: { value: number }
  }
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}
function collectYawBones(root: THREE.Object3D): THREE.Object3D[] {
  const yawBones: THREE.Object3D[] = []
  root.traverse((obj) => {
    const isBone = (obj as THREE.Bone).isBone || obj.type === 'Bone'
    if (!isBone) return
    const n = (obj.name || '').toLowerCase()
    if (n.includes('neck') || (n.includes('head') && !n.includes('end') && !n.includes('top'))) {
      yawBones.push(obj)
    }
  })
  return yawBones
}



function isGlowMaterial(name: string) {
  const n = name.toLowerCase()
  return n.includes('lights') || n.includes('arc') || n.includes('reactor')
}


function softEdgeSmokeMaterial(map: THREE.Texture) {
  const mat = new THREE.MeshBasicMaterial({
    map,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    opacity: 0.22,
    toneMapped: false,
    color: new THREE.Color('#efefef'),
  })
  // Feather UV edges so the plane's square silhouette disappears
  mat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      /* glsl */ `
      #include <map_fragment>
      vec2 edgeUv = vMapUv * (1.0 - vMapUv);
      float softEdge = smoothstep(0.0, 0.06, edgeUv.x) * smoothstep(0.0, 0.06, edgeUv.y);
      float radial = 1.0 - smoothstep(0.28, 0.52, length(vMapUv - 0.5));
      float mask = softEdge * radial;
      diffuseColor.rgb *= mask;
      diffuseColor.a *= mask;
      `,
    )
  }
  mat.customProgramCacheKey = () => 'smoke-soft-edge-v2'
  mat.needsUpdate = true
  return mat
}
/** Spawn on silhouette rim: head → shoulders → outer arms near hands. */
function spawnPlume(p: SmokePlume) {
  const zone = Math.random()
  if (zone < 0.42) {
    // Head + shoulder crown arc
    const t = Math.random()
    const angle = Math.PI * (0.22 + t * 0.56)
    const rx = 0.58 + Math.random() * 0.05
    const ry = 0.78 + Math.random() * 0.06
    const cx = 0
    const cy = 1.62
    const ox = Math.cos(angle) * rx
    const oy = Math.sin(angle) * ry
    const edge = 0.96 + Math.random() * 0.03
    p.x = cx + ox * edge
    p.y = cy + oy * edge
    p.z = -0.04 - Math.random() * 0.1
    const len = Math.hypot(ox, oy) || 1
    p.nx = ox / len
    p.ny = oy / len
  } else {
    // Outer arm edges → down toward hands (the red lines)
    const side = Math.random() < 0.5 ? -1 : 1
    const alongArm = Math.random() // 0 = shoulder, 1 = near hand
    p.x = side * (0.62 + alongArm * 0.28 + Math.random() * 0.04)
    p.y = 1.05 - alongArm * 2.35 + (Math.random() - 0.5) * 0.08
    p.z = -0.05 - Math.random() * 0.12
    p.nx = side * (0.85 + Math.random() * 0.15)
    p.ny = -0.15 + (Math.random() - 0.5) * 0.2
    const nLen = Math.hypot(p.nx, p.ny) || 1
    p.nx /= nLen
    p.ny /= nLen
  }
  p.scaleX = 0.2 + Math.random() * 0.18
  p.scaleY = 0.3 + Math.random() * 0.28
  p.rot = Math.atan2(p.ny, p.nx) + Math.PI * 0.5 + (Math.random() - 0.5) * 0.25
  p.spin = (Math.random() - 0.5) * 0.05
  p.phase = Math.random() * Math.PI * 2
  p.speed = 0.14 + Math.random() * 0.12
  p.life = Math.random()
  p.tint = 0.8 + Math.random() * 0.2
}

function HeroSmoke({ scrollProgress }: { scrollProgress: MutableRefObject<number> }) {
  const groupRef = useRef<Group>(null)
  const meshRefs = useRef<Array<Mesh | null>>([])
  const plumes = useRef<SmokePlume[]>([])
  const smokeMap = useMemo(() => createSmokeTexture(), [])
  const materials = useMemo(() => {
    if (!smokeMap) return []
    return Array.from({ length: PLUME_COUNT }, () => softEdgeSmokeMaterial(smokeMap))
  }, [smokeMap])

useLayoutEffect(() => {
    const next: SmokePlume[] = []
    for (let i = 0; i < PLUME_COUNT; i++) {
      const p: SmokePlume = {
        x: 0,
        y: 0,
        z: 0,
        nx: 0,
        ny: 1,
        scaleX: 1,
        scaleY: 1,
        rot: 0,
        spin: 0,
        phase: 0,
        speed: 0.1,
        life: 0,
        tint: 1,
      }
      spawnPlume(p)
      next.push(p)
    }
    plumes.current = next
  }, [])

  useFrame((state, delta) => {
    const root = groupRef.current
    if (!root) return
    const scroll = scrollProgress.current
    const breakAmt = smoothstep(BREAK_START, BREAK_END, scroll)
    const dissolve = smoothstep(DISSOLVE_START, DISSOLVE_END, scroll)
    const visibility = (1 - breakAmt * 0.85) * (1 - dissolve)
    root.visible = visibility > 0.04
    const t = state.clock.elapsedTime
    const cam = state.camera
    for (let i = 0; i < PLUME_COUNT; i++) {
      const mesh = meshRefs.current[i]
      const p = plumes.current[i]
      const mat = materials[i]
      if (!mesh || !p || !mat) continue
      p.life += delta * p.speed
      if (p.life > 1) {
        spawnPlume(p)
        p.life = 0
      }
      // Tiny peel off the edge
const lifeFade = Math.sin(p.life * Math.PI)
      const peel = p.life * 0.08
      const lift = p.life * 0.06
      const along = Math.sin(t * 0.55 + p.phase) * 0.015
      const tangentX = -p.ny
      const tangentY = p.nx
      mesh.position.set(
        p.x + p.nx * peel + tangentX * along,
        p.y + p.ny * peel * 0.5 + lift + tangentY * along,
        p.z - p.life * 0.02,
      )
      mesh.scale.set(
        p.scaleX * (0.9 + lifeFade * 0.15),
        p.scaleY * (0.95 + p.life * 0.18),
        1,
      )
      mesh.lookAt(cam.position)
      mesh.rotateZ(p.rot + t * p.spin)
      const grey = p.tint
      mat.color.setRGB(grey, grey, grey * 0.96)
      mat.opacity = (0.12 + lifeFade * 0.28) * visibility
    }
  })
  return (
    <group ref={groupRef} renderOrder={1}>
      {materials.map((mat, i) => (
        <mesh
          key={i}
          ref={(node) => {
            meshRefs.current[i] = node
          }}
          frustumCulled={false}
          renderOrder={1}
          material={mat}
        >
          <planeGeometry args={[1, 1]} />
        </mesh>
      ))}
    </group>
  )
}
type BreakCloudProps = {
  scrollProgress: MutableRefObject<number>
  /** Current position/scale of the parent hero group, read live each frame
   *  so viewport-space scatter targets can be converted into that group's
   *  local space (the group itself is translated/scaled for framing). */
  groupMotion: MutableRefObject<{ x: number; y: number; scale: number }>
}
function BreakCloud({ scrollProgress, groupMotion }: BreakCloudProps) {
  const pointsRef = useRef<Points>(null)
  const ashTex = useMemo(() => createAshTexture(), [])
  const cloud = useMemo(() => sampleBreakCloud(BREAK_COUNT), [])
  const positions = useMemo(() => new Float32Array(cloud.origins), [cloud.origins])
  // Fixed per-particle destination in WORLD space, resampled whenever the
  // viewport size changes (resize) so the field always spans the actual
  // visible screen. These stay in world space — converting them into the
  // parent group's local space has to happen live every frame (below) using
  // the group's CURRENT position/scale, not the transform it happened to
  // have at the moment this was sampled. (That was the actual bug: the
  // previous version baked in the group's transform once, at mount, before
  // the hero had animated into its resting position/scale — so every
  // target ended up shifted and compressed toward the body instead of
  // reaching the real screen edges.)
  const scatterWorldTargets = useRef(new Float32Array(BREAK_COUNT * 3))
  const lastViewport = useRef({ w: -1, h: -1 })

  useFrame((state) => {
    const points = pointsRef.current
    if (!points) return
    const scroll = scrollProgress.current
    // Slow body → particles from Summary through Skills, then dissolve
    const breakAmt = smoothstep(BREAK_START, BREAK_END, scroll)
    const dissolve = smoothstep(DISSOLVE_START, DISSOLVE_END, scroll)
    const show = breakAmt > 0.01 && dissolve < 0.998
    points.visible = show
    const mat = points.material as THREE.PointsMaterial
    // Only fade opacity/size out in the final stretch of the dissolve window —
    // previously this faded in lockstep with `dissolve`, so the cloud went
    // transparent at almost exactly the rate it was spreading out, which is
    // why it read as "a body quietly disappearing" instead of "particles
    // filling the section". Now it stays fully visible while it travels and
    // only fades right at the end, once it's already spread wide.
    const fadeOut = smoothstep(0.78, 1, dissolve)
    mat.opacity = (1 - fadeOut) * 0.95
    mat.size = THREE.MathUtils.lerp(0.055, 0.02, fadeOut)

    // The visible viewport in WORLD units at this depth, from the live camera —
    // not a guessed constant, so this is correct at any window size/aspect.
    const vp = state.viewport
    if (vp.width !== lastViewport.current.w || vp.height !== lastViewport.current.h) {
      lastViewport.current = { w: vp.width, h: vp.height }
      // Sample a target uniformly across the ACTUAL visible screen, in WORLD
      // space. Deliberately NOT converted to local space here — see the
      // comment on scatterWorldTargets above.
      const worldHalfW = vp.width * 0.5 * SCATTER_VIEWPORT_FILL
      const worldHalfH = vp.height * 0.5 * SCATTER_VIEWPORT_FILL
      const targets = scatterWorldTargets.current
      for (let i = 0; i < BREAK_COUNT; i++) {
        targets[i * 3] = (Math.random() * 2 - 1) * worldHalfW
        targets[i * 3 + 1] = (Math.random() * 2 - 1) * worldHalfH
        targets[i * 3 + 2] = (Math.random() * 2 - 1) * SCATTER_DEPTH
      }
    }

    // Live group transform — read fresh every frame. During the break/
    // dissolve range this has already converged to its resting x/scale, but
    // reading it live (instead of once, at whatever transform happened to be
    // active on the frame the viewport was last sampled) is what actually
    // keeps the math correct.
    const gscale = groupMotion.current.scale || 1
    const gx = groupMotion.current.x
    const gy = groupMotion.current.y

    const pos = points.geometry.attributes.position as THREE.BufferAttribute
    const { origins, seeds } = cloud
    const worldTargets = scatterWorldTargets.current
    for (let i = 0; i < BREAK_COUNT; i++) {
      const s = seeds[i]
      // Match hole onset — sparks where armor is already rusting away
            const stagger = THREE.MathUtils.clamp((breakAmt - 0.02 - s * 0.12) / 0.22, 0, 1)
      if (stagger <= 0.001) {
        pos.setXYZ(i, 0, -40, 0)
        continue
      }
      // Newly revealed particles start at their origin on the body (still
      // reads as the body breaking apart); as dissolve climbs they ease out
      // to their fixed viewport-filling target — a real lerp to an exact
      // destination, not an open-ended velocity that may under/overshoot.
      // The target is converted from world space into this group's local
      // space right here, using the CURRENT gx/gy/gscale, so it always lands
      // on the intended screen position no matter how the group has moved.
      const mixRaw = THREE.MathUtils.clamp(stagger * (0.1 + dissolve * 0.9), 0, 1)
      const mix = mixRaw * mixRaw * (3 - 2 * mixRaw)
      const targetLocalX = (worldTargets[i * 3] - gx) / gscale
      const targetLocalY = (worldTargets[i * 3 + 1] - gy) / gscale
      const targetLocalZ = worldTargets[i * 3 + 2] / gscale
      pos.setXYZ(
        i,
        THREE.MathUtils.lerp(origins[i * 3], targetLocalX, mix),
        THREE.MathUtils.lerp(origins[i * 3 + 1], targetLocalY, mix),
        THREE.MathUtils.lerp(origins[i * 3 + 2], targetLocalZ, mix),
      )
    }
    pos.needsUpdate = true
  })
  if (!ashTex) return null

  return (
    <points ref={pointsRef} frustumCulled={false} visible={false} renderOrder={4}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[cloud.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={ashTex}
        vertexColors
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
        size={0.055}
        sizeAttenuation
        opacity={0.95}
        toneMapped={false}
      />
    </points>
  )
}
function attachHeroFx(material: HeroMat) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 }
    shader.uniforms.uEdgeFire = { value: 0 }
    shader.uniforms.uBreak = { value: 0 }
    material.userData.uTime = shader.uniforms.uTime
    material.userData.uEdgeFire = shader.uniforms.uEdgeFire
    material.userData.uBreak = shader.uniforms.uBreak
    material.userData.shader = shader
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        /* glsl */ `
        #include <common>
        uniform float uTime;
        uniform float uEdgeFire;
        uniform float uBreak;
        `,
      ).replace(
        // Early discard so holes cut the armor before lighting is written
        '#include <clipping_planes_fragment>',
        /* glsl */ `
        #include <clipping_planes_fragment>
        if (uBreak > 0.001) {
          vec3 p = vViewPosition * 6.2;
          float n1 = fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
          float n2 = fract(sin(dot(p.yzx * 2.35, vec3(39.346, 11.135, 67.281))) * 23421.631);
          float n3 = fract(sin(dot(p.zxy * 1.7 + gl_FragCoord.xyx * 0.02, vec3(91.2, 14.7, 53.1))) * 58291.417);
          float rust = n1 * 0.42 + n2 * 0.33 + n3 * 0.25;
          float burn = uBreak * 1.25;
          if (rust < burn - 0.08) {
            discard;
          }
        }
        `,
      ).replace(
        '#include <dithering_fragment>',
        /* glsl */ `
        if (uEdgeFire > 0.001) {
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = pow(1.0 - abs(dot(normalize(normal), viewDir)), 2.55);
          float flameBand = smoothstep(0.2, 0.9, fresnel);
          float flameNoise =
            sin(gl_FragCoord.y * 0.08 - uTime * 8.5 + gl_FragCoord.x * 0.02) * 0.5 + 0.5;
          float edgeFire = flameBand * flameNoise * uEdgeFire;
          vec3 fireColor = mix(vec3(1.0, 0.28, 0.02), vec3(1.0, 0.9, 0.35), flameNoise);
          gl_FragColor.rgb += fireColor * edgeFire * 1.15;
        }
// Rusted / burning rim around each hole
        if (uBreak > 0.001) {
          vec3 p = vViewPosition * 6.2;
          float n1 = fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
          float n2 = fract(sin(dot(p.yzx * 2.35, vec3(39.346, 11.135, 67.281))) * 23421.631);
          float n3 = fract(sin(dot(p.zxy * 1.7 + gl_FragCoord.xyx * 0.02, vec3(91.2, 14.7, 53.1))) * 58291.417);
          float rust = n1 * 0.42 + n2 * 0.33 + n3 * 0.25;
          float burn = uBreak * 1.25;
          float rim = smoothstep(burn - 0.08, burn + 0.02, rust) * (1.0 - smoothstep(burn + 0.02, burn + 0.16, rust));
          vec3 rustCol = mix(vec3(0.35, 0.08, 0.02), vec3(1.0, 0.45, 0.1), rim);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, rustCol, rim * 0.95);
          gl_FragColor.rgb += vec3(1.0, 0.35, 0.05) * rim * 0.35 * uBreak;
        }
        #include <dithering_fragment>
        `,
      )
  }
  material.customProgramCacheKey = () => 'ironman-hero-rust-holes-v8'
  material.needsUpdate = true
}
function HeroModel({ scrollProgress }: HeroModelProps) {
  const group = useRef<Group>(null)
  const modelGroup = useRef<Group>(null)
  const yawBones = useRef<THREE.Object3D[]>([])
  const bodyMats = useRef<HeroMat[]>([])
  const glowMats = useRef<
    Array<{
      mat: THREE.MeshStandardMaterial
      baseIntensity: number
      kind: 'lights' | 'chest'
    }>
  >([])
  const { scene } = useGLTF(MODEL_URL, true)

  const model = useMemo(() => cloneSkeleton(scene) as THREE.Group, [scene])
  const motion = useRef({
    y: MODEL_BASE_Y,
        x: 0,
    scale: 1,
    headYaw: 0,
    headPitch: 0,
    glow: 0,
  })
  const layout = useMemo(() => {
    model.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z, 0.001)
    return {
      fitScale: TARGET_HEIGHT / maxDim,
      offset: [-center.x, -center.y, -center.z] as [number, number, number],
    }
  }, [model])

  useLayoutEffect(() => {
    yawBones.current = collectYawBones(model)
    glowMats.current = []
    bodyMats.current = []
    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh) && !(child instanceof THREE.SkinnedMesh)) return
      child.castShadow = true
      child.receiveShadow = true
      child.visible = true
      if (Array.isArray(child.material)) {
        child.material = child.material.map((entry) => entry.clone())
      } else {
        child.material = child.material.clone()
      }
      const materials = Array.isArray(child.material) ? child.material : [child.material]
      for (const material of materials) {
        if (!(material instanceof THREE.MeshStandardMaterial)) continue
        const mat = material as HeroMat
         mat.envMapIntensity = 1.8
        mat.metalness = Math.max(mat.metalness, 0.72)
        mat.roughness = Math.min(Math.max(mat.roughness, 0.32), 0.48)
        mat.transparent = false
        mat.opacity = 1
        mat.visible = true
        attachHeroFx(mat)
        bodyMats.current.push(mat)
        const name = mat.name || ''
        if (isGlowMaterial(name)) {
          const isChest =
            name.toLowerCase().includes('arc') || name.toLowerCase().includes('reactor')
          if (isChest && mat.emissive.getHex() === 0) mat.emissive.set('#e8fcff')
          if (!isChest && mat.emissive.getHex() === 0) mat.emissive.set('#ffffff')
            glowMats.current.push({
            mat,
            baseIntensity: Math.max(mat.emissiveIntensity || 1, 1),
            kind: isChest ? 'chest' : 'lights',
          })
        } else {
          mat.emissive.set(0x000000)
          mat.emissiveIntensity = 0
        }
      }
    })
  }, [model])
  useFrame((_state, delta) => {
    if (!group.current || !modelGroup.current) return
    const t = _state.clock.elapsedTime
    const scroll = scrollProgress.current
    const toSummary = smoothstep(0.05, 0.32, scroll)
    const breakAmt = smoothstep(BREAK_START, BREAK_END, scroll)
    const dissolve = smoothstep(DISSOLVE_START, DISSOLVE_END, scroll)
    const fireEdges = (1 - toSummary) * (1 - breakAmt) * 1.15
    const stageX = THREE.MathUtils.lerp(0, 1.15, toSummary)
    const onMain = 1 - toSummary

    // Interactive mouse head & neck tracking
    // Clamp to ±0.70 so the very extreme edges are still limited,
    // but give plenty of range for a full left/right face turn.
    const rawX = THREE.MathUtils.clamp(_state.pointer.x, -0.70, 0.70)
    const rawY = THREE.MathUtils.clamp(_state.pointer.y, -0.70, 0.70)

    // Proximity fade — head reacts fully within 0.50 units of the face,
    // fades out smoothly toward the screen edges.
    const facePX = 0.0
    const facePY = 0.15
    const dist = Math.sqrt((rawX - facePX) ** 2 + (rawY - facePY) ** 2)
    const proximity = 1 - smoothstep(0.50, 0.85, dist)

    // Strong yaw so the whole face turns left/right; moderate pitch for up/down
    const mouseYaw   =  rawX * 0.90 * proximity * onMain
    const mousePitch = -rawY * 0.55 * proximity * onMain

    // Summary-only framing — main hero stays full size / original height
    const targetScale = THREE.MathUtils.lerp(1, 0.78, toSummary)
    const targetY = MODEL_BASE_Y + toSummary * 0.7

    const targetPitch = (Math.sin(t * 0.9) * 0.08 + mousePitch) * (1 - breakAmt)
    const targetYaw = (-0.55 * toSummary + mouseYaw) * (1 - breakAmt)
    const targetGlow = toSummary * (1 - breakAmt)
    motion.current.headPitch = THREE.MathUtils.damp(
      motion.current.headPitch,
      targetPitch,
       5.2,
      delta,
    )
    motion.current.headYaw = THREE.MathUtils.damp(
      motion.current.headYaw,
      targetYaw, 4.8,
      delta,
    )
    motion.current.glow = THREE.MathUtils.damp(motion.current.glow, targetGlow, 3.5, delta)
    motion.current.y = THREE.MathUtils.damp(motion.current.y, targetY, 1.6, delta)
    motion.current.x = THREE.MathUtils.damp(motion.current.x, stageX, 2.4, delta)
    motion.current.scale = THREE.MathUtils.damp(motion.current.scale, targetScale, 1.8, delta)
    // Fully particles at Skills, then disappear — stay visible until dissolve finishes
group.current.visible = dissolve < 0.998
    group.current.rotation.set(0, 0, 0)
    group.current.position.set(motion.current.x, motion.current.y, 0)
    group.current.scale.setScalar(motion.current.scale)
    modelGroup.current.scale.setScalar(layout.fitScale)
    modelGroup.current.rotation.set(-rawY * 0.05 * proximity * onMain, rawX * 0.08 * proximity * onMain, 0)
    // Mesh gone once fully particulate; particle cloud remains until Skills dissolve
    modelGroup.current.visible = breakAmt < 0.97
    if (breakAmt < 0.55) {
      const yaw = motion.current.headYaw
      const pitch = motion.current.headPitch
      for (const bone of yawBones.current) {
         const weight = bone.name.toLowerCase().includes('neck') ? 0.70 : 1.0
        bone.rotation.y = yaw * weight
        bone.rotation.x = pitch * weight
        bone.rotation.z = 0
      }
    }
     const glow = motion.current.glow
    const pulse = 1 + Math.sin(t * 2.8) * 0.06 * glow
    for (const entry of glowMats.current) {
      const peak = entry.kind === 'chest' ? 2.6 : 2.2
      entry.mat.emissiveIntensity =
        THREE.MathUtils.lerp(entry.baseIntensity * 0.45, peak, glow) *
        pulse *
        (1 - breakAmt * 0.85)
    }
    for (const mat of bodyMats.current) {
      mat.visible = true
      // Keep solid until break; alphaTest helps discarded rust holes stay clean
      const rusting = breakAmt > 0.02
      mat.transparent = false
      mat.opacity = 1
      mat.depthWrite = true
      mat.alphaTest = rusting ? 0.5 : 0
      if (mat.userData.uTime) mat.userData.uTime.value = t
      if (mat.userData.uEdgeFire) mat.userData.uEdgeFire.value = fireEdges
      // Push break hard so holes start with the first particles
      const holeAmt = Math.min(1, Math.pow(Math.max(0, breakAmt), 0.55) * 1.15)
      if (mat.userData.uBreak) mat.userData.uBreak.value = holeAmt
      const shader = mat.userData.shader as
        | { uniforms: { uBreak?: { value: number }; uTime?: { value: number }; uEdgeFire?: { value: number } } }
        | undefined
      if (shader?.uniforms?.uBreak) shader.uniforms.uBreak.value = holeAmt
      if (shader?.uniforms?.uTime) shader.uniforms.uTime.value = t
      if (shader?.uniforms?.uEdgeFire) shader.uniforms.uEdgeFire.value = fireEdges
      if (!isGlowMaterial(mat.name || '')) {
        mat.emissive.set(0x000000)
        mat.emissiveIntensity = 0
      }
    }
  })
  return (
    <group ref={group} dispose={null} position={[0, MODEL_BASE_Y, 0]}>
      <group ref={modelGroup} scale={layout.fitScale}>
        <group position={layout.offset}>
          <primitive object={model} />
        </group>
      </group>
      <BreakCloud scrollProgress={scrollProgress} groupMotion={motion} />
      <Suspense fallback={null}>
        <HeroSmoke scrollProgress={scrollProgress} />
      </Suspense>
    </group>
  )
}
useGLTF.preload(MODEL_URL, true)
function SceneLights() {
  return (
    <>
      <ambientLight intensity={1.6} color="#f5e0e4" />
      <hemisphereLight args={['#ffe8e0', '#5a2028', 1.1]} />
      <directionalLight
        castShadow
        position={[3, 5, 4]}
        intensity={2.8}
        color="#fff5ee"
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-2.5, 2, 2]} intensity={1.1} color="#ff7a8a" />
      <directionalLight position={[4, 2, 2]} intensity={1.8} color="#ffe0d0" />
      <spotLight
        position={[1.8, 4, 5]}
        angle={0.7}
        penumbra={1}
        intensity={14}
        color="#ffe8df"
        distance={20}
      />
      <pointLight position={[2.2, 0.6, 2.2]} intensity={4.0} color="#ff8a9a" distance={10} />
      {/* Extra fill lights to compensate for external HDR reflections */}
      <directionalLight position={[-3, 3, -2]} intensity={0.8} color="#d0e0ff" />
      <directionalLight position={[0, -2, 3]} intensity={0.6} color="#ffe0d0" />
      {/* Extra top fill */}
      <directionalLight position={[0, 6, 3]} intensity={1.2} color="#ffffff" />
    </>
  )
}

type WorldSceneProps = {
  scrollProgress: MutableRefObject<number>
}

export function WorldScene({ scrollProgress }: WorldSceneProps) {
  return (
    <Canvas
      className="world__canvas"
      shadows={false}
      dpr={[1, 1.25]}
      camera={{ position: [0, 0.45, 4.5], fov: 32, near: 0.1, far: 80 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.45,
      }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x000000, 0)
        scene.background = null
      }}
      performance={{ min: 0.5 }}
    >
      <SceneLights />
      <Suspense fallback={null}>
        <HeroModel scrollProgress={scrollProgress} />
      </Suspense>
    </Canvas>
  )
}
export { WorldScene as HeroScene }