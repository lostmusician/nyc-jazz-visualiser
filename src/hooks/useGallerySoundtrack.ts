import React from 'react';
import { DECADE_SOUNDTRACKS, GALLERY_SOUNDTRACK } from '../data/decadeSoundtracks';
import { clamp } from '../gallery/audio';
import { getTurntableSpeed } from '../gallery/entry-state';
import type { Decade, Soundtrack } from '../gallery/model';

const WORKLET_URL = '/audio/pitch-dropper-processor.js';
const DEFAULT_VOLUME = 0.72;
const CROSSFADE_SECONDS = 0.85;
const SPIN_SECONDS = 1.6;
const HOLD_RECOVERY_SECONDS = 0.9;
const SILENCE = 0.0001;

export type SoundtrackStatus = 'idle' | 'loading' | 'playing' | 'dropping' | 'paused' | 'error';

type Engine = {
  node: AudioWorkletNode;
  gain: GainNode;
  buffer: AudioBuffer;
  track: Soundtrack;
};

const setParam = (param: AudioParam, context: AudioContext, value: number) => {
  param.cancelScheduledValues(context.currentTime);
  param.setValueAtTime(value, context.currentTime);
};

const disconnectEngine = (engine: Engine | null) => {
  engine?.node.disconnect();
  engine?.gain.disconnect();
};

