import type { CSSProperties, ReactNode, PointerEvent as ReactPointerEvent } from 'react'
import { useCallback, useRef } from 'react'
import styles from './Stage.module.css'

interface StageProps {
  /** Intrinsic size of the artwork this stage is built around. */
  artWidth: number
  artHeight: number
  /** 'cover' fills the screen and crops; 'contain' fits the whole artwork in. */
  fit?: 'cover' | 'contain'
  children: ReactNode
  className?: string
  style?: CSSProperties
  /** Reports taps in the artwork's own % coordinate space. */
  onStageTap?: (point: { x: number; y: number }) => void
}

/**
 * Reproduces the artwork's coordinate space on screen, so anything positioned
 * with `left: X%; top: Y%` inside it stays glued to the same spot in the
 * picture at every viewport size. This is what lets the desk hotspots line up
 * with the objects painted into the workstation image.
 */
export function Stage({
  artWidth,
  artHeight,
  fit = 'cover',
  children,
  className,
  style,
  onStageTap,
}: StageProps) {
  const innerRef = useRef<HTMLDivElement>(null)

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!onStageTap || !innerRef.current) return
      const rect = innerRef.current.getBoundingClientRect()
      onStageTap({
        x: ((event.clientX - rect.left) / rect.width) * 100,
        y: ((event.clientY - rect.top) / rect.height) * 100,
      })
    },
    [onStageTap],
  )

  return (
    <div className={`${styles.viewport} ${className ?? ''}`} style={style}>
      <div
        ref={innerRef}
        className={`${styles.inner} ${fit === 'cover' ? styles.cover : styles.contain}`}
        style={
          {
            aspectRatio: `${artWidth} / ${artHeight}`,
            '--art-aspect': artWidth / artHeight,
          } as CSSProperties
        }
        onPointerUp={handlePointerUp}
      >
        {children}
      </div>
    </div>
  )
}
