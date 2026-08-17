import type { CSSProperties } from 'react'
import type { SpriteRect } from '../config/sprites'
import { assetUrl } from '../config/assets'

interface SpriteProps {
  sprite: SpriteRect
  /** Rendered width. Height follows from the sprite's own aspect ratio. */
  width: string
  className?: string
  style?: CSSProperties
  /** Flip horizontally (e.g. reuse a left-facing pose facing right). */
  flip?: boolean
  title?: string
}

/**
 * Renders one rectangle out of a sprite sheet, with no cropping/redrawing of
 * the source file — the sheet is used as a background and offset into place,
 * so the supplied artwork is preserved pixel-for-pixel.
 *
 * The percentages below are the standard background-position maths for a
 * scaled sheet, which keeps the crop exact at any rendered size.
 */
export function Sprite({ sprite, width, className, style, flip, title }: SpriteProps) {
  const { sheet, x, y, w, h } = sprite

  const bgSize = `${(sheet.width / w) * 100}% ${(sheet.height / h) * 100}%`
  const posX = sheet.width === w ? 0 : (x / (sheet.width - w)) * 100
  const posY = sheet.height === h ? 0 : (y / (sheet.height - h)) * 100

  return (
    <div
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      style={{
        width,
        aspectRatio: `${w} / ${h}`,
        backgroundImage: `url("${assetUrl(sheet.path)}")`,
        backgroundSize: bgSize,
        backgroundPosition: `${posX}% ${posY}%`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        ...style,
        transform: [flip ? 'scaleX(-1)' : '', style?.transform ?? ''].filter(Boolean).join(' ') || undefined,
      }}
    />
  )
}
