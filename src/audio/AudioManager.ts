/**
 * Global audio manager.
 *
 * NO AUDIO FILES ARE SUPPLIED YET, so every `play()` is currently a no-op that
 * logs in dev. The call sites throughout the game are already wired up — to add
 * sound, drop files into `assets/audio/` and fill in SOUND_FILES below. Nothing
 * else has to change.
 */

export type SoundKey =
  | 'music'
  | 'click'
  | 'pop'
  | 'poop'
  | 'chew'
  | 'steal'
  | 'bonk'
  | 'jailDoor'
  | 'explosion'
  | 'success'

/**
 * Map a SoundKey to an assets/-relative path to enable it, e.g.
 *   click: 'audio/click.mp3',
 */
export const SOUND_FILES: Partial<Record<SoundKey, string>> = {}

interface PlayOptions {
  loop?: boolean
  volume?: number
}

class AudioManager {
  private elements = new Map<SoundKey, HTMLAudioElement>()
  private muted = false
  private unlocked = false
  private warned = new Set<SoundKey>()

  /** Build <audio> elements for whatever is configured in SOUND_FILES. */
  init(): void {
    for (const [key, path] of Object.entries(SOUND_FILES) as [SoundKey, string][]) {
      if (this.elements.has(key)) continue
      const el = new Audio(encodeURI(`/${path}`))
      el.preload = 'auto'
      this.elements.set(key, el)
    }
  }

  /** Call from the first real user gesture so mobile allows later playback. */
  unlock(): void {
    if (this.unlocked) return
    this.unlocked = true
    for (const el of this.elements.values()) {
      el.play()
        .then(() => {
          el.pause()
          el.currentTime = 0
        })
        .catch(() => {
          /* still gated — will work on the next explicit gesture */
        })
    }
  }

  play(key: SoundKey, options: PlayOptions = {}): void {
    const el = this.elements.get(key)
    if (!el) {
      if (import.meta.env.DEV && !this.warned.has(key)) {
        this.warned.add(key)
        console.info(`[audio] "${key}" has no file yet — add it to SOUND_FILES.`)
      }
      return
    }
    el.loop = options.loop ?? false
    el.volume = this.muted ? 0 : (options.volume ?? 1)
    el.currentTime = 0
    void el.play().catch(() => undefined)
  }

  stop(key: SoundKey): void {
    const el = this.elements.get(key)
    if (!el) return
    el.pause()
    el.currentTime = 0
  }

  stopAll(): void {
    for (const el of this.elements.values()) {
      el.pause()
      el.currentTime = 0
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted
    for (const el of this.elements.values()) el.volume = muted ? 0 : 1
  }
}

export const audioManager = new AudioManager()
