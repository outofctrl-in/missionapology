import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { TIMING } from '../data/timings'
import styles from './SceneTransition.module.css'

export type TransitionKind = 'fade' | 'black' | 'zoom' | 'slide' | 'dissolve' | 'glitch'

interface SceneTransitionProps {
  /** Changing this swaps the content with the current transition. */
  sceneKey: string
  kind?: TransitionKind
  children: ReactNode
}

/**
 * Swaps scenes behind a full-screen wipe. Content is only exchanged at the
 * midpoint (when the wipe is fully opaque), so the next scene never pops in
 * half-mounted.
 */
export function SceneTransition({ sceneKey, kind = 'black', children }: SceneTransitionProps) {
  const [shown, setShown] = useState({ key: sceneKey, node: children })
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const [activeKind, setActiveKind] = useState<TransitionKind>(kind)
  const latest = useRef(children)
  latest.current = children

  useEffect(() => {
    if (sceneKey === shown.key) {
      setShown({ key: sceneKey, node: children })
      return
    }

    setActiveKind(kind)
    setPhase('out')

    const half = TIMING.sceneFade
    const swap = window.setTimeout(() => {
      setShown({ key: sceneKey, node: latest.current })
      setPhase('in')
    }, half)
    const done = window.setTimeout(() => setPhase('idle'), half * 2)

    return () => {
      window.clearTimeout(swap)
      window.clearTimeout(done)
    }
    // Only the scene key drives a transition; `children` is read via ref at swap time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneKey])

  return (
    <div className={styles.root}>
      <div className={styles.content} key={shown.key}>
        {shown.node}
      </div>
      <div
        className={[styles.veil, styles[activeKind], phase !== 'idle' ? styles.armed : '', styles[phase]]
          .filter(Boolean)
          .join(' ')}
        aria-hidden="true"
      />
    </div>
  )
}
