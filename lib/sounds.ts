let audioContext: AudioContext | null = null
let isMutedGlobal = false

export function setMuted(muted: boolean) {
  isMutedGlobal = muted
}

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioContext
}

function playTone(frequency: number, duration: number, volume: number = 0.3, type: OscillatorType = "sine") {
  if (isMutedGlobal) return
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime
    const gainNode = ctx.createGain()
    gainNode.gain.setValueAtTime(volume, now)
    gainNode.gain.exponentialRampToValueAtTime(0.00001, now + duration)

    const oscillator = ctx.createOscillator()
    oscillator.type = type
    oscillator.frequency.value = frequency
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    oscillator.start()
    oscillator.stop(now + duration)
  } catch (e) {
    console.warn("Web Audio API error", e)
  }
}

export function playCorrectSound(): void {
  playTone(880, 0.2, 0.3)
}

export function playWrongSound(): void {
  playTone(440, 0.3, 0.3, "sawtooth")
}

export function playClickSound(): void {
  playTone(1200, 0.05, 0.2)
}

export function playModeSwitchSound(): void {
  playTone(800, 0.1, 0.25)
}

export function playLessonStartSound(): void {
  playTone(600, 0.2, 0.3)
  setTimeout(() => playTone(800, 0.2, 0.3), 150)
}

export function playVictorySound(): void {
  playTone(523.25, 0.3, 0.3)
  setTimeout(() => playTone(659.25, 0.3, 0.3), 200)
  setTimeout(() => playTone(783.99, 0.5, 0.3), 400)
}

export function initAudio(): void {
  const ctx = getAudioContext()
  if (ctx.state === "suspended") {
    ctx.resume()
  }
}