import { motion } from 'framer-motion'
import { useGame } from '../../state/GameContext'
import { LETTER } from '../../data/letter'
import { TIMING } from '../../data/timings'
import { SPRITES } from '../../config/sprites'
import { Sprite } from '../../components/Sprite'
import { PixelButton } from '../../components/PixelButton'
import styles from './ApologyLetter.module.css'

/** SCENE 6 — a coded paper card, not an image. */
export function ApologyLetter() {
  const { next } = useGame()
  const stagger = TIMING.letter.lineStagger / 1000

  return (
    <div className={styles.scene}>
      <motion.article
        className={styles.paper}
        initial={{ opacity: 0, y: 40, rotate: -2.5, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, rotate: -1.2, scale: 1 }}
        transition={{ type: 'spring', stiffness: 130, damping: 18 }}
      >
        <div className={styles.tape} />

        <motion.h1
          className={styles.greeting}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          {LETTER.greeting}
        </motion.h1>

        <div className={styles.body}>
          {LETTER.paragraphs.map((paragraph, i) => (
            <motion.p
              key={i}
              className={styles.para}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * stagger, duration: 0.4 }}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        <motion.p
          className={styles.signature}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 + LETTER.paragraphs.length * stagger }}
        >
          {LETTER.signature}
        </motion.p>

        <motion.div
          className={styles.stamp}
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 8 }}
          transition={{ delay: 0.9 + LETTER.paragraphs.length * stagger, type: 'spring', stiffness: 260 }}
        >
          <Sprite sprite={SPRITES.poop.heart} width="100%" />
        </motion.div>
      </motion.article>

      <motion.div
        className={styles.cta}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 + LETTER.paragraphs.length * stagger }}
      >
        <PixelButton size="lg" variant="safe" block onClick={next}>
          {LETTER.cta}
        </PixelButton>
      </motion.div>
    </div>
  )
}
