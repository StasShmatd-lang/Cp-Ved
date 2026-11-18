'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { BrandFooter } from './components/BrandFooter'
import { CrisisCard } from './components/CrisisCard'
import { PrizeWheel } from './components/PrizeWheel'
import { CRISES } from './data/crises'
import './App.css'

const SLICE = 360 / CRISES.length

function pickIndex(exclude?: number) {
  if (CRISES.length <= 1) return 0
  let next = Math.floor(Math.random() * CRISES.length)
  if (exclude !== undefined) {
    let guard = 0
    while (next === exclude && guard < 8) {
      next = Math.floor(Math.random() * CRISES.length)
      guard += 1
    }
  }
  return next
}

/** Pointer at top (−90° in SVG); segment i is centered at i*SLICE + SLICE/2 */
function rotationForIndex(index: number, turns: number, current: number) {
  const center = index * SLICE + SLICE / 2
  const targetMod = (360 - center) % 360
  const currentMod = ((current % 360) + 360) % 360
  let delta = targetMod - currentMod
  if (delta <= 0) delta += 360
  return current + turns * 360 + delta
}

export default function App() {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [showCard, setShowCard] = useState(false)
  const [hall, setHall] = useState(false)
  const [hasSpun, setHasSpun] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const spin = useCallback(() => {
    if (spinning) return
    setShowCard(false)
    setSpinning(true)
    const index = pickIndex(selected ?? undefined)
    const turns = 4 + Math.floor(Math.random() * 3)
    setRotation((r) => rotationForIndex(index, turns, r))

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => {
      setSelected(index)
      setSpinning(false)
      setHasSpun(true)
      setShowCard(true)
    }, 4200)
  }, [selected, spinning])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    const onFs = () => {
      setHall(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const toggleHall = async () => {
    const el = rootRef.current
    if (!el) return
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen()
        setHall(true)
      } else {
        await document.exitFullscreen()
        setHall(false)
      }
    } catch {
      setHall((h) => !h)
    }
  }

  const crisis = selected !== null ? CRISES[selected] : null

  return (
    <div ref={rootRef} className={`app ${hall ? 'is-hall' : ''}`}>
      <div className="app-atmosphere" aria-hidden />
      <header className="app-header">
        <img className="app-logo" src="/brand/logo.png" alt="Shmidt" width={200} height={112} />
        <div className="app-titles">
          <h1 className="app-title">Кризис-лототрон</h1>
          <p className="app-sub">Крути — получай сценарий ЧП и шаги «что делать»</p>
        </div>
        <button type="button" className="btn-ghost" onClick={toggleHall}>
          {hall ? 'Выйти из зала' : 'Режим зала'}
        </button>
      </header>

      <main className="app-main">
        <section className="wheel-panel">
          <PrizeWheel rotation={rotation} spinning={spinning} />
          <div className="cta-row">
            <button
              type="button"
              className="btn-spin"
              onClick={spin}
              disabled={spinning}
            >
              {spinning ? 'Крутим…' : hasSpun ? 'Ещё раз' : 'Крутить'}
            </button>
          </div>
        </section>

        <section className="card-panel" aria-label="Карточка кризиса">
          {crisis && showCard ? (
            <CrisisCard crisis={crisis} visible={showCard} />
          ) : (
            <div className="card-placeholder">
              <p className="card-placeholder__kicker">Готово к запуску</p>
              <p className="card-placeholder__text">
                Нажми «Крутить» — колесо выбросит одну из 11 кризисных ситуаций
                с коротким планом действий.
              </p>
            </div>
          )}
        </section>
      </main>

      <BrandFooter />
    </div>
  )
}
