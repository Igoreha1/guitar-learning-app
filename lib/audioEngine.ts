import * as Tone from "tone";

class AudioEngine {
  private isStarted = false;

  async start() {
    if (!this.isStarted) {
      await Tone.start();
      this.isStarted = true;
    }
    Tone.Transport.start();
  }

  pause() {
    Tone.Transport.pause();
  }

  stop() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.seconds = 0;
  }

  getTime(): number {
    return Tone.Transport.seconds;
  }

  isPlaying(): boolean {
    return Tone.Transport.state === "started";
  }

  getState(): string {
    return Tone.Transport.state;
  }

  setBPM(bpm: number) {
    Tone.Transport.bpm.value = bpm;
  }

  getBPM(): number {
    return Tone.Transport.bpm.value;
  }
}

export const audioEngine = new AudioEngine();