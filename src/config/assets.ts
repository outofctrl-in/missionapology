/**
 * Every asset path in one place.
 *
 * Paths are relative to the `assets/` folder at the project root, which Vite
 * serves verbatim (see vite.config.ts -> publicDir). The original files are
 * never modified; `avatar-bobble-head.png` is the one derived file (see note).
 */

export type AssetStatus = 'ok' | 'derived' | 'missing'

interface BaseAsset {
  path: string
  status: AssetStatus
  width: number
  height: number
  note?: string
}

export interface ImageAsset extends BaseAsset {
  kind: 'image'
  hasAlpha: boolean
}

export interface VideoAsset extends BaseAsset {
  kind: 'video'
  durationSeconds: number
}

export type Asset = ImageAsset | VideoAsset

/** assets/-relative path -> URL, encoding the spaces and unicode in the original filenames. */
export function assetUrl(path: string): string {
  return encodeURI(`/${path}`)
}

export const ASSETS = {
  sharkCryingVideo: {
    kind: 'video',
    path: 'shark/Shark_crying_with_increasing_int…_202608171755.mp4',
    status: 'ok',
    width: 720,
    height: 1280,
    durationSeconds: 8,
  },
  sharkSlippers: {
    kind: 'image',
    path: 'shark/ChatGPT Image Aug 17, 2026, 06_01_54 PM.png',
    status: 'ok',
    width: 941,
    height: 1672,
    hasAlpha: false,
  },
  workstation: {
    kind: 'image',
    path: 'desk/ChatGPT Image Aug 17, 2026, 06_44_30 PM.png',
    status: 'ok',
    width: 1024,
    height: 1536,
    hasAlpha: false,
  },
  hamsterSheet: {
    kind: 'image',
    path: 'hamster/ChatGPT Image Aug 17, 2026, 06_51_00 PM.png',
    status: 'ok',
    width: 1536,
    height: 1024,
    hasAlpha: true,
    note: '5 poses — see SPRITES.hamster',
  },
  poopSheet: {
    kind: 'image',
    path: 'hamster/ChatGPT Image Aug 17, 2026, 06_56_22 PM.png',
    status: 'ok',
    width: 1536,
    height: 1024,
    hasAlpha: true,
    note: '16 sprites across 3 size tiers — see SPRITES.poop',
  },
  jail: {
    kind: 'image',
    path: 'jail/jail.png',
    status: 'ok',
    width: 731,
    height: 555,
    hasAlpha: true,
    note: 'Effectively opaque (alpha 252-253) with soft corners. Landscape 731x555.',
  },
  bombSheet: {
    kind: 'image',
    path: 'jail/bombs.png',
    status: 'ok',
    width: 1536,
    height: 404,
    hasAlpha: true,
    note: '15 bomb/explosion/smoke sprites — see SPRITES.fx',
  },
  didiSheet: {
    kind: 'image',
    path: 'didi/didi.png',
    status: 'ok',
    width: 748,
    height: 604,
    hasAlpha: true,
    note: '6 crowned-Didi poses — see SPRITES.didi',
  },

  /**
   * DERIVED FILE. The supplied `bobble head.png` has no alpha channel — its
   * "transparent" checkerboard is baked into the pixels as flat near-white,
   * so it renders as a solid checkerboard card. This file is that same
   * artwork with the checkerboard flood-filled away from the edges and the
   * result trimmed to the figure. Not one character pixel was redrawn, and
   * the original file is still in assets/ untouched.
   */
  avatar: {
    kind: 'image',
    path: 'avatar-bobble-head.png',
    status: 'derived',
    width: 641,
    height: 1339,
    hasAlpha: true,
    note: 'Background-removed cutout of the supplied `bobble head.png`.',
  },
} as const satisfies Record<string, Asset>

export type AssetKey = keyof typeof ASSETS
