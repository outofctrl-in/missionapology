import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../../state/GameContext'
import { SPRITES, JAIL_REGIONS } from '../../config/sprites'
import { ASSETS, assetUrl } from '../../config/assets'
import { artRegionStyle, regionBox } from '../../components/ArtRegion'
import { TIMING } from '../../data/timings'
import { audioManager } from '../../audio/AudioManager'
import { Sprite } from '../../components/Sprite'
import { SpeechBubble } from '../../components/SpeechBubble'
import { JailCell } from '../JailGame/JailCell'
import { Avatar } from '../JailGame/Avatar'
import { wait } from '../HamsterRampage/useHamsterWalk'
import styles from './FreeEnding.module.css'

type Step = 'locked' | 'unlocking' | 'open' | 'walking' | 'done'

/** FREE ending — the door opens, the avatar walks out, the hamster allows it. */
export function FreeEnding() {
  const { next } = useGame()
  const [step, setStep] = useState<Step>('locked')
  const [line, setLine] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      await wait(420)
      if (cancelled) return

      setStep('unlocking')
      audioManager.play('jailDoor')
      await wait(TIMING.free.unlock)
      if (cancelled) return

      setStep('open')
      setLine('…really?')
      await wait(TIMING.free.doorOpen)
      if (cancelled) return

      setStep('walking')
      setLine('THANK YOU DIDI')
      await wait(TIMING.free.walkOut)
      if (cancelled) return

      setLine(null)
      setStep('done')
      await wait(TIMING.free.hold)
      if (cancelled) return
      next()
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [next])

  const doorOpen = step !== 'locked' && step !== 'unlocking'
  const walking = step === 'walking' || step === 'done'

  return (
    <div className={styles.scene}>
      <JailCell>
        {/* Dark opening revealed once the door is out of the way. */}
        <div className={styles.opening} style={regionBox(JAIL_REGIONS.door)} />

        {/*
          The door itself: the real barred door lifted straight out of the
          jail painting, hinged on its left edge so it can swing open.
        */}
        <motion.div
          className={styles.door}
          style={{
            ...regionBox(JAIL_REGIONS.door),
            ...artRegionStyle(assetUrl(ASSETS.jail.path), JAIL_REGIONS.door),
          }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: doorOpen ? -74 : 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        />

        {/* unlock sparkle */}
        <AnimatePresence>
          {step === 'unlocking' && (
            <motion.div
              className={styles.sparkle}
              initial={{ scale: 0, opacity: 0, rotate: -40 }}
              animate={{ scale: [0.4, 1.3, 1], opacity: [0, 1, 0], rotate: 30 }}
              transition={{ duration: 0.8 }}
            >
              <Sprite sprite={SPRITES.fx.star} width="100%" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className={styles.avatarLayer}
          animate={{ x: walking ? '46%' : '0%', opacity: step === 'done' ? 0 : 1 }}
          transition={{ x: { duration: TIMING.free.walkOut / 1000, ease: 'easeInOut' }, opacity: { duration: 0.5 } }}
        >
          <Avatar mood={step === 'open' ? 'free' : 'idle'} x={39} y={94} height={54} />
        </motion.div>

        <div className={styles.hamster}>
          <Sprite sprite={SPRITES.hamster.front} width="100%" />
        </div>

        <AnimatePresence>
          {step === 'done' && (
            <motion.div
              className={styles.heart}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, y: [0, -14, 0] }}
              transition={{ y: { duration: 2, repeat: Infinity }, default: { duration: 0.4 } }}
            >
              <Sprite sprite={SPRITES.poop.heart} width="100%" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.bubbleLayer}>
          <AnimatePresence mode="wait">
            {line && (
              <SpeechBubble key={line} tone="avatar" tail="down" intensity={1}>
                {line}
              </SpeechBubble>
            )}
          </AnimatePresence>
        </div>
      </JailCell>
    </div>
  )
}
