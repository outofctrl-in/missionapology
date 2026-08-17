import { useEffect } from 'react'

/**
 * Keeps --app-height pinned to the real visible viewport height.
 *
 * On mobile, `100vh` (and even `100dvh` on some browsers) can report a
 * height taller than what's actually on screen while the URL bar is
 * showing — the page is sized as if the bar were gone. Combined with
 * scroll-lock, that leaves whatever sits at the bottom of a scene (the
 * action deck, a button) rendered below the fold with no way to reach it:
 * the game looks frozen even though it's just off-screen.
 *
 * This measures the real thing — `visualViewport.height` where available,
 * falling back to `innerHeight` — and re-measures whenever the browser
 * chrome shows/hides or the device rotates.
 */
export function useViewportHeight() {
  useEffect(() => {
    const setHeight = () => {
      const height = window.visualViewport?.height ?? window.innerHeight
      document.documentElement.style.setProperty('--app-height', `${height}px`)
    }

    setHeight()

    window.addEventListener('resize', setHeight)
    window.addEventListener('orientationchange', setHeight)
    window.visualViewport?.addEventListener('resize', setHeight)

    return () => {
      window.removeEventListener('resize', setHeight)
      window.removeEventListener('orientationchange', setHeight)
      window.visualViewport?.removeEventListener('resize', setHeight)
    }
  }, [])
}
