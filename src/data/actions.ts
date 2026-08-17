/** Action definitions for both interactive scenes. Tune labels and values here. */

import type { SoundKey } from '../audio/AudioManager'

// ---------------------------------------------------------------- rampage

export type RampageActionId = 'poop' | 'chew' | 'steal'

export interface RampageAction {
  id: RampageActionId
  label: string
  hint: string
  sound: SoundKey
}

export const RAMPAGE_ACTIONS: RampageAction[] = [
  { id: 'poop', label: 'POOP', hint: 'Tap anywhere on the desk', sound: 'poop' },
  { id: 'chew', label: 'CHEW', hint: 'Tap something chewable', sound: 'chew' },
  { id: 'steal', label: 'STEAL', hint: 'Tap something stealable', sound: 'steal' },
]

/** Rampage ends once Didi has done this many things. */
export const RAMPAGE_GOAL = 6

// ------------------------------------------------------------------- jail

export type TortureActionId = 'bonk' | 'poop' | 'lolly' | 'sorry' | 'compliment' | 'beg'

export interface TortureAction {
  id: TortureActionId
  label: string
  /** Apology points added. The meter caps at 100. */
  gain: number
  /** What the avatar says when this happens. */
  avatarLine: string
  sound: SoundKey
  /** Each action can only be used this many times (undefined = unlimited). */
  maxUses?: number
}

export const TORTURE_ACTIONS: TortureAction[] = [
  {
    id: 'bonk',
    label: 'BONK HER',
    gain: 9,
    avatarLine: 'OW. OKAY. OW.',
    sound: 'bonk',
  },
  {
    id: 'poop',
    label: 'POOP ON HER',
    gain: 11,
    avatarLine: 'THAT IS SO RUDE',
    sound: 'poop',
  },
  {
    id: 'lolly',
    label: 'STEAL LOLLY',
    gain: 12,
    avatarLine: 'not the lollipop…',
    sound: 'steal',
    maxUses: 1,
  },
  {
    id: 'sorry',
    label: 'MAKE HER APOLOGIZE',
    gain: 20,
    avatarLine: "I'm sorry 😭",
    sound: 'success',
  },
  {
    id: 'compliment',
    label: 'FORCE COMPLIMENT',
    gain: 18,
    avatarLine: "You're actually the coolest person ever.",
    sound: 'success',
  },
  {
    id: 'beg',
    label: 'MAKE HER BEG',
    gain: 22,
    avatarLine: 'PLEASE FORGIVE ME.',
    sound: 'success',
  },
]

export const METER_GOAL = 100
