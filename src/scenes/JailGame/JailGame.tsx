import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../../state/GameContext'
import { SPRITES } from '../../config/sprites'
import { TORTURE_ACTIONS, METER_GOAL, type TortureActionId } from '../../data/actions'
import { AVATAR_BARKS, JAIL_SENTENCE_LINES, METER_COMPLETE_LINES } from '../../data/dialogue'
import { TIMING } from '../../data/timings'
import { audioManager } from '../../audio/AudioManager'
import { Sprite } from '../../components/Sprite'
import { SpeechBubble } from '../../components/SpeechBubble'
import { ProgressBar } from '../../components/ProgressBar'
import { ActionMenu } from '../../components/ActionMenu'
import { JailCell } from './JailCell'
import { Avatar, type AvatarMood } from './Avatar'
import { wait } from '../HamsterRampage/useHamsterWalk'
import styles from './JailGame.module.css'

type Phase = 'intro' | 'sentence' | 'play' | 'complete'

/** Positions inside the jail artwork, in %. */
const AVATAR_SPOT = { x: 39, y: 94 }
const HAMSTER_HOME = { x: 72, y: 97 }
const HAMSTER_ATTACK = { x: 52, y: 96 }

const MOOD_BY_ACTION: Record<TortureActionId, AvatarMood> = {
  bonk: 'bonk',
  poop: 'splat',
  lolly: 'sad',
  sorry: 'sorry',
  compliment: 'sorry',
  beg: 'beg',
}

