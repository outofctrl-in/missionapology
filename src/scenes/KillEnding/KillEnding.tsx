import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../../state/GameContext'
import { SPRITES, EXPLOSION_FRAMES } from '../../config/sprites'
import { KILL_ENDING_LINES } from '../../data/dialogue'
import { TIMING } from '../../data/timings'
import { audioManager } from '../../audio/AudioManager'
import { Sprite } from '../../components/Sprite'
import { SpeechBubble } from '../../components/SpeechBubble'
import { JailCell } from '../JailGame/JailCell'
import { Avatar } from '../JailGame/Avatar'
import { wait } from '../HamsterRampage/useHamsterWalk'
import styles from './KillEnding.module.css'

type Step = 'walkIn' | 'stare' | 'bomb' | 'lines' | 'boom' | 'smoke' | 'done'

/**
 * KILL ending — pure cartoon slapstick. The hamster walks in with a bomb,
 * the avatar objects, and the supplied explosion sprites play as a frame
 * sequence. Nobody is actually harmed; it's a puff of smoke and a skull emoji.
 */
export function KillEnding() {
  const { next } = useGame()
  const [step, setStep] = useState<Step>('walkIn')
  const [lineIndex, setLineIndex] = useState(-1)
  const [frame, setFrame] = useState(-1)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      await wait(TIMING.kill.walkIn)
      if (cancelled) return
      setStep('stare')
      await wait(TIMING.kill.stare)
      if (cancelled) return

      setStep('bomb')
      await wait(TIMING.kill.placeBomb)
      if (cancelled) return

      setStep('lines')
      for (let i = 0; i < KILL_ENDING_LINES.length; i += 1) {
        setLineIndex(i)
        await wait(TIMING.kill.lineHold)
        if (cancelled) return
      }
      setLineIndex(-1)

      await wait(TIMING.kill.fuse * 0.4)
      if (cancelled) return

      // BOOM — step through the supplied explosion sprites
      setStep('boom')
      audioManager.play('explosion')
      setFlash(true)
      window.setTimeout(() => setFlash(false), 160)
      for (let i = 0; i < EXPLOSION_FRAMES.length; i += 1) {
        setFrame(i)
        await wait(TIMING.kill.framePerStep)
        if (cancelled) return
      }

      setStep('smoke')
      setFrame(-1)
      await wait(TIMING.kill.settle)
      if (cancelled) return

      setStep('done')
      await wait(700)
      if (cancelled) return
      next()
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [next])

  const avatarGone = step === 'boom' || step === 'smoke' || step === 'done'
  const shakeKey = step === 'boom' ? 99 : 0

  return (
    <div className={styles.scene}>
      <JailCell shakeKey={shakeKey}>
        {!avatarGone && (
          <Avatar
            mood={step === 'lines' ? 'panic' : 'idle'}
            x={39}
            y={94}
            height={54}
            cue={lineIndex}
          />
        )}

        {/* hamster strolls in */}
        <motion.div
          className={styles.hamster}
          initial={{ left: '112%' }}
          animate={{ left: step === 'walkIn' ? '112%' : '58%' }}
          transition={{ duration: TIMING.kill.walkIn / 1000, ease: 'easeInOut' }}
        >
          <Sprite sprite={SPRITES.hamster.left} width="100%" />
        </motion.div>

        {/* the bomb, placed at the avatar's feet */}
        <AnimatePresence>
          {(step === 'bomb' || step === 'lines') && (
            <motion.div
              className={styles.bomb}
              initial={{ scale: 0, y: -30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1, rotate: [0, -4, 4, 0] }}
              exit={{ opacity: 0, scale: 1.4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 16, rotate: { duration: 0.6, repeat: Infinity } }}
            >
              <Sprite sprite={SPRITES.fx.bombLit} width="100%" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* explosion frame sequence */}
        {frame >= 0 && (
          <div className={styles.boom}>
            <Sprite sprite={EXPLOSION_FRAMES[frame]} width="100%" />
          </div>
        )}

        {/* comedy aftermath */}
        <AnimatePresence>
          {(step === 'smoke' || step === 'done') && (
            <motion.div
              className={styles.skull}
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: [0, -10, 0], scale: 1 }}
              transition={{ y: { duration: 2.2, repeat: Infinity }, default: { duration: 0.5 } }}
            >
              <Sprite sprite={SPRITES.fx.skull} width="100%" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.bubbleLayer}>
          <AnimatePresence mode="wait">
            {lineIndex >= 0 && (
              <SpeechBubble key={lineIndex} tone="avatar" tail="down" intensity={2}>
                {KILL_ENDING_LINES[lineIndex]}
              </SpeechBubble>
            )}
          </AnimatePresence>
        </div>
      </JailCell>

      {flash && <div className={styles.flash} />}
    </div>
  )
}
