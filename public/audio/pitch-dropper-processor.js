/*
 * Adapted from yuichkun/web-audio-pitch-dropper at
 * e9eadc537c0faab19a8d79f8aab38a73dc59443b (MIT).
 * See THIRD_PARTY_NOTICES/Web-Audio-Pitch-Dropper-LICENSE.txt.
 */
/* global AudioWorkletProcessor, registerProcessor */
class PitchDropperProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{ name: 'speed', defaultValue: 1, minValue: 0, maxValue: 2, automationRate: 'a-rate' }];
  }

  constructor() {
    super();
    this.leftBuffer = null;
    this.rightBuffer = null;
    this.cursor = 0;
    this.port.onmessage = ({ data }) => {
      if (data.leftBuffer) this.leftBuffer = new Float32Array(data.leftBuffer);
      if (data.rightBuffer) this.rightBuffer = new Float32Array(data.rightBuffer);
      if (data.reset) this.cursor = 0;
    };
  }

  process(_inputs, outputs, parameters) {
    const output = outputs[0];
    const leftOutput = output?.[0];
    const rightOutput = output?.[1] ?? output?.[0];
    const speeds = parameters.speed;
    if (!leftOutput || !rightOutput || !this.leftBuffer || !this.rightBuffer || !speeds) return true;

    const lastSampleIndex = this.leftBuffer.length - 1;
    const constantSpeed = speeds.length === 1;
    for (let index = 0; index < leftOutput.length; index += 1) {
      const cursorIndex = Math.min(Math.ceil(this.cursor), lastSampleIndex);
      leftOutput[index] = this.leftBuffer[cursorIndex] ?? 0;
      rightOutput[index] = this.rightBuffer[cursorIndex] ?? this.leftBuffer[cursorIndex] ?? 0;
      this.cursor += constantSpeed ? speeds[0] : speeds[index];
      if (this.cursor >= lastSampleIndex) this.cursor = 0;
    }
    return true;
  }
}

registerProcessor('pitch-dropper-processor', PitchDropperProcessor);
