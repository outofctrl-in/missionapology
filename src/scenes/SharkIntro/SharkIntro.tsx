import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../../state/GameContext'
import { ASSETS, assetUrl } from '../../config/assets'
import { TIMING } from '../../data/timings'
import styles from './SharkIntro.module.css'

type Phase = 'black' | 'gate' | 'playing' | 'held' | 'out'

/**
 * SCENE 1 — the crying shark, full bleed, no chrome.
 *
 * Black -> fade in -> play -> hold the last frame -> fade to black -> scene 2.
 * Autoplay is attempted muted (the only form browsers reliably allow); if even
 * that is refused we show a quiet "tap to begin".
 */
export function SharkIntro() {
  const { next } = useGame()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [phase, setPhase] = useState<Phase>('black')
  const [needsTap, setNeedsTap] = useState(false)
  const advanced = useRef(false)

  const advance = useCallback(() => {
    if (advanced.current) return
    advanced.current = true
    setPhase('out')
    window.setTimeout(next, TIMING.intro.blackPause)
  }, [next])

  // Try to start playback as soon as we mount. Muted is the only form of
  // autoplay browsers reliably allow; if even that is refused we show a gate.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    void video
      .play()
      .then(() => setPhase('playing'))
      .catch(() => {
        setPhase('gate')
        setNeedsTap(true)
      })
  }, [])

  const startFromTap = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    setNeedsTap(false)
    // A real gesture is in hand, so sound is allowed this time.
    video.muted = false
    void video
      .play()
      .then(() => setPhase('playing'))
      .catch(() => {
        video.muted = true
        void video.play().then(() => setPhase('playing'))
      })
  }, [])

  const handleEnded = useCallback(() => {
    setPhase('held')
    window.setTimeout(advance, TIMING.intro.holdLastFrame)
  }, [advance])

  return (
    <div className={styles.scene} onPointerUp={needsTap ? startFromTap : undefined}>
      <video
        ref={videoRef}
        className={`${styles.video} ${phase === 'black' ? styles.hidden : ''}`}
        src={assetUrl(ASSETS.sharkCryingVideo.path)}
        playsInline
        autoPlay
        muted
        preload="auto"
        onEnded={handleEnded}
      />

      {/* Fades the whole scene up from, and back down to, pure black. */}
      <motion.div
        className={styles.veil}
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'black' || phase === 'out' ? 1 : 0 }}
        transition={{
          duration: phase === 'out' ? 0.55 : TIMING.intro.fadeIn / 1000,
          ease: 'easeInOut',
        }}
      />

      <AnimatePresence>
        {needsTap && (
          <motion.div
            className={styles.tapGate}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className={styles.tapLabel}>tap to begin</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
