import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ASSETS, assetUrl } from '../../config/assets'
import { Stage } from '../../components/Stage'
import styles from './JailCell.module.css'

interface JailCellProps {
  /** Camera shake trigger — bump this to re-fire the shake. */
  shakeKey?: number
  children?: ReactNode
  /** Extra dimming for cinematic beats. */
  dim?: number
}

/**
 * The supplied jail artwork is landscape (731x555), so on a portrait phone it
 * is centred as a "diorama" with the surrounding UI filling the letterbox
 * instead of being stretched or cropped past the cell door.
 */
export function JailCell({ shakeKey = 0, children, dim = 0 }: JailCellProps) {
  return (
    <motion.div
      className={styles.frame}
      key={shakeKey}
      animate={shakeKey > 0 ? { x: [0, -8, 7, -5, 4, 0], y: [0, 4, -3, 2, 0] } : undefined}
      transition={{ duration: 0.42, ease: 'easeOut' }}
    >
      <Stage artWidth={ASSETS.jail.width} artHeight={ASSETS.jail.height} fit="contain">
        <img
          className={styles.art}
          src={assetUrl(ASSETS.jail.path)}
          alt="Pixel-art jail cell"
          draggable={false}
        />
        {children}
        {dim > 0 && <div className={styles.dim} style={{ opacity: dim }} />}
      </Stage>
    </motion.div>
  )
}
