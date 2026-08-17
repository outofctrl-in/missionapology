import { useEffect } from 'react'
import { useGame } from '../state/GameContext'
import { audioManager } from '../audio/AudioManager'
import styles from './MuteButton.module.css'

export function MuteButton() {
  const { muted, toggleMute } = useGame()

  useEffect(() => {
    audioManager.setMuted(muted)
  }, [muted])

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={toggleMute}
      aria-pressed={muted}
      aria-label={muted ? 'Unmute' : 'Mute'}
      title={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}
