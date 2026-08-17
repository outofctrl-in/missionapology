import type { CSSProperties } from 'react'

/**
 * Lifts one rectangle of a piece of artwork off the page as its own element,
 * using the original image as a scaled background rather than a crop — so the
 * supplied art is shown pixel-for-pixel and can then be moved, rotated or
 * faded independently of the picture it came from.
 *
 * All coordinates are percentages of the source image.
 */
export function artRegionStyle(
  src: string,
  region: { x: number; y: number; w: number; h: number },
): CSSProperties {
  return {
    backgroundImage: `url("${src}")`,
    backgroundSize: `${(100 / region.w) * 100}% ${(100 / region.h) * 100}%`,
    backgroundPosition: `${(region.x / (100 - region.w)) * 100}% ${(region.y / (100 - region.h)) * 100}%`,
    backgroundRepeat: 'no-repeat',
    imageRendering: 'pixelated',
  }
}

/** Absolute-positioned box matching a region, for placing it back over its source. */
export function regionBox(region: { x: number; y: number; w: number; h: number }): CSSProperties {
  return {
    left: `${region.x}%`,
    top: `${region.y}%`,
    width: `${region.w}%`,
    height: `${region.h}%`,
  }
}
