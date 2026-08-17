import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { GameProvider } from '../state/GameContext'
import { useScrollLock } from '../hooks/useScrollLock'
import { useViewportHeight } from '../hooks/useViewportHeight'
import { audioManager } from '../audio/AudioManager'
import { AppShell } from './AppShell'

/**
 * `reducedMotion="user"` makes every framer animation honour the visitor's
 * OS "reduce motion" setting — they still see each beat, just without the
 * movement. `?nomotion=1` forces it on, which is handy for grabbing static
 * screenshots of a scene's final composition.
 */
function reducedMotionSetting(): 'user' | 'always' {
  if (typeof window === 'undefined') return 'user'
  return new URLSearchParams(window.location.search).get('nomotion') === '1' ? 'always' : 'user'
}

export default function App() {
  useScrollLock()
  useViewportHeight()

  useEffect(() => {
    audioManager.init()
  }, [])

  return (
    <MotionConfig reducedMotion={reducedMotionSetting()}>
      <GameProvider>
        <AppShell />
      </GameProvider>
    </MotionConfig>
  )
}
