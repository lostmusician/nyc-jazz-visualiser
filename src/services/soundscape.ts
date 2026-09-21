import type { JourneyChapter, SoundBus } from '../utils/journey';
export const CROSSFADE_SECONDS = 1;
export const SCENE_LEVELS: Record<JourneyChapter, number> = { prologue: .055, listening: .012, clubs: .025, economics: .018, map: .04 };

/** Procedural original room tone. No remote samples; context is created on explicit opt-in only. */
export class Soundscape {
  private context: AudioContext | null = null;
  private buses: Partial<Record<SoundBus, GainNode>> = {};
  private voices = new Map<string, { gain: GainNode; source: AudioBufferSourceNode; filter: BiquadFilterNode }>();
  private enabled = false;
  private musicElements = new WeakMap<HTMLMediaElement, MediaElementAudioSourceNode>();
  async enable() {
    try {
      if (!this.context) {
        this.context = new AudioContext();
        for (const bus of ['ambient','music','interaction'] as const) { const gain=this.context.createGain();gain.connect(this.context.destination);this.buses[bus]=gain; }
      }
      this.enabled=true;
      await this.context.resume();
      for(const gain of Object.values(this.buses)) gain.gain.setTargetAtTime(1,this.context.currentTime,.15);
    } catch { this.enabled=false; }
  }
  mute() { this.enabled=false; if(this.context) for(const gain of Object.values(this.buses)) gain.gain.setTargetAtTime(0,this.context.currentTime,.08); }
  async prepareMusic(audio: HTMLMediaElement) {
    await this.enable();
    if(!this.context || this.musicElements.has(audio)) return;
    try { const source=this.context.createMediaElementSource(audio);source.connect(this.buses.music!);this.musicElements.set(audio,source); } catch { /* HTML audio remains a usable fallback. */ }
  }
  enterSoundScene(scene: JourneyChapter) {
    const ctx=this.context; if(!ctx || !this.enabled) return;
    for(const [id,voice] of this.voices) this.fade(voice.gain,id===scene?SCENE_LEVELS[scene]:0);
    if(this.voices.has(scene)) return;
    const buffer=ctx.createBuffer(1,ctx.sampleRate*3,ctx.sampleRate);
    const data=buffer.getChannelData(0); let brown=0;
    for(let i=0;i<data.length;i++){brown=(brown+(Math.random()*2-1)*.025)/1.025;data[i]=brown*4;}
    const source=ctx.createBufferSource();source.buffer=buffer;source.loop=true;
    const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=scene==='prologue'?650:scene==='map'?1100:240;
    const gain=ctx.createGain();gain.gain.value=0;
    source.connect(filter).connect(gain).connect(this.buses.ambient!);source.start();
    this.voices.set(scene,{gain,source,filter});this.fade(gain,SCENE_LEVELS[scene]);
  }
  leaveSoundScene(scene: JourneyChapter) { const voice=this.voices.get(scene);if(voice)this.fade(voice.gain,0); }
  private fade(gain: GainNode,value:number) { const ctx=this.context;if(!ctx)return;gain.gain.cancelScheduledValues(ctx.currentTime);gain.gain.setValueAtTime(gain.gain.value,ctx.currentTime);gain.gain.linearRampToValueAtTime(value,ctx.currentTime+CROSSFADE_SECONDS); }
  interaction(kind:'step'|'paper'|'door') {
    const ctx=this.context;if(!ctx||!this.enabled)return;
    const oscillator=ctx.createOscillator(),gain=ctx.createGain();oscillator.type='triangle';oscillator.frequency.value=kind==='step'?65:kind==='paper'?330:90;
    gain.gain.setValueAtTime(.015,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.12);
    oscillator.connect(gain).connect(this.buses.interaction!);oscillator.start();oscillator.stop(ctx.currentTime+.15);
    oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
  }
  dispose() { for(const voice of this.voices.values()){voice.source.stop();voice.source.disconnect();voice.filter.disconnect();voice.gain.disconnect();}this.voices.clear();void this.context?.close();this.context=null; }
}
