import { motion } from 'framer-motion'
import type { TargetAndTransition, Transition } from 'framer-motion'
import { SPRITES } from '../../config/sprites'
import { Sprite } from '../../components/Sprite'
import styles from './Hamster.module.css'

export type Facing = 'left' | 'right' | 'front' | 'back'
export type HamsterAct = 'idle' | 'walk' | 'chew' | 'steal' | 'poop' | 'evil'

interface HamsterProps {
  x: number
  y: number
  facing: Facing
  act: HamsterAct
  /** Seconds the current move should take. */
  moveDuration: number
  /** Rendered width as a % of the stage artwork. */
  size?: number
  hop?: boolean
}

const POSE = {
  left: SPRITES.hamster.left,
  right: SPRITES.hamster.right,
  front: SPRITES.hamster.front,
  back: SPRITES.hamster.back,
} as const

const ACT_ANIMATION: Record<HamsterAct, TargetAndTransition> = {
  walk: { y: [0, -3, 0, -3, 0], rotate: [0, -1.5, 0, 1.5, 0] },
  chew: { x: [0, -2, 2, -2, 2, 0], scaleY: [1, 0.93, 1.05, 1] },
  poop: { scaleY: [1, 0.86, 1.06, 1], scaleX: [1, 1.1, 0.96, 1] },
  steal: { rotate: [0, -12, 8, 0], y: [0, -6, 0] },
  evil: { scale: [1, 1.12, 1.05], rotate: [0, -3, 3, 0] },
  idle: { y: [0, -2, 0] },
}

const ACT_TRANSITION: Record<HamsterAct, Transition> = {
  walk: { duration: 0.34, repeat: Infinity, ease: 'linear' },
  chew: { duration: 0.5, ease: 'easeOut' },
  poop: { duration: 0.5, ease: 'easeOut' },
  steal: { duration: 0.5, ease: 'easeOut' },
  evil: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
  idle: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
}

export function Hamster({ x, y, facing, act, moveDuration, size = 15, hop = false }: HamsterProps) {
  const sprite = act === 'evil' ? SPRITES.hamster.curled : POSE[facing]

  return (
    /*
     * The walk itself is a plain CSS transition rather than a JS animation:
     * it's the one movement the game's timing depends on (scene code awaits
     * the walk duration), so it should be driven by the compositor and not by
     * per-frame React work. The inner element still uses motion for the
     * transform-only squash/bob flourishes.
     */
    <div
      className={styles.wrap}
      style={{
        width: `${size}%`,
        left: `${x}%`,
        top: `${y}%`,
        transition: `left ${moveDuration}s linear, top ${moveDuration}s linear`,
      }}
    >
      <motion.div
        animate={hop && act === 'idle' ? { y: [0, -26, 0] } : ACT_ANIMATION[act]}
        transition={hop && act === 'idle' ? { duration: 0.5, ease: 'easeOut' } : ACT_TRANSITION[act]}
      >
        <Sprite sprite={sprite} width="100%" />
      </motion.div>
      <span className={styles.shadow} />
    </div>
  )
}
