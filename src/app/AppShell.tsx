import { Suspense, lazy, useCallback, useRef } from 'react'
import { useGame } from '../state/GameContext'
import { useDebugMode } from '../hooks/useDebugMode'
import { audioManager } from '../audio/AudioManager'
import { SceneTransition } from '../components/SceneTransition'
import { MuteButton } from '../components/MuteButton'
import { SCENE_REGISTRY, SCENE_TRANSITIONS } from '../scenes/registry'
import styles from './AppShell.module.css'

/*
 * Loaded through a dev-only dynamic import. `import.meta.env.DEV` is replaced
 * with `false` at build time, so the whole branch — and the debug panel's code
 * with it — is dropped from the production bundle rather than merely hidden.
 */
const DebugPanel = import.meta.env.DEV
  ? lazy(() => import('../components/DebugPanel').then((m) => ({ default: m.DebugPanel })))
  : null

export function AppShell() {
  const { scene } = useGame()
  const isDebug = useDebugMode()
  const audioUnlocked = useRef(false)

  // Browsers only allow programmatic audio after a real gesture.
  const unlockAudio = useCallback(() => {
    if (audioUnlocked.current) return
    audioUnlocked.current = true
    audioManager.unlock()
  }, [])

  const Scene = SCENE_REGISTRY[scene]

  return (
    <div className={styles.shell} onPointerDown={unlockAudio}>
      <main className={styles.frame}>
        <SceneTransition sceneKey={scene} kind={SCENE_TRANSITIONS[scene]}>
          <Scene />
        </SceneTransition>
        <MuteButton />
      </main>
      {isDebug && DebugPanel && (
        <Suspense fallback={null}>
          <DebugPanel />
        </Suspense>
      )}
    </div>
  )
}
