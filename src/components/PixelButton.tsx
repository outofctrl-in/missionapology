import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { audioManager } from '../audio/AudioManager'
import styles from './PixelButton.module.css'

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'default' | 'danger' | 'safe' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  active?: boolean
  block?: boolean
}

export function PixelButton({
  children,
  variant = 'default',
  size = 'md',
  active = false,
  block = false,
  className,
  onClick,
  ...rest
}: PixelButtonProps) {
  return (
    <button
      type="button"
      className={[
        styles.btn,
        styles[variant],
        styles[size],
        active ? styles.active : '',
        block ? styles.block : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={(event) => {
        audioManager.play('click')
        onClick?.(event)
      }}
      {...rest}
    >
      <span className={styles.label}>{children}</span>
    </button>
  )
}
