import { useEffect, useState } from 'react'

const STORAGE_KEY = 'mission-apology:debug'

/** Debug tooling is stripped from production builds entirely. */
export const DEBUG_AVAILABLE = import.meta.env.DEV

function initial(): boolean {
  if (!DEBUG_AVAILABLE) return false
  const params = new URLSearchParams(window.location.search)
  if (params.get('debug') === '1') return true
  if (params.get('debug') === '0') return false
  return window.sessionStorage.getItem(STORAGE_KEY) === '1'
}

/**
 * On in development when `?debug=1` is in the URL or Shift+D is pressed.
 * Always off in a production build.
 */
export function useDebugMode(): boolean {
  const [on, setOn] = useState(initial)

  useEffect(() => {
    if (!DEBUG_AVAILABLE) return
    window.sessionStorage.setItem(STORAGE_KEY, on ? '1' : '0')
  }, [on])

  useEffect(() => {
    if (!DEBUG_AVAILABLE) return
    const onKey = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === 'd') setOn((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return DEBUG_AVAILABLE && on
}
