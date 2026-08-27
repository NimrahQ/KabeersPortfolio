import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'

type SceneLoaderProps = {
  onReady?: () => void
}

export function SceneLoader({ onReady }: SceneLoaderProps) {
  const { active, progress, loaded, total, item } = useProgress()
  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)
  const [minTimeDone, setMinTimeDone] = useState(false)
  const pct = Math.min(100, Math.round(progress))
  const done = !active && pct >= 99

  useEffect(() => {
    const id = window.setTimeout(() => setMinTimeDone(true), 700)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    if (!done || !minTimeDone || exiting || !visible) return
    setExiting(true)
    const id = window.setTimeout(() => {
      setVisible(false)
      onReady?.()
    }, 480)
    return () => window.clearTimeout(id)
  }, [done, minTimeDone, exiting, visible, onReady])

  if (!visible) return null

  const label =
    total > 0
      ? `Loading model · ${Math.min(loaded, total)}/${total}`
      : item
        ? 'Fetching assets…'
        : 'Preparing scene…'

  return (
    <div
      className={`scene-loader${exiting ? ' scene-loader--exit' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy={!done}
    >
      <div className="scene-loader__panel">
        <p className="scene-loader__eyebrow">Syed Kabeer Ahmed</p>
        <p className="scene-loader__title">Armoring up</p>
        <div className="scene-loader__track" aria-hidden="true">
          <div className="scene-loader__fill" style={{ width: `${done ? 100 : pct}%` }} />
        </div>
        <div className="scene-loader__meta">
          <span>{label}</span>
          <span>{done ? 100 : pct}%</span>
        </div>
      </div>
    </div>
  )
}
