import { motion } from 'framer-motion'
import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  label: string
  value: number
  max?: number
  /** Number of chunky segments — reads as a retro game bar rather than a web meter. */
  segments?: number
}

export function ProgressBar({ label, value, max = 100, segments = 20 }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value / max))
  const filled = Math.round(pct * segments)

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <span className={styles.label}>{label}</span>
        <motion.span
          key={Math.round(value)}
          className={styles.value}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 18 }}
        >
          {Math.round(value)}%
        </motion.span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        {Array.from({ length: segments }, (_, i) => (
          <span
            key={i}
            className={`${styles.cell} ${i < filled ? styles.on : ''}`}
            style={{ ['--i' as string]: i }}
          />
        ))}
      </div>
    </div>
  )
}
