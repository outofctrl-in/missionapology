import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../../state/GameContext'
import { ASSETS, assetUrl } from '../../config/assets'
import { POOP_VARIANTS } from '../../config/sprites'
import {
  DESK_ENTRY,
  DESK_HOME,
  DESK_HOTSPOTS,
  MAX_POOPS,
  type Hotspot,
} from '../../data/hotspots'
import { RAMPAGE_ACTIONS, RAMPAGE_GOAL, type RampageActionId } from '../../data/actions'
import { HAMSTER_HANDOVER, HAMSTER_INTRO_LINES, HAMSTER_OUTRO_LINES } from '../../data/dialogue'
import { TIMING } from '../../data/timings'
import { audioManager } from '../../audio/AudioManager'
import { Stage } from '../../components/Stage'
import { Sprite } from '../../components/Sprite'
import { SpeechBubble } from '../../components/SpeechBubble'
import { ActionMenu } from '../../components/ActionMenu'
import { Hamster } from './Hamster'
import { DeskObject } from './DeskObject'
import { clampToDesk, useHamsterWalk, wait, type Point } from './useHamsterWalk'
import styles from './HamsterRampage.module.css'

type Phase = 'opening' | 'monologue' | 'play' | 'outro'

const ART = ASSETS.workstation

export function HamsterRampage() {
  const { next, poops, addPoop, removedObjects, removeObject, rampageCount, countRampage } = useGame()
  const hamster = useHamsterWalk()
  const { walkTo, teleport, setAct, setFacing } = hamster

  const [phase, setPhase] = useState<Phase>('opening')
  const [line, setLine] = useState<string | null>(null)
  const [action, setAction] = useState<RampageActionId | null>(null)
  const [busy, setBusy] = useState(false)
  const [activeObject, setActiveObject] = useState<{ id: string; kind: 'chewing' | 'stealing' } | null>(null)
  const [hop, setHop] = useState(false)

  const dropPoop = useCallback(
    (at: Point) => {
      addPoop({
        id: Date.now() + Math.random(),
        x: at.x,
        y: at.y,
        scale: 0.8 + Math.random() * 0.55,
        rotation: -12 + Math.random() * 24,
        variant: Math.floor(Math.random() * POOP_VARIANTS.length),
      })
      audioManager.play('poop')
    },
    [addPoop],
  )

  /*
   * Opening cinematic: walk on, look around, poop, wander off, talk.
   * Guarded only by `cancelled` — a "have I started?" ref would deadlock
   * under StrictMode, whose first pass is immediately cancelled.
   */
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      teleport(DESK_ENTRY)
      await wait(220)
      if (cancelled) return

      await walkTo(DESK_HOME)
      if (cancelled) return

      // look around
      setFacing('front')
      await wait(TIMING.rampage.lookAround)
      if (cancelled) return
      setFacing('left')
      await wait(360)
      if (cancelled) return
      setFacing('right')
      await wait(360)
      if (cancelled) return

      // ...and just casually poops
      setFacing('front')
      setAct('poop')
      await wait(TIMING.rampage.autoPoop)
      if (cancelled) return
      dropPoop({ x: DESK_HOME.x - 6, y: DESK_HOME.y + 1 })
      setAct('idle')
      await wait(500)
      if (cancelled) return

      // walks away like nothing happened
      await walkTo({ x: DESK_HOME.x + 22, y: DESK_HOME.y - 2 })
      if (cancelled) return

      setPhase('monologue')
      for (const l of HAMSTER_INTRO_LINES) {
        setLine(l)
        await wait(TIMING.rampage.lineHold)
        if (cancelled) return
      }
      setLine(HAMSTER_HANDOVER)
      await wait(TIMING.rampage.lineHold)
      if (cancelled) return
      setLine(null)
      setPhase('play')
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [walkTo, teleport, setAct, setFacing, dropPoop])

  // ---- the rampage ends once Didi has done enough damage ----
  useEffect(() => {
    if (phase !== 'play' || rampageCount < RAMPAGE_GOAL) return

    let cancelled = false
    const run = async () => {
      setPhase('outro')
      setAction(null)
      await walkTo({ x: 50, y: 84 })
      if (cancelled) return
      setFacing('front')
      await wait(420)
      if (cancelled) return
      setAct('evil')
      for (const l of HAMSTER_OUTRO_LINES) {
        setLine(l)
        await wait(TIMING.rampage.outroHold)
        if (cancelled) return
      }
      next()
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [phase, rampageCount, walkTo, setAct, setFacing, next])

  // ---- POOP: tap the desk, hamster walks over, deposits ----
  const handleStageTap = useCallback(
    async (point: Point) => {
      if (phase !== 'play' || action !== 'poop' || busy) return
      if (poops.length >= MAX_POOPS) return

      setBusy(true)
      const target = clampToDesk(point)
      await walkTo(target)
      setFacing('front')
      setAct('poop')
      await wait(TIMING.rampage.autoPoop)
      dropPoop({ x: target.x - 4, y: target.y + 1 })
      setAct('idle')
      countRampage()
      setBusy(false)
    },
    [phase, action, busy, poops.length, walkTo, setFacing, setAct, dropPoop, countRampage],
  )

  // ---- CHEW / STEAL: tap a highlighted object ----
  const handleObjectSelect = useCallback(
    async (hotspot: Hotspot) => {
      if (busy || phase !== 'play') return
      setBusy(true)

      await walkTo(hotspot.foot)
      if (hotspot.reachUp) {
        setHop(true)
        await wait(260)
      }

      if (hotspot.kind === 'chew') {
        setAct('chew')
        setActiveObject({ id: hotspot.id, kind: 'chewing' })
        audioManager.play('chew')
        await wait(TIMING.rampage.chew)
      } else {
        setAct('steal')
        setActiveObject({ id: hotspot.id, kind: 'stealing' })
        audioManager.play('steal')
        await wait(TIMING.rampage.steal)
      }

      removeObject(hotspot.id)
      setActiveObject(null)
      setHop(false)
      setAct('idle')
      setLine(hotspot.quip)
      countRampage()
      await wait(1100)
      setLine(null)
      setBusy(false)
    },
    [busy, phase, walkTo, setAct, removeObject, countRampage],
  )

  const objectState = useCallback(
    (hotspot: Hotspot): 'idle' | 'selectable' | 'chewing' | 'stealing' | 'gone' => {
      if (removedObjects.includes(hotspot.id)) return 'gone'
      if (activeObject?.id === hotspot.id) return activeObject.kind
      if (phase === 'play' && !busy && action === hotspot.kind) return 'selectable'
      return 'idle'
    },
    [removedObjects, activeObject, phase, busy, action],
  )

  const currentAction = RAMPAGE_ACTIONS.find((a) => a.id === action)
  const hint =
    phase !== 'play'
      ? ''
      : busy
        ? '…'
        : currentAction
          ? currentAction.hint
          : `Pick a crime · ${rampageCount}/${RAMPAGE_GOAL}`

  return (
    <div className={styles.scene}>
      {/*
        The desk is shown CONTAINED, never cropped: every object Didi can
        attack lives at the far left/right edges of the artwork, and `cover`
        on a 9:16 phone would slice ~30% of the picture (and those objects)
        straight off.
      */}
      <div className={styles.stageArea}>
        <Stage
          artWidth={ART.width}
          artHeight={ART.height}
          fit="contain"
          onStageTap={handleStageTap}
          className={action === 'poop' && phase === 'play' && !busy ? styles.aiming : undefined}
        >
        <img className={styles.desk} src={assetUrl(ART.path)} alt="Pixel-art workstation" draggable={false} />

        {DESK_HOTSPOTS.map((hotspot) => (
          <DeskObject
            key={hotspot.id}
            hotspot={hotspot}
            state={objectState(hotspot)}
            onSelect={handleObjectSelect}
          />
        ))}

        {poops.map((p) => (
          <motion.div
            key={p.id}
            className={styles.poop}
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${5 * p.scale}%` }}
            initial={{ scale: 0, y: -30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1, rotate: p.rotation }}
            transition={{ type: 'spring', stiffness: 420, damping: 18 }}
          >
            <Sprite sprite={POOP_VARIANTS[p.variant]} width="100%" />
          </motion.div>
        ))}

          <Hamster
            x={hamster.pos.x}
            y={hamster.pos.y}
            facing={hamster.facing}
            act={hamster.act}
            moveDuration={hamster.moveDuration}
            hop={hop}
          />
        </Stage>

        <div className={styles.bubbleLayer}>
          <AnimatePresence mode="wait">
            {line && (
              <SpeechBubble
                key={line}
                tone={phase === 'outro' ? 'villain' : 'default'}
                tail="down"
                intensity={phase === 'outro' ? 2 : 0}
              >
                {line}
              </SpeechBubble>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* darkening for the outro */}
      <AnimatePresence>
        {phase === 'outro' && (
          <motion.div
            className={styles.darken}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.72 }}
            transition={{ duration: 1.1 }}
          />
        )}
      </AnimatePresence>

      {phase === 'play' && (
        <div className={styles.deck}>
          <ActionMenu
            items={RAMPAGE_ACTIONS.map((a) => ({
              id: a.id,
              label: a.label,
              disabled: a.id === 'poop' ? poops.length >= MAX_POOPS : allGone(a.id, removedObjects),
            }))}
            activeId={action}
            onSelect={(id) => setAction((prev) => (prev === id ? null : (id as RampageActionId)))}
            hint={hint}
            disabled={busy}
          />
        </div>
      )}
    </div>
  )
}

function allGone(actionId: string, removed: string[]): boolean {
  if (actionId === 'poop') return false
  return DESK_HOTSPOTS.filter((h) => h.kind === actionId).every((h) => removed.includes(h.id))
}
