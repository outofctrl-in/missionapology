import { useCallback, useRef, useState } from 'react'
import { DESK_ENTRY, DESK_WALK_BOUNDS } from '../../data/hotspots'
import { TIMING } from '../../data/timings'
import type { Facing, HamsterAct } from './Hamster'

export interface Point {
  x: number
  y: number
}

export function clampToDesk(p: Point): Point {
  const b = DESK_WALK_BOUNDS
  return {
    x: Math.min(b.maxX, Math.max(b.minX, p.x)),
    y: Math.min(b.maxY, Math.max(b.minY, p.y)),
  }
}

/**
 * Owns the hamster's position/pose. `walkTo` resolves when the walk finishes,
 * so scene sequences can be written as plain async code.
 */
export function useHamsterWalk() {
  const [pos, setPos] = useState<Point>(DESK_ENTRY)
  const [facing, setFacing] = useState<Facing>('left')
  const [act, setAct] = useState<HamsterAct>('idle')
  const [moveDuration, setMoveDuration] = useState(0)
  const posRef = useRef<Point>(DESK_ENTRY)

  const walkTo = useCallback((target: Point): Promise<void> => {
    const from = posRef.current
    const distance = Math.hypot(target.x - from.x, target.y - from.y)
    const seconds = Math.max(0.28, distance / TIMING.rampage.walkSpeedPercentPerSecond)

    posRef.current = target
    if (Math.abs(target.x - from.x) > 0.6) setFacing(target.x < from.x ? 'left' : 'right')
    setMoveDuration(seconds)
    setAct('walk')
    setPos(target)

    return new Promise((resolve) => {
      window.setTimeout(() => {
        setAct('idle')
        resolve()
      }, seconds * 1000)
    })
  }, [])

  /** Jump straight to a spot with no walk animation. */
  const teleport = useCallback((target: Point) => {
    posRef.current = target
    setMoveDuration(0)
    setPos(target)
  }, [])

  return { pos, facing, act, moveDuration, walkTo, teleport, setAct, setFacing, posRef }
}

/** Promise-based pause for scene choreography. */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}
