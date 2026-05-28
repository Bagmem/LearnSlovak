let audioContext: AudioContext | null = null
let isMutedGlobal = false
let globalVolume = 0.7

export function setMuted(muted: boolean) {
  isMutedGlobal = muted
}

export function setGlobalVolume(volume: number) {
  globalVolume = Math.min(1, Math.max(0, volume))
}

async function getAudioContext(): Promise<AudioContext> {
  if (!audioContext) {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext
    if (!Ctor) throw new Error("Web Audio API not supported")
    audioContext = new Ctor()
    if (audioContext.state === "suspended") await audioContext.resume()
  }
  return audioContext
}

// Простой генератор с экспоненциальным затуханием (нет щелчков)
function playTone(freq: number, duration: number, volume: number, type: OscillatorType = "sine") {
  if (isMutedGlobal) return
  const finalVol = Math.min(1, volume * globalVolume)
  if (finalVol <= 0) return

  getAudioContext().then(ctx => {
    const now = ctx.currentTime
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(finalVol, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    const osc = ctx.createOscillator()
    osc.type = type
    osc.frequency.value = freq
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(now + duration)
  }).catch(e => console.warn(e))
}

export function playCorrectSound() {
  playTone(880, 0.35, 0.35, "sine")
}

export function playWrongSound() {
  playTone(440, 0.45, 0.4, "sawtooth")
}

export function playClickSound() {
  playTone(1200, 0.12, 0.25, "sine")
}

export function playModeSwitchSound() {
  playTone(800, 0.15, 0.3, "sine")
}

export function playLessonStartSound() {
  playTone(600, 0.3, 0.35, "sine")
  setTimeout(() => playTone(800, 0.3, 0.35, "sine"), 150)
}

export function playVictorySound() {
  playTone(523.25, 0.45, 0.4, "sine")
  setTimeout(() => playTone(659.25, 0.45, 0.4, "sine"), 300)
  setTimeout(() => playTone(783.99, 0.65, 0.45, "sine"), 600)
}

export function playSkipSound() {
  playTone(700, 0.25, 0.3, "sine")
}

export function playMarkHardSound() {
  playTone(300, 0.5, 0.4, "triangle")
}

export async function initAudio() {
  try {
    const ctx = await getAudioContext()
    if (ctx.state === "suspended") await ctx.resume()
  } catch (e) {}
}