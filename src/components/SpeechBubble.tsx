import { motion } from 'framer-motion'
import type { TargetAndTransition } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import styles from './SpeechBubble.module.css'

interface SpeechBubbleProps {
  children: ReactNode
  /** Which way the little tail points. */
  tail?: 'left' | 'right' | 'down' | 'none'
  /** 0 calm · 1 excited · 2 shouting (bigger, shaking, heavier outline). */
  intensity?: 0 | 1 | 2
  tone?: 'default' | 'villain' | 'avatar'
  className?: string
  style?: CSSProperties
}

const shakeByIntensity: Record<0 | 1 | 2, TargetAndTransition | undefined> = {
  0: undefined,
  1: { x: [0, -1.5, 1.5, -1, 0], transition: { duration: 0.35, delay: 0.18 } },
  2: { x: [0, -4, 4, -3, 3, 0], transition: { duration: 0.45, delay: 0.16 } },
}

export function SpeechBubble({
  children,
  tail = 'down',
  intensity = 0,
  tone = 'default',
  className,
  style,
}: SpeechBubbleProps) {
  return (
    <motion.div
      className={[styles.bubble, styles[`tone_${tone}`], styles[`tail_${tail}`], styles[`i${intensity}`], className]
        .filter(Boolean)
        .join(' ')}
      style={style}
      initial={{ scale: 0.6, opacity: 0, y: 8 }}
      animate={{
        scale: 1,
        opacity: 1,
        y: 0,
        ...(shakeByIntensity[intensity] ?? {}),
      }}
      exit={{ scale: 0.85, opacity: 0, transition: { duration: 0.16 } }}
      transition={{ type: 'spring', stiffness: 520, damping: 22, mass: 0.7 }}
    >
      {children}
    </motion.div>
  )
}
