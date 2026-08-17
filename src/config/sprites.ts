/**
 * Sprite atlas — pixel rectangles inside each supplied sprite sheet.
 *
 * These were measured from the actual image data (connected-component
 * analysis of the alpha channel), not eyeballed. If you swap a sheet for a
 * new version, re-measure and update the numbers here — nothing else needs
 * to change.
 */
import { ASSETS } from './assets'
import type { ImageAsset } from './assets'

export interface SpriteRect {
  sheet: ImageAsset
  x: number
  y: number
  w: number
  h: number
}

const rect = (sheet: ImageAsset, x: number, y: number, w: number, h: number): SpriteRect => ({
  sheet,
  x,
  y,
  w,
  h,
})

const H = ASSETS.hamsterSheet
const P = ASSETS.poopSheet
const F = ASSETS.bombSheet
const D = ASSETS.didiSheet

export const SPRITES = {
  hamster: {
    /** Sitting upright, facing the camera. */
    front: rect(H, 42, 30, 408, 480),
    /** Profile, nose pointing right. */
    right: rect(H, 524, 30, 530, 482),
    /** Rear view — used when the hamster walks "into" the scene. */
    back: rect(H, 1120, 62, 350, 442),
    /** Profile, nose pointing left. */
    left: rect(H, 140, 528, 538, 470),
    /** Curled/top-down — used for the sleepy + evil-grin beats. */
    curled: rect(H, 906, 564, 422, 414),
  },
  poop: {
    smallPlain: rect(P, 184, 190, 84, 84),
    smallKawaii: rect(P, 434, 180, 98, 94),
    mediumPlain: rect(P, 136, 394, 156, 150),
    mediumKawaii: rect(P, 408, 388, 160, 156),
    largePlain: rect(P, 32, 662, 274, 264),
    largeKawaii: rect(P, 334, 680, 264, 246),
    splat: rect(P, 1200, 738, 280, 206),
    /** Standalone pixel heart that happens to live on the poop sheet. */
    heart: rect(P, 516, 664, 68, 62),
  },
  fx: {
    bomb: rect(F, 62, 28, 130, 152),
    bombSkull: rect(F, 220, 32, 120, 150),
    bombLit: rect(F, 568, 12, 104, 166),
    spark: rect(F, 54, 268, 76, 80),
    burstSmall: rect(F, 176, 222, 136, 146),
    burstMedium: rect(F, 360, 188, 174, 182),
    burstLarge: rect(F, 578, 198, 186, 184),
    bang: rect(F, 1330, 18, 178, 160),
    smokeLarge: rect(F, 818, 202, 144, 164),
    smokeSmall: rect(F, 1152, 98, 114, 102),
    smokePuff: rect(F, 1242, 184, 72, 76),
    smokeWisp: rect(F, 1050, 202, 70, 58),
    star: rect(F, 1132, 38, 52, 54),
    skull: rect(F, 1418, 180, 76, 82),
  },
  didi: {
    wave: rect(D, 34, 19, 223, 288),
    laugh: rect(D, 282, 13, 214, 297),
    cool: rect(D, 528, 20, 201, 303),
    hugHamster: rect(D, 16, 320, 189, 277),
    runLolly: rect(D, 248, 335, 259, 250),
    twirl: rect(D, 545, 337, 192, 259),
    /** The candy head of Didi's lollipop, isolated for the jail "steal lolly" gag. */
    lollipop: rect(D, 423, 372, 58, 58),
  },
} as const

/**
 * Regions of the flat jail painting, in % of that image. The barred door is
 * lifted out of the artwork so it can swing open in the FREE ending without
 * anyone drawing a second door.
 */
export const JAIL_REGIONS = {
  door: { x: 81, y: 14, w: 19, h: 82 },
} as const

/** Ordered explosion frames for the KILL ending. */
export const EXPLOSION_FRAMES: SpriteRect[] = [
  SPRITES.fx.spark,
  SPRITES.fx.burstSmall,
  SPRITES.fx.burstMedium,
  SPRITES.fx.burstLarge,
  SPRITES.fx.smokeLarge,
  SPRITES.fx.smokeSmall,
]

/** Poop variants the rampage picks from at random. */
export const POOP_VARIANTS: SpriteRect[] = [
  SPRITES.poop.smallPlain,
  SPRITES.poop.mediumPlain,
  SPRITES.poop.mediumKawaii,
  SPRITES.poop.largePlain,
  SPRITES.poop.smallKawaii,
]
