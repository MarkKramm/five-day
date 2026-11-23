import { SOUND } from "../constants";

type SoundName =
  | "shutter"
  | "pling"
  | "plop"
  | "flip"
  | "tick"
  | "stroke"
  | "printDone"
  | "paperSlide"
  | "chime";

/**
 * Tiny synthesized sound kit. No audio files, no network.
 * iOS only allows AudioContext to start inside a user gesture, so the intro
 * button and the sound toggle both call unlock().
 */
class SoundEngine {
  private context: AudioContext | null = null;
  private enabled = false;
  private whirr: { timer: number; noiseGain: GainNode | null; step: number } | null = null;

  get isEnabled(): boolean {
    return this.enabled;
  }

  async unlock(): Promise<void> {
    try {
      if (!this.context) {
        const Ctor =
          window.AudioContext ??
          (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        this.context = new Ctor();
      }
      if (this.context.state === "suspended") await this.context.resume();
    } catch {
      // Audio is a bonus, never a requirement.
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) this.stopWhirr();
    if (enabled) {
      void this.unlock().then(() => this.play("pling"));
    }
  }

  /** Restore a saved preference without making a sound on page load. */
  setEnabledSilently(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) this.stopWhirr();
  }

  private now(): number {
    return this.context?.currentTime ?? 0;
  }

  private noiseBuffer(duration: number): AudioBuffer | null {
    if (!this.context) return null;
    const length = Math.max(1, Math.floor(this.context.sampleRate * duration));
    const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  private noise(duration: number, filterType: BiquadFilterType, frequency: number, gain: number): void {
    try {
      if (!this.context) return;
      const source = this.context.createBufferSource();
      source.buffer = this.noiseBuffer(duration);
      if (!source.buffer) return;
      const filter = this.context.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.value = frequency;
      const volume = this.context.createGain();
      const start = this.now();
      const peak = Math.min(SOUND.maxGain, gain);
      volume.gain.setValueAtTime(0.0001, start);
      volume.gain.linearRampToValueAtTime(peak, start + 0.008);
      volume.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      source.connect(filter).connect(volume).connect(this.context.destination);
      source.start(start);
      source.stop(start + duration + 0.02);
    } catch {
      // Silent.
    }
  }

  private tone(
    fromHz: number,
    toHz: number,
    duration: number,
    type: OscillatorType,
    gain: number,
  ): void {
    try {
      if (!this.context) return;
      const oscillator = this.context.createOscillator();
      const volume = this.context.createGain();
      const start = this.now();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(fromHz, start);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, toHz), start + duration);
      const peak = Math.min(SOUND.maxGain, gain);
      volume.gain.setValueAtTime(0.0001, start);
      volume.gain.linearRampToValueAtTime(peak, start + 0.012);
      volume.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(volume).connect(this.context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    } catch {
      // Silent.
    }
  }

  play(name: SoundName): void {
    if (!this.enabled || !this.context) return;
    void this.unlock();
    if (name === "shutter") {
      // Two-part mechanical click: sharp tick, then a lower chunk 80ms later.
      this.noise(0.012, "highpass", 1800, 0.07);
      this.tone(2200, 2000, 0.012, "square", 0.03);
      this.tone(1400, 1800, 0.07, "sine", 0.012);
      window.setTimeout(() => {
        if (this.enabled) this.noise(0.06, "lowpass", 800, 0.05);
      }, 80);
    } else if (name === "chime") {
      this.tone(880, 1320, 0.28, "sine", 0.07);
      this.tone(660, 990, 0.3, "sine", 0.03);
    } else if (name === "tick") {
      this.tone(650, 620, 0.025, "sine", 0.03);
    } else if (name === "stroke") {
      this.noise(0.025, "bandpass", 2400, 0.025);
    } else if (name === "printDone") {
      this.tone(720, 690, 0.035, "triangle", 0.035);
    } else if (name === "paperSlide") {
      this.noise(0.24, "bandpass", 1700, 0.03);
    } else if (name === "pling") {
      this.tone(880, 1320, 0.25, "sine", 0.07);
    } else if (name === "plop") {
      this.tone(300, 150, 0.12, "sine", 0.065);
    } else {
      this.noise(0.12, "bandpass", 850, 0.04);
    }
  }

  /**
   * PRINT FEED — a tiny stepper motor: short triangle pulses at ~48Hz with a
   * faint band-passed paper hiss and a gentle pitch rise. It is scheduled with
   * a 50Hz interval and stops cleanly on release.
   */
  startWhirr(): void {
    if (!this.enabled || !this.context || this.whirr) return;
    try {
      const noise = this.context.createBufferSource();
      noise.buffer = this.noiseBuffer(0.4);
      noise.loop = true;
      const noiseFilter = this.context.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.value = 2100;
      noiseFilter.Q.value = 0.8;
      const noiseGain = this.context.createGain();
      noiseGain.gain.value = 0.007;
      noise.connect(noiseFilter).connect(noiseGain).connect(this.context.destination);
      noise.start();

      const engine: { timer: number; noiseGain: GainNode | null; step: number } = {
        timer: 0,
        noiseGain,
        step: 0,
      };
      engine.timer = window.setInterval(() => {
        if (!this.context || !this.enabled) return;
        engine.step += 1;
        const rising = Math.min(1, engine.step / 90);
        const frequency = 118 + rising * 46;
        this.tone(frequency, frequency * 0.94, 0.016, "triangle", 0.022);
        if (engine.step % 12 === 0) this.noise(0.03, "bandpass", 2600, 0.013);
      }, 58);
      this.whirr = engine;
    } catch {
      this.whirr = null;
    }
  }

  stopWhirr(): void {
    if (!this.whirr) return;
    const engine = this.whirr;
    this.whirr = null;
    window.clearInterval(engine.timer);
    try {
      if (this.context && engine.noiseGain) {
        const now = this.context.currentTime;
        engine.noiseGain.gain.cancelScheduledValues(now);
        engine.noiseGain.gain.setTargetAtTime(0.0001, now, 0.03);
      }
    } catch {
      // Silent.
    }
  }
}

export const sound = new SoundEngine();

/** iPhones quietly do nothing here, which is exactly what we want. */
export function vibrate(durationMs: number): void {
  try {
    navigator.vibrate?.(durationMs);
  } catch {
    // Silent.
  }
}
