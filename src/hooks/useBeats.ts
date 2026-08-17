import { useEffect, useRef, useState } from 'react'

/**
 * Drives a cinematic sequence: returns the current beat index, advancing
 * through `delays` one step at a time. Beat 0 starts immediately; beat i+1
 * arrives `delays[i]` ms later. Calls `onDone` after the final delay.
 *
 *   const beat = useBeats([1200, 800, 1500], () => next())
 *   {beat >= 1 && <Thing />}
 */
export function useBeats(delays: number[], onDone?: () => void, active = true) {
  const [beat, setBeat] = useState(0)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  // Re-running on every render would restart the sequence, so the delay list is
  // captured by length + joined value rather than identity.
  const key = delays.join(',')

  useEffect(() => {
    if (!active) return
    setBeat(0)
    const timers: number[] = []
    let elapsed = 0
    delays.forEach((delay, i) => {
      elapsed += delay
      timers.push(window.setTimeout(() => setBeat(i + 1), elapsed))
    })
    timers.push(window.setTimeout(() => doneRef.current?.(), elapsed))
    return () => timers.forEach(window.clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, active])

  return beat
}

/** Runs `fn` once after `ms`, cancelling if the component unmounts or deps change. */
export function useTimeout(fn: () => void, ms: number | null) {
  const ref = useRef(fn)
  ref.current = fn
  useEffect(() => {
    if (ms === null) return
    const t = window.setTimeout(() => ref.current(), ms)
    return () => window.clearTimeout(t)
  }, [ms])
}
