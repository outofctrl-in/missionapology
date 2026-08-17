import { useEffect } from 'react'

/**
 * Locks page scroll and iOS rubber-banding for the lifetime of the app.
 * Every scene is exactly viewport-sized, so any scroll is accidental.
 */
export function useScrollLock() {
  useEffect(() => {
    const html = document.documentElement.style
    const body = document.body.style
    const prev = {
      htmlOverflow: html.overflow,
      bodyOverflow: body.overflow,
      overscroll: body.overscrollBehavior,
      touchAction: body.touchAction,
    }

    html.overflow = 'hidden'
    body.overflow = 'hidden'
    body.overscrollBehavior = 'none'
    body.touchAction = 'manipulation'

    const stopGesture = (e: Event) => e.preventDefault()
    document.addEventListener('gesturestart', stopGesture)

    return () => {
      html.overflow = prev.htmlOverflow
      body.overflow = prev.bodyOverflow
      body.overscrollBehavior = prev.overscroll
      body.touchAction = prev.touchAction
      document.removeEventListener('gesturestart', stopGesture)
    }
  }, [])
}
