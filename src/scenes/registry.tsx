import type { ComponentType } from 'react'
import type { SceneId } from '../state/scenes'
import type { TransitionKind } from '../components/SceneTransition'
import { SharkIntro } from './SharkIntro/SharkIntro'
import { SharkDialogue } from './SharkDialogue/SharkDialogue'
import { HamsterRampage } from './HamsterRampage/HamsterRampage'
import { JailGame } from './JailGame/JailGame'
import { EndingChoice } from './EndingChoice/EndingChoice'
import { KillEnding } from './KillEnding/KillEnding'
import { FreeEnding } from './FreeEnding/FreeEnding'
import { ApologyLetter } from './ApologyLetter/ApologyLetter'
import { FinalEnding } from './FinalEnding/FinalEnding'

/** Add a scene: register the id in state/scenes.ts, then map it here. */
export const SCENE_REGISTRY: Record<SceneId, ComponentType> = {
  INTRO: SharkIntro,
  SHARK_DIALOGUE: SharkDialogue,
  HAMSTER_RAMPAGE: HamsterRampage,
  JAIL_GAME: JailGame,
  ENDING_CHOICE: EndingChoice,
  KILL_ENDING: KillEnding,
  FREE_ENDING: FreeEnding,
  APOLOGY_LETTER: ApologyLetter,
  FINAL_ENDING: FinalEnding,
}

/** How the app wipes INTO each scene. */
export const SCENE_TRANSITIONS: Record<SceneId, TransitionKind> = {
  INTRO: 'black',
  SHARK_DIALOGUE: 'black',
  // the punchline lands, then a hard glitch cut to the hamster
  HAMSTER_RAMPAGE: 'glitch',
  JAIL_GAME: 'dissolve',
  ENDING_CHOICE: 'zoom',
  KILL_ENDING: 'black',
  FREE_ENDING: 'black',
  APOLOGY_LETTER: 'dissolve',
  FINAL_ENDING: 'slide',
}
