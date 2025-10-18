import { defineStore } from "pinia";

export interface RootState {
  drawer: Boolean,
  audioCtx: AudioContext,
  silenSound: HTMLAudioElement
}

export const useRootStore = defineStore("Root", {
  state: (): RootState => ({
    drawer: false,
    audioCtx: new (window.AudioContext || AudioContext)({ latencyHint: "interactive" }),
    silenSound: new Audio("data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAAAAAA=="),
  }),
  actions: {
    scheduleTone({
      frequency = 440,
      duration = 1,
      type = "sine" as OscillatorType,
      startTime = undefined as number | undefined,
      fade = 0.03,           // 30 ms fade in/out
      gain = 0.8             // per-note volume (0..1)
    }) {
      startTime = startTime ?? this.audioCtx.currentTime;
      duration = duration / 1000; // convert ms to seconds

      // Some browsers need resume() after a user gesture
      // if (this.audioCtx.state === "suspended")
      //   this.audioCtx.resume();


      const osc = this.audioCtx.createOscillator();
      const g = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, startTime);

      // Avoid clicks: ramp gain up then down
      const safeFade = Math.min(fade, duration / 3); // keep fades short vs duration
      g.gain.setValueAtTime(0, startTime);
      g.gain.linearRampToValueAtTime(gain, startTime + safeFade);
      g.gain.setValueAtTime(gain, startTime + duration - safeFade);
      g.gain.linearRampToValueAtTime(0, startTime + duration);

      osc.connect(g).connect(this.audioCtx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    },
    unlockAudio2() {
      this.silenSound.play()
    },
  },
});
