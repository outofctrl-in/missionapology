import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../../state/GameContext'
import { ASSETS, assetUrl } from '../../config/assets'
import { SHARK_DIALOGUE } from '../../data/dialogue'
import { TIMING } from '../../data/timings'
import { SpeechBubble } from '../../components/SpeechBubble'
import { Tears } from './Tears'
import styles from './SharkDialogue.module.css'

/**
 * SCENE 2 — the two shark slippers talk.
 *
 * The dialogue is NOT baked into the artwork: the supplied photo is the
 * backdrop and every line is a coded speech bubble anchored over the slipper
 * that's speaking. Tapping skips ahead.
 */
export function SharkDialogue() {
  const { next } = useGame()
  const [index, setIndex] = useState(0)
  const [finished, setFinished] = useState(false)

  const line = SHARK_DIALOGUE[index]
  const crying = SHARK_DIALOGUE.slice(0, index + 1).some((l) => l.crying)

  const advance = useCallback(() => {
    setIndex((i) => {
      if (i >= SHARK_DIALOGUE.length - 1) {
        setFinished(true)
        return i
      }
      return i + 1
    })
  }, [])

  // Auto-advance on each line's own hold time.
  useEffect(() => {
    if (finished) return
    const t = window.setTimeout(advance, line.hold)
    return () => window.clearTimeout(t)
  }, [index, line.hold, advance, finished])

  // The punchline lands, beat of silence, then the glitch cut to the hamster.
  useEffect(() => {
    if (!finished) return
    const t = window.setTimeout(next, TIMING.dialogue.punchlineHold)
    return () => window.clearTimeout(t)
  }, [finished, next])

  return (
    <div className={styles.scene} onPointerUp={advance}>
      {/* Slow push-in keeps a still photo feeling alive. */}
      <motion.img
        className={styles.backdrop}
        src={assetUrl(ASSETS.sharkSlippers.path)}
        alt="Two shark slippers facing each other"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 24, ease: 'linear' }}
        draggable={false}
      />

      <div className={styles.vignette} />

      {/* Tears are coded elements pinned over the left slipper's eye. */}
      <Tears active={crying} />

      {/* The speaking slipper gets a little bounce. */}
      <motion.div
        className={styles.speakerCueLeft}
        animate={line.speaker === 'left' ? { y: [0, -8, 0] } : { y: 0 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
      />
      <motion.div
        className={styles.speakerCueRight}
        animate={line.speaker === 'right' ? { y: [0, -8, 0] } : { y: 0 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
      />

      <div className={styles.bubbleLayer}>
        <AnimatePresence mode="wait">
          <SpeechBubble
            key={index}
            tail={line.speaker === 'left' ? 'left' : 'right'}
            intensity={line.intensity ?? 0}
            className={line.speaker === 'left' ? styles.bubbleLeft : styles.bubbleRight}
          >
            {line.text}
          </SpeechBubble>
        </AnimatePresence>
      </div>

      <div className={styles.progress}>
        {SHARK_DIALOGUE.map((_, i) => (
          <span key={i} className={i <= index ? styles.dotOn : styles.dot} />
        ))}
      </div>
    </div>
  )
}
