/** Every cinematic timing in one place (milliseconds). Tweak the pacing here. */

export const TIMING = {
  /** Scene crossfade (also the CSS var --scene-transition-ms). */
  sceneFade: 520,

  intro: {
    fadeIn: 1200,
    /** How long the last video frame is held before fading out. */
    holdLastFrame: 900,
    /** Beat of black between the intro and scene 2. */
    blackPause: 650,
  },

  dialogue: {
    bubbleIn: 320,
    /** Gap between one bubble leaving and the next arriving. */
    betweenLines: 260,
    /** Beat after the punchline before the glitch cut. */
    punchlineHold: 900,
    glitch: 700,
  },

  rampage: {
    hamsterEntry: 1600,
    lookAround: 900,
    autoPoop: 700,
    walkAway: 1200,
    lineHold: 1700,
    /** Pixels-per-second-ish: how fast the hamster crosses the desk. */
    walkSpeedPercentPerSecond: 42,
    chew: 1100,
    steal: 800,
    outroHold: 1400,
  },

  jail: {
    avatarDrop: 700,
    hamsterWalkIn: 1100,
    doorSlam: 500,
    shake: 420,
    sentenceLine: 1300,
    actionAnim: 900,
    barkDuration: 1800,
    completeLine: 1500,
  },

  kill: {
    walkIn: 1200,
    stare: 900,
    placeBomb: 800,
    lineHold: 800,
    fuse: 1400,
    framePerStep: 130,
    settle: 1200,
  },

  free: {
    unlock: 700,
    doorOpen: 900,
    walkOut: 1400,
    hold: 900,
  },

  letter: {
    lineStagger: 420,
  },
} as const
