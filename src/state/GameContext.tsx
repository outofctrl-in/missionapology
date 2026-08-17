import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import { NEXT_SCENE, SCENE_IDS, type SceneId } from './scenes'
import { METER_GOAL, type TortureActionId } from '../data/actions'

export type Ending = 'kill' | 'free' | null

export interface PoopMark {
  id: number
  /** % coordinates in the desk artwork's own space. */
  x: number
  y: number
  scale: number
  rotation: number
  variant: number
}

export interface GameState {
  scene: SceneId
  /** 0-100 */
  apology: number
  ending: Ending
  /** Desk objects the hamster has destroyed or stolen. */
  removedObjects: string[]
  poops: PoopMark[]
  /** How many rampage actions Didi has performed. */
  rampageCount: number
  /** Uses per torture action, for the once-only ones. */
  tortureUses: Partial<Record<TortureActionId, number>>
  muted: boolean
}

const INITIAL: GameState = {
  scene: 'INTRO',
  apology: 0,
  ending: null,
  removedObjects: [],
  poops: [],
  rampageCount: 0,
  tortureUses: {},
  muted: false,
}

type Action =
  | { type: 'GO_TO'; scene: SceneId }
  | { type: 'NEXT' }
  | { type: 'ADD_APOLOGY'; amount: number }
  | { type: 'SET_APOLOGY'; value: number }
  | { type: 'CHOOSE_ENDING'; ending: Exclude<Ending, null> }
  | { type: 'REMOVE_OBJECT'; id: string }
  | { type: 'ADD_POOP'; poop: PoopMark }
  | { type: 'COUNT_RAMPAGE' }
  | { type: 'USE_TORTURE'; id: TortureActionId }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'RESET' }

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'GO_TO':
      return state.scene === action.scene ? state : { ...state, scene: action.scene }
    case 'NEXT': {
      const next = NEXT_SCENE[state.scene]
      return next ? { ...state, scene: next } : state
    }
    case 'ADD_APOLOGY':
      return { ...state, apology: Math.min(METER_GOAL, state.apology + action.amount) }
    case 'SET_APOLOGY':
      return { ...state, apology: Math.max(0, Math.min(METER_GOAL, action.value)) }
    case 'CHOOSE_ENDING':
      return { ...state, ending: action.ending }
    case 'REMOVE_OBJECT':
      return state.removedObjects.includes(action.id)
        ? state
        : { ...state, removedObjects: [...state.removedObjects, action.id] }
    case 'ADD_POOP':
      return { ...state, poops: [...state.poops, action.poop] }
    case 'COUNT_RAMPAGE':
      return { ...state, rampageCount: state.rampageCount + 1 }
    case 'USE_TORTURE':
      return {
        ...state,
        tortureUses: {
          ...state.tortureUses,
          [action.id]: (state.tortureUses[action.id] ?? 0) + 1,
        },
      }
    case 'TOGGLE_MUTE':
      return { ...state, muted: !state.muted }
    case 'RESET':
      return INITIAL
    default:
      return state
  }
}

const STORAGE_KEY = 'mission-apology:save'

function loadSaved(): GameState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<GameState>
    if (!parsed.scene || !SCENE_IDS.includes(parsed.scene)) return null
    return { ...INITIAL, ...parsed }
  } catch {
    return null
  }
}

interface GameValue extends GameState {
  goToScene: (scene: SceneId) => void
  next: () => void
  addApology: (amount: number) => void
  setApology: (value: number) => void
  chooseEnding: (ending: Exclude<Ending, null>) => void
  removeObject: (id: string) => void
  addPoop: (poop: PoopMark) => void
  countRampage: () => void
  recordTortureUse: (id: TortureActionId) => void
  toggleMute: () => void
  reset: () => void
}

const GameContext = createContext<GameValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  /*
   * Saved progress is read in the reducer's lazy initialiser rather than in a
   * mount effect. An effect would land AFTER the first commit's save-effect,
   * which would have already written a brand new game over the stored one.
   */
  const [state, dispatch] = useReducer(reducer, INITIAL, (fallback) => loadSaved() ?? fallback)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* private mode / quota — progress just won't persist */
    }
  }, [state])

  /*
   * These are wrapped individually rather than rebuilt inside the useMemo:
   * scenes run long async cutscenes from useEffect, and an action whose
   * identity changed on every state update would restart those sequences
   * mid-play. `dispatch` is stable, so all of these are too.
   */
  const goToScene = useCallback((scene: SceneId) => dispatch({ type: 'GO_TO', scene }), [])
  const next = useCallback(() => dispatch({ type: 'NEXT' }), [])
  const addApology = useCallback((amount: number) => dispatch({ type: 'ADD_APOLOGY', amount }), [])
  const setApology = useCallback((value: number) => dispatch({ type: 'SET_APOLOGY', value }), [])
  const chooseEnding = useCallback(
    (ending: Exclude<Ending, null>) => dispatch({ type: 'CHOOSE_ENDING', ending }),
    [],
  )
  const removeObject = useCallback((id: string) => dispatch({ type: 'REMOVE_OBJECT', id }), [])
  const addPoop = useCallback((poop: PoopMark) => dispatch({ type: 'ADD_POOP', poop }), [])
  const countRampage = useCallback(() => dispatch({ type: 'COUNT_RAMPAGE' }), [])
  const recordTortureUse = useCallback(
    (id: TortureActionId) => dispatch({ type: 'USE_TORTURE', id }),
    [],
  )
  const toggleMute = useCallback(() => dispatch({ type: 'TOGGLE_MUTE' }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  const value = useMemo<GameValue>(
    () => ({
      ...state,
      goToScene,
      next,
      addApology,
      setApology,
      chooseEnding,
      removeObject,
      addPoop,
      countRampage,
      recordTortureUse,
      toggleMute,
      reset,
    }),
    [
      state,
      goToScene,
      next,
      addApology,
      setApology,
      chooseEnding,
      removeObject,
      addPoop,
      countRampage,
      recordTortureUse,
      toggleMute,
      reset,
    ],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame(): GameValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>')
  return ctx
}
