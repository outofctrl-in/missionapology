/**
 * Interactive regions layered over the supplied workstation artwork.
 *
 * All coordinates are PERCENTAGES OF THE DESK ARTWORK (1024x1536), measured
 * off the image itself. <Stage> recreates that coordinate space at any
 * viewport size, so these stay glued to the objects painted in the picture.
 *
 * The desk is a single flat image, so an object can't literally be deleted
 * from it. Instead each hotspot carries `patchColor`, sampled from the ring of
 * pixels immediately around that object in the artwork itself. Painting it
 * slightly oversized with feathered edges makes the object read as simply
 * gone, without inventing any new art.
 */

export type HotspotKind = 'chew' | 'steal'

export interface Hotspot {
  id: string
  label: string
  kind: HotspotKind
  /** Object box, in % of the desk artwork. */
  x: number
  y: number
  w: number
  h: number
  /**
   * Colour to erase the object with — the median of the ring of pixels just
   * outside it, sampled from the artwork. Painted slightly oversized with
   * feathered edges so there is no visible rectangle.
   */
  patchColor: string
  /** Where the hamster stands to reach it, in % of the desk artwork. */
  foot: { x: number; y: number }
  /** Does the hamster have to hop up for this one? */
  reachUp?: boolean
  /** What the hamster says afterwards. */
  quip: string
}

export const DESK_HOTSPOTS: Hotspot[] = [
  {
    id: 'notebook',
    label: 'Notebook',
    kind: 'chew',
    x: 87.5,
    y: 62,
    w: 12.5,
    h: 13,
    patchColor: '#47250c',
    foot: { x: 83, y: 80 },
    quip: 'tastes like deadlines',
  },
  {
    id: 'pencil',
    label: 'Pencil',
    kind: 'chew',
    x: 4.5,
    y: 69.5,
    w: 17,
    h: 11.5,
    patchColor: '#3d210a',
    foot: { x: 20, y: 84 },
    quip: 'wood. classic.',
  },
  {
    id: 'stickyNote',
    label: 'The "i love you didi" note',
    kind: 'chew',
    x: 17.5,
    y: 11,
    w: 15,
    h: 11,
    patchColor: '#000000',
    foot: { x: 26, y: 76 },
    reachUp: true,
    quip: 'she can write another one',
  },
  {
    id: 'cables',
    label: 'Cables',
    kind: 'chew',
    x: 91.5,
    y: 50,
    w: 8.5,
    h: 12,
    patchColor: '#0d0d0a',
    foot: { x: 89, y: 76 },
    reachUp: true,
    quip: 'do NOT tell anyone',
  },
  {
    id: 'phone',
    label: 'Phone',
    kind: 'steal',
    x: 69.5,
    y: 60,
    w: 17.5,
    h: 19.5,
    patchColor: '#4d2a0e',
    foot: { x: 78, y: 84 },
    quip: 'gone. poof.',
  },
  {
    id: 'rubiks',
    label: "Rubik's cube",
    kind: 'steal',
    x: 3,
    y: 47,
    w: 10.5,
    h: 7,
    patchColor: '#3f2202',
    foot: { x: 12, y: 76 },
    reachUp: true,
    quip: 'never solved anyway',
  },
  {
    id: 'sunflower',
    label: 'Sunflower',
    kind: 'steal',
    x: 63.5,
    y: 27,
    w: 15,
    h: 14.5,
    patchColor: '#000000',
    foot: { x: 70, y: 76 },
    reachUp: true,
    quip: 'it lives with me now',
  },
  {
    id: 'piggy',
    label: 'Piggy bank',
    kind: 'steal',
    x: 11.5,
    y: 50.5,
    w: 10,
    h: 8.5,
    patchColor: '#4c260c',
    foot: { x: 17, y: 76 },
    reachUp: true,
    quip: 'a pig for a hamster. fair.',
  },
]

/** Hamster staging positions, in % of the desk artwork. */
export const DESK_HOME = { x: 46, y: 86 }
export const DESK_ENTRY = { x: 102, y: 88 }

/** The hamster only walks on the visible desk surface. */
export const DESK_WALK_BOUNDS = { minX: 6, maxX: 94, minY: 72, maxY: 92 }

export const MAX_POOPS = 14
