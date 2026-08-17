import type { CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ASSETS, assetUrl } from '../../config/assets'
import { artRegionStyle, regionBox } from '../../components/ArtRegion'
import type { Hotspot } from '../../data/hotspots'
import styles from './DeskObject.module.css'

const DESK_URL = assetUrl(ASSETS.workstation.path)

/** How far the erase patch extends past the object, as a fraction of its size. */
const OVERSCAN = 0.14

interface DeskObjectProps {
  hotspot: Hotspot
  state: 'idle' | 'selectable' | 'chewing' | 'stealing' | 'gone'
  onSelect?: (hotspot: Hotspot) => void
}

export function DeskObject({ hotspot, state, onSelect }: DeskObjectProps) {
  const box: CSSProperties = regionBox(hotspot)

  const removed = state === 'gone'
  const leaving = state === 'chewing' || state === 'stealing'

  return (
    <>
      {/* Erase patch: sits under the object and outlives it. */}
      {(removed || leaving) && (
        <div
          className={styles.patch}
          aria-hidden="true"
          style={{
            left: `${hotspot.x - hotspot.w * OVERSCAN}%`,
            top: `${hotspot.y - hotspot.h * OVERSCAN}%`,
            width: `${hotspot.w * (1 + OVERSCAN * 2)}%`,
            height: `${hotspot.h * (1 + OVERSCAN * 2)}%`,
            background: hotspot.patchColor,
          }}
        />
      )}

      <AnimatePresence>
        {!removed && (
          <motion.div
            className={styles.object}
            style={{ ...box, ...artRegionStyle(DESK_URL, hotspot) }}
            aria-hidden="true"
            initial={false}
            animate={
              state === 'chewing'
                ? { x: [0, -3, 3, -2, 2, 0], rotate: [0, -4, 4, -3, 0], scale: [1, 1.04, 0.96, 1] }
                : { x: 0, rotate: 0, scale: 1 }
            }
            transition={
              state === 'chewing'
                ? { duration: 0.42, repeat: 2, ease: 'linear' }
                : { duration: 0.2 }
            }
            exit={
              state === 'stealing'
                ? {
                    x: '260%',
                    y: '90%',
                    scale: 0.15,
                    rotate: 420,
                    opacity: 0,
                    transition: { duration: 0.55, ease: 'easeIn' },
                  }
                : { scale: 0.2, opacity: 0, rotate: -25, transition: { duration: 0.35 } }
            }
          />
        )}
      </AnimatePresence>

      {state === 'selectable' && (
        <button
          type="button"
          className={styles.target}
          style={box}
          aria-label={hotspot.label}
          onPointerUp={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onSelect?.(hotspot)
          }}
        >
          <span className={styles.marker} />
        </button>
      )}
    </>
  )
}
