import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../../state/GameContext'
import { SPRITES } from '../../config/sprites'
import { Sprite } from '../../components/Sprite'
import { audioManager } from '../../audio/AudioManager'
import styles from './EndingChoice.module.css'

/** Hold this long (ms) to commit — stops a dramatic choice being a mis-tap. */
const HOLD_MS = 900

interface HoldButtonProps {
  variant: 'kill' | 'free'
  label: string
  sublabel: string
  onCommit: () => void
}

function HoldButton({ variant, label, sublabel, onCommit }: HoldButtonProps) {
  const [progress, setProgress] = useState(0)
  const raf = useRef<number | undefined>(undefined)
  const start = useRef(0)
  const done = useRef(false)

  const tick = useCallback(() => {
    const elapsed = performance.now() - start.current
    const p = Math.min(1, elapsed / HOLD_MS)
    setProgress(p)
    if (p >= 1) {
      if (!done.current) {
        done.current = true
        audioManager.play('success')
        onCommit()
      }
      return
    }
    raf.current = requestAnimationFrame(tick)
  }, [onCommit])

  const begin = useCallback(() => {
    if (done.current) return
    start.current = performance.now()
    raf.current = requestAnimationFrame(tick)
  }, [tick])

  const cancel = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current)
    if (!done.current) setProgress(0)
  }, [])

  return (
    <button
      type="button"
      className={`${styles.choice} ${styles[variant]}`}
      onPointerDown={begin}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') begin()
      }}
      onKeyUp={cancel}
      aria-label={`${label} — press and hold`}
    >
      <span className={styles.fill} style={{ transform: `scaleX(${progress})` }} />
      <span className={styles.choiceText}>
        <span className={styles.choiceLabel}>{label}</span>
        <span className={styles.choiceSub}>{progress > 0 ? 'keep holding…' : sublabel}</span>
      </span>
    </button>
  )
}

/** SCENE 5 — the verdict. */
export function EndingChoice() {
  const { chooseEnding, goToScene } = useGame()

  const commit = useCallback(
    (ending: 'kill' | 'free') => {
      chooseEnding(ending)
      goToScene(ending === 'kill' ? 'KILL_ENDING' : 'FREE_ENDING')
    },
    [chooseEnding, goToScene],
  )

  return (
    <div className={styles.scene}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className={styles.kicker}>Apology level: 100%</p>
        <h1 className={`${styles.title} caption`}>The verdict is yours, Didi</h1>
      </motion.div>

      <motion.div
        className={styles.judge}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, y: [0, -6, 0] }}
        transition={{ scale: { type: 'spring', stiffness: 300, damping: 18 }, y: { duration: 2.4, repeat: Infinity } }}
      >
        <Sprite sprite={SPRITES.hamster.front} width="100%" />
      </motion.div>

      <motion.div
        className={styles.choices}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.45 }}
      >
        <HoldButton
          variant="kill"
          label="KILL HER 💣"
          sublabel="hold to detonate"
          onCommit={() => commit('kill')}
        />
        <HoldButton
          variant="free"
          label="FREE HER ❤️"
          sublabel="hold to forgive"
          onCommit={() => commit('free')}
        />
      </motion.div>

      <p className={styles.footnote}>press and hold — no accidents allowed</p>
    </div>
  )
}
