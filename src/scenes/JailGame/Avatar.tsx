import { motion } from 'framer-motion'
import type { TargetAndTransition, Transition } from 'framer-motion'
import { ASSETS, assetUrl } from '../../config/assets'
import styles from './Avatar.module.css'

export type AvatarMood = 'idle' | 'bonk' | 'splat' | 'sad' | 'beg' | 'sorry' | 'panic' | 'free'

interface AvatarProps {
  mood: AvatarMood
  /** Position inside the jail artwork, in %. */
  x: number
  y: number
  /** Height as a % of the jail artwork. */
  height?: number
  /** Bumped to replay the current mood's animation. */
  cue?: number
}

const MOOD_ANIMATION: Record<AvatarMood, TargetAndTransition> = {
  idle: { y: [0, -2, 0], rotate: 0, scaleY: 1, scaleX: 1 },
  bonk: { y: [0, 10, 0], scaleY: [1, 0.72, 1.08, 1], scaleX: [1, 1.25, 0.95, 1], rotate: [0, -6, 5, 0] },
  splat: { y: [0, 6, 0], scaleY: [1, 0.85, 1], rotate: [0, 3, -3, 0] },
  sad: { y: [0, 3, 0], rotate: [0, -2, 2, 0], scaleY: [1, 0.96, 1] },
  beg: { y: [0, -4, 0, -4, 0], scaleY: [1, 0.9, 1, 0.9, 1] },
  sorry: { y: [0, 2, 0], rotate: [0, -1.5, 1.5, 0] },
  panic: { x: [0, -5, 5, -4, 4, 0], rotate: [0, -4, 4, 0] },
  free: { y: [0, -14, 0], scaleY: [1, 1.06, 1] },
}

const MOOD_TRANSITION: Partial<Record<AvatarMood, Transition>> = {
  idle: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
  panic: { duration: 0.4, repeat: 3, ease: 'linear' },
  beg: { duration: 0.7, repeat: 2, ease: 'easeInOut' },
}

export function Avatar({ mood, x, y, height = 52, cue = 0 }: AvatarProps) {
  return (
    <motion.div
      className={styles.wrap}
      style={{ left: `${x}%`, top: `${y}%`, height: `${height}%` }}
      key={`${mood}-${cue}`}
      animate={MOOD_ANIMATION[mood]}
      transition={MOOD_TRANSITION[mood] ?? { duration: 0.55, ease: 'easeOut' }}
    >
      <img
        className={styles.img}
        src={assetUrl(ASSETS.avatar.path)}
        alt="My pixel bobble-head avatar, in jail"
        draggable={false}
      />
      <span className={styles.shadow} />
    </motion.div>
  )
}
