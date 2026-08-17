/**
 * ALL SPOKEN TEXT LIVES HERE. Edit freely — nothing else needs to change.
 * `hold` is how long (ms) the line stays on screen before the next one.
 */

export type Speaker = 'left' | 'right'

export interface SharkLine {
  speaker: Speaker
  text: string
  hold: number
  /** Visual intensity: shakes the bubble + speaker. 0 = calm, 2 = shouting. */
  intensity?: 0 | 1 | 2
  /** Show tears on the left shark from this line onward. */
  crying?: boolean
}

export const SHARK_DIALOGUE: SharkLine[] = [
  { speaker: 'left', text: 'Do you know we are adopted, Sharky?', hold: 2600 },
  { speaker: 'right', text: 'WHAAA… NO WAY?!', hold: 2000, intensity: 2 },
  { speaker: 'right', text: "Maybe that's why our not-so-mom is so lallu!!", hold: 3000, intensity: 1 },
  { speaker: 'left', text: 'I WANT MY MOM 😭', hold: 2200, intensity: 2, crying: true },
  { speaker: 'left', text: 'WHERE ARE YOU MOMMMMM?', hold: 2200, intensity: 2, crying: true },
  { speaker: 'left', text: 'PLEASE COME BACK 😭', hold: 2400, intensity: 1, crying: true },
  { speaker: 'left', text: '…this mom is so boring.', hold: 3200, intensity: 0, crying: true },
]

/** Hamster's opening monologue in the rampage scene. */
export const HAMSTER_INTRO_LINES: string[] = [
  "hehe don't worry Sharky.",
  "I've seen her.",
  "I'll get your mom back.",
]

export const HAMSTER_HANDOVER = 'YOUR TURN, DIDI.'

/** Shown as the rampage ends. */
export const HAMSTER_OUTRO_LINES: string[] = ['hehe.', 'FOUND HER.']

/** Jail sentencing, shown one beat at a time. */
export const JAIL_SENTENCE_LINES: string[] = [
  'YOU HAVE BEEN SENTENCED.',
  'FOR BEING BORING.',
  'BY THE HAMSTER.',
]

/** Random things the avatar blurts out while being punished. */
export const AVATAR_BARKS: string[] = [
  'WAIT WAIT WAIT',
  "OKAY I'M SORRY",
  'THAT WAS NOT NECESSARY',
  'I TAKE IT BACK',
  'DIDI PLEASE',
  'THE HAMSTER IS INSANE',
  'WHO GAVE IT A BOMB',
  'this is a lot',
]

export const METER_COMPLETE_LINES: string[] = [
  'APOLOGY LEVEL: 100%',
  'YOU HAVE BEEN SUFFICIENTLY PUNISHED.',
]

/** Avatar's last words in the KILL ending. */
export const KILL_ENDING_LINES: string[] = ['WAIT.', 'NO.', "HAHA OKAY I'M SORRY."]

export const FINAL_ENDING_LINES: string[] = [
  'HAPPILY EVER AFTER',
  'THE END ❤️',
  'unless I call you boring again',
  'JUST KIDDING.',
]
