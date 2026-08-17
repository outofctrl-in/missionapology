export const SCENE_IDS = [
  'INTRO',
  'SHARK_DIALOGUE',
  'HAMSTER_RAMPAGE',
  'JAIL_GAME',
  'ENDING_CHOICE',
  'KILL_ENDING',
  'FREE_ENDING',
  'APOLOGY_LETTER',
  'FINAL_ENDING',
] as const

export type SceneId = (typeof SCENE_IDS)[number]

export const SCENE_LABELS: Record<SceneId, string> = {
  INTRO: 'Shark Intro',
  SHARK_DIALOGUE: 'Shark Dialogue',
  HAMSTER_RAMPAGE: 'Hamster Rampage',
  JAIL_GAME: 'Jail',
  ENDING_CHOICE: 'Ending Choice',
  KILL_ENDING: 'Kill Ending',
  FREE_ENDING: 'Free Ending',
  APOLOGY_LETTER: 'Apology Letter',
  FINAL_ENDING: 'Final Ending',
}

/**
 * The default forward path. ENDING_CHOICE branches explicitly (the scene calls
 * goToScene), and both endings converge on the letter.
 */
export const NEXT_SCENE: Record<SceneId, SceneId | null> = {
  INTRO: 'SHARK_DIALOGUE',
  SHARK_DIALOGUE: 'HAMSTER_RAMPAGE',
  HAMSTER_RAMPAGE: 'JAIL_GAME',
  JAIL_GAME: 'ENDING_CHOICE',
  ENDING_CHOICE: null,
  KILL_ENDING: 'APOLOGY_LETTER',
  FREE_ENDING: 'APOLOGY_LETTER',
  APOLOGY_LETTER: 'FINAL_ENDING',
  FINAL_ENDING: null,
}
