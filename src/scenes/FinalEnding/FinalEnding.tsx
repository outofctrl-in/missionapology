import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../../state/GameContext'
import { ASSETS, assetUrl } from '../../config/assets'
import { SPRITES } from '../../config/sprites'
import { FINAL_ENDING_LINES } from '../../data/dialogue'
import { useBeats } from '../../hooks/useBeats'
import { Sprite } from '../../components/Sprite'
import { PixelButton } from '../../components/PixelButton'
import styles from './FinalEnding.module.css'

/**
 * SCENE 7 — everyone together. Didi (crowned), my avatar, the hamster and the
 * shark slippers, each idling on their own little loop.
 */
export function FinalEnding() {
  const { reset, ending } = useGame()
  const [showButton, setShowButton] = useState(false)

  const beat = useBeats([1500, 1500, 1700, 1800], () => setShowButton(true))

  return (
    <div className={styles.scene}>
      <div className={styles.sky} />

      {/* drifting sparkles */}
      {[12, 30, 52, 74, 88].map((left, i) => (
        <span key={left} className={styles.twinkle} style={{ left: `${left}%`, ['--d' as string]: `${i * 0.7}s` }}>
          <Sprite sprite={SPRITES.fx.star} width="100%" />
        </span>
      ))}

      <div className={styles.cast}>
        {/* Didi — crowned, hugging her hamster */}
        <motion.div
          className={styles.didi}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: [0, -7, 0], opacity: 1 }}
          transition={{ y: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.6 } }}
        >
          <Sprite sprite={SPRITES.didi.hugHamster} width="100%" />
          <span className={styles.crownSparkle}>
            <Sprite sprite={SPRITES.fx.star} width="100%" />
          </span>
        </motion.div>

        {/* me, waving */}
        <motion.div
          className={styles.avatar}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1, rotate: [0, 2.5, -2.5, 0] }}
          transition={{
            rotate: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
            default: { duration: 0.6, delay: 0.15 },
          }}
        >
          <img src={assetUrl(ASSETS.avatar.path)} alt="My pixel avatar" draggable={false} />
        </motion.div>

        {/* the hamster, bouncing */}
        <motion.div
          className={styles.hamster}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: [0, -16, 0] }}
          transition={{
            y: { duration: 0.85, repeat: Infinity, ease: 'easeInOut' },
            default: { type: 'spring', stiffness: 260, delay: 0.3 },
          }}
        >
          <Sprite sprite={SPRITES.hamster.front} width="100%" />
        </motion.div>
      </div>

      {/* the shark slippers, bobbing along the bottom */}
      <motion.div
        className={styles.sharks}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: [0, -5, 0], opacity: 1 }}
        transition={{ y: { duration: 3.1, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.8, delay: 0.4 } }}
      >
        <img src={assetUrl(ASSETS.sharkSlippers.path)} alt="The shark slippers" draggable={false} />
      </motion.div>

      <div className={styles.captions}>
        <AnimatePresence mode="wait">
          {beat < FINAL_ENDING_LINES.length && (
            <motion.p
              key={beat}
              className={`${styles.caption} caption`}
              initial={{ opacity: 0, scale: 1.2, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              {FINAL_ENDING_LINES[beat]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showButton && (
          <motion.div
            className={styles.footer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className={styles.epilogue}>
              {ending === 'kill'
                ? 'she did explode me. worth it.'
                : 'she let me live. legend.'}
            </p>
            <PixelButton variant="ghost" size="sm" onClick={reset}>
              ↺ play again
            </PixelButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
