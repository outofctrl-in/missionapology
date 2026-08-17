import type { ReactNode } from 'react'
import { PixelButton } from './PixelButton'
import styles from './ActionMenu.module.css'

export interface ActionMenuItem {
  id: string
  label: string
  disabled?: boolean
}

interface ActionMenuProps {
  items: ActionMenuItem[]
  activeId?: string | null
  onSelect: (id: string) => void
  /** Line of helper text above the buttons. */
  hint?: ReactNode
  columns?: 2 | 3
  disabled?: boolean
}

/** The bottom control deck used by both interactive scenes. */
export function ActionMenu({
  items,
  activeId,
  onSelect,
  hint,
  columns = 3,
  disabled = false,
}: ActionMenuProps) {
  return (
    <div className={styles.deck}>
      {hint && <p className={styles.hint}>{hint}</p>}
      <div className={styles.grid} data-columns={columns}>
        {items.map((item) => (
          <PixelButton
            key={item.id}
            size="sm"
            active={activeId === item.id}
            disabled={disabled || item.disabled}
            onClick={() => onSelect(item.id)}
          >
            {item.label}
          </PixelButton>
        ))}
      </div>
    </div>
  )
}