export function JailGame() {
  const { next, apology, addApology, tortureUses, recordTortureUse } = useGame()

  const [phase, setPhase] = useState<Phase>('intro')
  const [sentenceIndex, setSentenceIndex] = useState(-1)
  const [completeIndex, setCompleteIndex] = useState(-1)
  const [shake, setShake] = useState(0)
  const [doorShut, setDoorShut] = useState(false)

  const [mood, setMood] = useState<AvatarMood>('idle')
  const [moodCue, setMoodCue] = useState(0)
  const [avatarLine, setAvatarLine] = useState<string | null>(null)
  const [hamsterX, setHamsterX] = useState(HAMSTER_HOME.x)
  const [hamsterVisible, setHamsterVisible] = useState(false)
  const [fx, setFx] = useState<{ id: number; kind: TortureActionId } | null>(null)
  const [lollyGone, setLollyGone] = useState(false)
  const [busy, setBusy] = useState(false)

  const complete = apology >= METER_GOAL

  // ---------------------------------------------------------- intro beats
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      await wait(TIMING.jail.avatarDrop)
      if (cancelled) return
      setHamsterVisible(true)
      await wait(TIMING.jail.hamsterWalkIn)
      if (cancelled) return

      setDoorShut(true)
      audioManager.play('jailDoor')
      setShake((s) => s + 1)
      await wait(TIMING.jail.doorSlam)
      if (cancelled) return

      setPhase('sentence')
      for (let i = 0; i < JAIL_SENTENCE_LINES.length; i += 1) {
        setSentenceIndex(i)
        await wait(TIMING.jail.sentenceLine)
        if (cancelled) return
      }
      setSentenceIndex(-1)
      setPhase('play')
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [])

  // ------------------------------------------------- meter hits 100 -> out
  useEffect(() => {
    if (phase !== 'play' || !complete) return

    let cancelled = false
    const run = async () => {
      setPhase('complete')
      setAvatarLine(null)
      setMood('panic')
      for (let i = 0; i < METER_COMPLETE_LINES.length; i += 1) {
        setCompleteIndex(i)
        await wait(TIMING.jail.completeLine)
        if (cancelled) return
      }
      await wait(400)
      if (cancelled) return
      next()
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [phase, complete, next])

  // ------------------------------------------------------------- actions
  const runAction = useCallback(
    async (id: string) => {
      if (busy || phase !== 'play') return
      const action = TORTURE_ACTIONS.find((a) => a.id === id)
      if (!action) return

      setBusy(true)
      recordTortureUse(action.id)
      audioManager.play(action.sound)

      const physical = action.id === 'bonk' || action.id === 'poop' || action.id === 'lolly'
      if (physical) {
        setHamsterX(HAMSTER_ATTACK.x)
        await wait(420)
      }

      setFx({ id: Date.now(), kind: action.id })
      setMood(MOOD_BY_ACTION[action.id])
      setMoodCue((c) => c + 1)
      if (action.id === 'lolly') setLollyGone(true)
      if (action.id === 'bonk') setShake((s) => s + 1)

      setAvatarLine(action.avatarLine)
      addApology(action.gain)

      await wait(TIMING.jail.actionAnim)
      if (physical) setHamsterX(HAMSTER_HOME.x)

      // occasional extra outburst
      if (Math.random() < 0.45) {
        setAvatarLine(AVATAR_BARKS[Math.floor(Math.random() * AVATAR_BARKS.length)])
        await wait(TIMING.jail.barkDuration * 0.6)
      }

      setAvatarLine(null)
      setMood('idle')
      setFx(null)
      setBusy(false)
    },
    [busy, phase, recordTortureUse, addApology],
  )

  const bigLine =
    phase === 'sentence' && sentenceIndex >= 0
      ? JAIL_SENTENCE_LINES[sentenceIndex]
      : phase === 'complete' && completeIndex >= 0
        ? METER_COMPLETE_LINES[completeIndex]
        : null

  return (
    <div className={styles.scene}>
      <header className={styles.meterBar}>
        <ProgressBar label="How sorry is she?" value={apology} />
      </header>

      <JailCell shakeKey={shake} dim={phase === 'complete' ? 0.25 : 0}>
        {/*
          The door is already painted shut in the artwork, so the "slam" is a
          flash over the doorway plus the camera shake, rather than a second
          door drawn on top of the real one.
        */}
        <AnimatePresence>
          {doorShut && (
            <motion.div
              className={styles.doorFlash}
              initial={{ opacity: 0.85 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>

        <motion.div
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Avatar mood={mood} cue={moodCue} x={AVATAR_SPOT.x} y={AVATAR_SPOT.y} height={54} />
        </motion.div>

        {/* Didi's lollipop, lifted off the didi sprite sheet */}
        <AnimatePresence>
          {!lollyGone && (
            <motion.div
              className={styles.lolly}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
              exit={{ x: 220, y: 90, rotate: 540, opacity: 0, transition: { duration: 0.5 } }}
              transition={{ y: { duration: 2.2, repeat: Infinity }, default: { duration: 0.3 } }}
            >
              <Sprite sprite={SPRITES.didi.lollipop} width="100%" />
            </motion.div>
          )}
        </AnimatePresence>

        {hamsterVisible && (
          <motion.div
            className={styles.hamster}
            initial={{ left: '112%' }}
            animate={{ left: `${hamsterX}%` }}
            transition={{ duration: 0.75, ease: 'easeInOut' }}
          >
            <Sprite sprite={SPRITES.hamster.left} width="100%" />
          </motion.div>
        )}

        {/* per-action effects */}
        <AnimatePresence>
          {fx?.kind === 'bonk' && (
            <motion.div
              key={fx.id}
              className={styles.impact}
              initial={{ scale: 0.2, opacity: 0, rotate: -20 }}
              animate={{ scale: [0.4, 1.25, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 0.7 }}
            >
              <Sprite sprite={SPRITES.fx.bang} width="100%" />
            </motion.div>
          )}
          {fx?.kind === 'poop' && (
            <motion.div
              key={fx.id}
              className={styles.fallingPoop}
              initial={{ top: '8%', opacity: 0, rotate: 0 }}
              animate={{ top: '58%', opacity: 1, rotate: 380 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: 'easeIn' }}
            >
              <Sprite sprite={SPRITES.poop.mediumKawaii} width="100%" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* avatar speech */}
        <div className={styles.avatarBubble}>
          <AnimatePresence mode="wait">
            {avatarLine && (
              <SpeechBubble key={avatarLine} tone="avatar" tail="down" intensity={1}>
                {avatarLine}
              </SpeechBubble>
            )}
          </AnimatePresence>
        </div>
      </JailCell>

      {/* big cinematic captions */}
      <AnimatePresence mode="wait">
        {bigLine && (
          <motion.div
            key={bigLine}
            className={styles.bigLine}
            initial={{ opacity: 0, scale: 1.25 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.32 }}
          >
            <span className="caption">{bigLine}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className={styles.deck}>
        {phase === 'play' ? (
          <ActionMenu
            columns={2}
            items={TORTURE_ACTIONS.map((a) => ({
              id: a.id,
              label: a.label,
              disabled: a.maxUses !== undefined && (tortureUses[a.id] ?? 0) >= a.maxUses,
            }))}
            onSelect={runAction}
            hint={busy ? '…' : 'Choose her punishment'}
            disabled={busy}
          />
        ) : (
          <div className={styles.deckSpacer} />
        )}
      </footer>
    </div>
  )
}