export function useGallerySoundtrack(storyDecade: Decade | null) {
  const contextRef = React.useRef<AudioContext | null>(null);
  const bufferCacheRef = React.useRef(new Map<string, AudioBuffer>());
  const engineRef = React.useRef<Engine | null>(null);
  const outgoingEngineRef = React.useRef<Engine | null>(null);
  const engineGenerationRef = React.useRef(0);
  const automationFrameRef = React.useRef<number | null>(null);
  const automationGenerationRef = React.useRef(0);
  const crossfadeTimerRef = React.useRef<number | null>(null);
  const cursorTimerRef = React.useRef<number | null>(null);
  const introStartedRef = React.useRef(false);
  const galleryActiveRef = React.useRef(false);
  const playbackSpeedRef = React.useRef(1);
  const mutedRef = React.useRef(false);
  const intendedPlayingRef = React.useRef(true);
  const hiddenPausedRef = React.useRef(false);
  const volumeRef = React.useRef(DEFAULT_VOLUME);
  const activeTrackRef = React.useRef<Soundtrack>(storyDecade === null ? GALLERY_SOUNDTRACK : DECADE_SOUNDTRACKS[storyDecade]);

  const [status, setStatus] = React.useState<SoundtrackStatus>('idle');
  const [muted, setMuted] = React.useState(false);
  const [volume, setVolumeState] = React.useState(DEFAULT_VOLUME);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [activeTrack, setActiveTrack] = React.useState<Soundtrack>(activeTrackRef.current);

  const clearAutomation = React.useCallback(() => {
    automationGenerationRef.current += 1;
    if (automationFrameRef.current !== null) cancelAnimationFrame(automationFrameRef.current);
    automationFrameRef.current = null;
  }, []);

  const clearCursorTimer = React.useCallback(() => {
    if (cursorTimerRef.current !== null) window.clearInterval(cursorTimerRef.current);
    cursorTimerRef.current = null;
  }, []);

  const clearCrossfade = React.useCallback(() => {
    if (crossfadeTimerRef.current !== null) window.clearTimeout(crossfadeTimerRef.current);
    crossfadeTimerRef.current = null;
    disconnectEngine(outgoingEngineRef.current);
    outgoingEngineRef.current = null;
  }, []);

  const stopCurrentEngine = React.useCallback(() => {
    clearAutomation();
    clearCursorTimer();
    clearCrossfade();
    disconnectEngine(engineRef.current);
    engineRef.current = null;
  }, [clearAutomation, clearCrossfade, clearCursorTimer]);

  const ensureContext = React.useCallback(async () => {
    let context = contextRef.current;
    if (!context || context.state === 'closed') {
      context = new AudioContext();
      contextRef.current = context;
      await context.audioWorklet.addModule(WORKLET_URL);
    }
    if (context.state === 'suspended') await context.resume();
    return context;
  }, []);

  const loadBuffer = React.useCallback(async (context: AudioContext, track: Soundtrack) => {
    const cached = bufferCacheRef.current.get(track.src);
    if (cached) return cached;
    const response = await fetch(track.src);
    if (!response.ok) throw new Error(`Soundtrack request failed: ${response.status}`);
    const buffer = await context.decodeAudioData(await response.arrayBuffer());
    bufferCacheRef.current.set(track.src, buffer);
    return buffer;
  }, []);

  const startCursorUpdates = React.useCallback((engine: Engine) => {
    clearCursorTimer();
    engine.node.port.onmessage = ({ data }: MessageEvent<{ cursor?: number }>) => {
      if (engineRef.current !== engine || typeof data.cursor !== 'number') return;
      setCurrentTime(data.cursor / engine.buffer.sampleRate);
    };
    let requestId = 0;
    cursorTimerRef.current = window.setInterval(() => {
      if (engineRef.current === engine) engine.node.port.postMessage({ requestCursor: ++requestId });
    }, 200);
  }, [clearCursorTimer]);

  const startTrack = React.useCallback(async (track: Soundtrack, offsetSeconds = 0) => {
    const generation = ++engineGenerationRef.current;
    clearAutomation();
    setStatus('loading');
    try {
      const context = await ensureContext();
      const buffer = await loadBuffer(context, track);
      if (generation !== engineGenerationRef.current) return;

      clearCrossfade();
      const outgoing = engineRef.current;
      const node = new AudioWorkletNode(context, 'pitch-dropper-processor', { parameterData: { speed: 1 } });
      const gain = context.createGain();
      const shouldPlay = intendedPlayingRef.current && !mutedRef.current && !document.hidden;
      const speed = node.parameters.get('speed');
      const safeOffset = ((offsetSeconds % buffer.duration) + buffer.duration) % buffer.duration;
      const left = new Float32Array(buffer.getChannelData(0));
      const right = new Float32Array(buffer.getChannelData(Math.min(1, buffer.numberOfChannels - 1)));
      node.port.postMessage({
        leftBuffer: left.buffer,
        rightBuffer: right.buffer,
        seekCursor: safeOffset * buffer.sampleRate,
      }, [left.buffer, right.buffer]);
      if (speed) speed.setValueAtTime(shouldPlay ? 1 : 0, context.currentTime);
      gain.gain.setValueAtTime(outgoing && shouldPlay ? SILENCE : shouldPlay ? volumeRef.current : SILENCE, context.currentTime);
      node.connect(gain).connect(context.destination);

      const incoming: Engine = { node, gain, buffer, track };
      engineRef.current = incoming;
      playbackSpeedRef.current = shouldPlay ? 1 : 0;
      setCurrentTime(safeOffset);
      setDuration(buffer.duration);
      startCursorUpdates(incoming);

      if (outgoing && shouldPlay) {
        outgoingEngineRef.current = outgoing;
        const now = context.currentTime;
        outgoing.gain.gain.cancelScheduledValues(now);
        outgoing.gain.gain.setValueAtTime(outgoing.gain.gain.value, now);
        outgoing.gain.gain.linearRampToValueAtTime(SILENCE, now + CROSSFADE_SECONDS);
        gain.gain.linearRampToValueAtTime(volumeRef.current, now + CROSSFADE_SECONDS);
        crossfadeTimerRef.current = window.setTimeout(() => {
          if (outgoingEngineRef.current === outgoing) {
            disconnectEngine(outgoing);
            outgoingEngineRef.current = null;
          }
          crossfadeTimerRef.current = null;
        }, CROSSFADE_SECONDS * 1000);
      } else if (outgoing) {
        disconnectEngine(outgoing);
      }
      setStatus(shouldPlay ? 'playing' : 'paused');
    } catch (error) {
      if (generation !== engineGenerationRef.current) return;
      console.warn(`Soundtrack unavailable: ${track.src}`, error);
      stopCurrentEngine();
      setCurrentTime(0);
      setDuration(0);
      setStatus('error');
    }
  }, [clearAutomation, clearCrossfade, ensureContext, loadBuffer, startCursorUpdates, stopCurrentEngine]);

  React.useEffect(() => {
    const track = storyDecade === null ? GALLERY_SOUNDTRACK : DECADE_SOUNDTRACKS[storyDecade];
    activeTrackRef.current = track;
    setActiveTrack(track);
    if (galleryActiveRef.current && engineRef.current?.track.src !== track.src) void startTrack(track);
  }, [startTrack, storyDecade]);

  const startIntro = React.useCallback(() => {
    if (introStartedRef.current) return;
    introStartedRef.current = true;
    void startTrack(GALLERY_SOUNDTRACK);
  }, [startTrack]);

  const beginHold = React.useCallback(() => {
    mutedRef.current = false;
    intendedPlayingRef.current = true;
    setMuted(false);
    const context = contextRef.current;
    const engine = engineRef.current;
    const speed = engine?.node.parameters.get('speed');
    if (!context || !engine || !speed) {
      void startTrack(GALLERY_SOUNDTRACK);
      return;
    }
    clearAutomation();
    setParam(engine.gain.gain, context, volumeRef.current);
    setStatus('playing');
    if (context.state === 'suspended') void context.resume().catch(() => undefined);
    const generation = automationGenerationRef.current;
    const startedAt = performance.now();
    const fromSpeed = playbackSpeedRef.current;
    const durationSeconds = Math.max(0.12, HOLD_RECOVERY_SECONDS * (1 - fromSpeed));
    const tick = (now: number) => {
      if (generation !== automationGenerationRef.current) return;
      const progress = Math.min((now - startedAt) / (durationSeconds * 1000), 1);
      const nextSpeed = getTurntableSpeed(fromSpeed, 1, progress);
      playbackSpeedRef.current = nextSpeed;
      setParam(speed, context, nextSpeed);
      if (progress < 1) automationFrameRef.current = requestAnimationFrame(tick);
    };
    automationFrameRef.current = requestAnimationFrame(tick);
  }, [clearAutomation, startTrack]);

  const abortHold = React.useCallback(() => {
    const context = contextRef.current;
    const engine = engineRef.current;
    const speed = engine?.node.parameters.get('speed');
    if (!context || !engine || !speed) {
      stopCurrentEngine();
      playbackSpeedRef.current = 0;
      setStatus('idle');
      return;
    }
    clearAutomation();
    const generation = automationGenerationRef.current;
    setStatus('dropping');
    const startedAt = performance.now();
    const fromSpeed = playbackSpeedRef.current;
    const durationSeconds = Math.max(0.18, 3 * fromSpeed);
    const tick = (now: number) => {
      if (generation !== automationGenerationRef.current) return;
      const progress = Math.min((now - startedAt) / (durationSeconds * 1000), 1);
      const nextSpeed = getTurntableSpeed(fromSpeed, 0, progress);
      playbackSpeedRef.current = nextSpeed;
      setParam(speed, context, nextSpeed);
      if (progress < 1) automationFrameRef.current = requestAnimationFrame(tick);
      else {
        stopCurrentEngine();
        setStatus('idle');
      }
    };
    automationFrameRef.current = requestAnimationFrame(tick);
  }, [clearAutomation, stopCurrentEngine]);

  const continueIntoGallery = React.useCallback(() => {
    galleryActiveRef.current = true;
    intendedPlayingRef.current = true;
    if (!engineRef.current) void startTrack(activeTrackRef.current);
  }, [startTrack]);

  const applyManualMuteState = React.useCallback((nextMuted: boolean) => {
    const context = contextRef.current;
    const engine = engineRef.current;
    const speed = engine?.node.parameters.get('speed');
    if (!context || !engine || !speed) {
      if (!nextMuted) void startTrack(activeTrackRef.current);
      else setStatus('paused');
      return;
    }
    clearAutomation();
    clearCrossfade();
    if (context.state === 'suspended') void context.resume().catch(() => undefined);
    const generation = automationGenerationRef.current;
    const startedAt = performance.now();
    const fromSpeed = playbackSpeedRef.current;
    const targetSpeed = nextMuted ? 0 : 1;
    setStatus(nextMuted ? 'dropping' : 'playing');
    const tick = (now: number) => {
      if (generation !== automationGenerationRef.current) return;
      const progress = Math.min((now - startedAt) / (SPIN_SECONDS * 1000), 1);
      const nextSpeed = getTurntableSpeed(fromSpeed, targetSpeed, progress);
      playbackSpeedRef.current = nextSpeed;
      setParam(speed, context, nextSpeed);
      setParam(engine.gain.gain, context, Math.max(SILENCE, volumeRef.current * nextSpeed));
      if (progress < 1) automationFrameRef.current = requestAnimationFrame(tick);
      else setStatus(nextMuted ? 'paused' : 'playing');
    };
    automationFrameRef.current = requestAnimationFrame(tick);
  }, [clearAutomation, clearCrossfade, startTrack]);

  const toggleMuted = React.useCallback(() => {
    const nextMuted = !mutedRef.current;
    mutedRef.current = nextMuted;
    intendedPlayingRef.current = true;
    setMuted(nextMuted);
    applyManualMuteState(nextMuted);
  }, [applyManualMuteState]);

  const play = React.useCallback(() => {
    intendedPlayingRef.current = true;
    mutedRef.current = false;
    setMuted(false);
    applyManualMuteState(false);
  }, [applyManualMuteState]);

  const pause = React.useCallback(() => {
    intendedPlayingRef.current = false;
    mutedRef.current = true;
    setMuted(true);
    applyManualMuteState(true);
  }, [applyManualMuteState]);

  const togglePlayback = React.useCallback(() => {
    if (mutedRef.current || status !== 'playing') play();
    else pause();
  }, [pause, play, status]);

  const toggleMute = React.useCallback(() => toggleMuted(), [toggleMuted]);

  const setVolume = React.useCallback((nextVolume: number) => {
    const safeVolume = clamp(nextVolume);
    volumeRef.current = safeVolume;
    setVolumeState(safeVolume);
    const context = contextRef.current;
    const gain = engineRef.current?.gain.gain;
    if (context && gain && !mutedRef.current) setParam(gain, context, safeVolume * playbackSpeedRef.current);
  }, []);

  const seek = React.useCallback((seconds: number) => {
    const engine = engineRef.current;
    if (!engine || !Number.isFinite(engine.buffer.duration) || engine.buffer.duration <= 0) return;
    const safeTime = clamp(seconds, 0, engine.buffer.duration);
    engine.node.port.postMessage({ seekCursor: safeTime * engine.buffer.sampleRate });
    setCurrentTime(safeTime);
  }, []);

  const retry = React.useCallback(() => {
    mutedRef.current = false;
    intendedPlayingRef.current = true;
    setMuted(false);
    void startTrack(activeTrackRef.current);
  }, [startTrack]);

  React.useEffect(() => {
    const onVisibilityChange = () => {
      const context = contextRef.current;
      if (!context) return;
      if (document.hidden) {
        hiddenPausedRef.current = context.state === 'running';
        void context.suspend();
      } else if (hiddenPausedRef.current && intendedPlayingRef.current && !mutedRef.current) {
        hiddenPausedRef.current = false;
        void context.resume().catch(() => setStatus('error'));
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  React.useEffect(() => () => {
    engineGenerationRef.current += 1;
    stopCurrentEngine();
    void contextRef.current?.close();
  }, [stopCurrentEngine]);

  return {
    status,
    activeTrack,
    currentTime,
    duration,
    volume,
    muted,
    isAudible: status === 'playing' && !muted,
    startIntro,
    beginHold,
    abortHold,
    continueIntoGallery,
    play,
    pause,
    togglePlayback,
    toggleMuted,
    toggleMute,
    setVolume,
    seek,
    retry,
  };
}

export type GallerySoundtrackController = ReturnType<typeof useGallerySoundtrack>;
