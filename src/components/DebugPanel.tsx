import { useState } from 'react'
import { useGame } from '../state/GameContext'
import { SCENE_IDS, SCENE_LABELS } from '../state/scenes'
import styles from './DebugPanel.module.css'

/** Development-only. Never rendered in a production build (see useDebugMode). */
export function DebugPanel() {
  const { scene, apology, ending, goToScene, setApology, reset } = useGame()
  const [collapsed, setCollapsed] = useState(false)

  if (collapsed) {
    return (
      <button type="button" className={styles.reopen} onClick={() => setCollapsed(false)}>
        DEBUG
      </button>
    )
  }

  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <span>DEBUG · shift+D</span>
        <span className={styles.meta}>
          {apology}% {ending ? `· ${ending}` : ''}
        </span>
        <button type="button" className={styles.x} onClick={() => setCollapsed(true)}>
          ×
        </button>
      </div>

      <div className={styles.row}>
        {SCENE_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className={id === scene ? styles.on : undefined}
            onClick={() => goToScene(id)}
          >
            {SCENE_LABELS[id]}
          </button>
        ))}
      </div>

      <div className={styles.row}>
        <button type="button" onClick={() => setApology(0)}>
          meter 0
        </button>
        <button type="button" onClick={() => setApology(100)}>
          meter 100
        </button>
        <button type="button" className={styles.danger} onClick={reset}>
          reset game
        </button>
      </div>
    </div>
  )
}
