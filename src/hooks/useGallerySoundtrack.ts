import React from 'react';
import { shouldSoundtrackBeAudible } from '../gallery/entry-state';

const SOUNDTRACK_URL = '/audio/skating-in-central-park.mp3';
const WORKLET_URL = '/audio/pitch-dropper-processor.js';
const FULL_VOLUME = 0.72;
const FADE_SECONDS = 0.55;

type SoundtrackStatus = 'idle' | 'loading' | 'playing' | 'dropping' | 'paused' | 'error';

const rampParam = (param: AudioParam, context: AudioContext, value: number, duration = FADE_SECONDS) => {
  const now = context.currentTime;
  param.cancelScheduledValues(now);
  param.setValueAtTime(param.value, now);
  param.linearRampToValueAtTime(value, now + duration);
};

export function useGallerySoundtrack() {
  const contextRef = React.useRef<AudioContext | null>(null);
  const nodeRef = React.useRef<AudioWorkletNode | null>(null);
  const gainRef = React.useRef<GainNode | null>(null);
  const bufferRef = React.useRef<AudioBuffer | null>(null);
  const generationRef = React.useRef(0);
  const dropFrameRef = React.useRef<number | null>(null);
  const pauseTimerRef = React.useRef<number | null>(null);
  const manualMutedRef = React.useRef(false);
  const recordPausedRef = React.useRef(false);
  const enteredRef = React.useRef(false);
  const [status, setStatus] = React.useState<SoundtrackStatus>('idle');
  const [manualMuted, setManualMuted] = React.useState(false);

  const clearAutomation = React.useCallback(() => {
    if (dropFrameRef.current !== null) cancelAnimationFrame(dropFrameRef.current);
    if (pauseTimerRef.current !== null) window.clearTimeout(pauseTimerRef.current);
    dropFrameRef.current = null;
    pauseTimerRef.current = null;
  }, []);

  const ensureContext = React.useCallback(async () => {
    let context = contextRef.current;
    if (!context || context.state === 'closed') {
      context = new AudioContext();
      contextRef.current = context;
      await context.audioWorklet.addModule(WORKLET_URL);
    }
    if (context.state === 'suspended') await context.resume();
    if (!bufferRef.current) {
      const response = await fetch(SOUNDTRACK_URL);
      if (!response.ok) throw new Error(`Soundtrack request failed: ${response.status}`);
      bufferRef.current = await context.decodeAudioData(await response.arrayBuffer());
    }
    return context;
  }, []);

  const stopNode = React.useCallback(() => {
    nodeRef.current?.disconnect();
    gainRef.current?.disconnect();
    nodeRef.current = null;
    gainRef.current = null;
  }, []);

  const startFresh = React.useCallback(async (fadeSeconds = 4) => {
    const generation = ++generationRef.current;
    clearAutomation();
    stopNode();
    setStatus('loading');
    try {
      const context = await ensureContext();
      if (generation !== generationRef.current) return false;
      const buffer = bufferRef.current;
      if (!buffer) return false;
      const node = new AudioWorkletNode(context, 'pitch-dropper-processor', { parameterData: { speed: 1 } });
      const gain = context.createGain();
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(FULL_VOLUME, context.currentTime + fadeSeconds);
      const left = new Float32Array(buffer.getChannelData(0));
      const right = new Float32Array(buffer.getChannelData(Math.min(1, buffer.numberOfChannels - 1)));
      node.port.postMessage({ leftBuffer: left.buffer, rightBuffer: right.buffer }, [left.buffer, right.buffer]);
      node.connect(gain).connect(context.destination);
      nodeRef.current = node;
      gainRef.current = gain;
      setStatus('playing');
      return true;
    } catch (error) {
      console.warn('Gallery soundtrack unavailable', error);
      setStatus('error');
      return false;
    }
  }, [clearAutomation, ensureContext, stopNode]);

  const beginHold = React.useCallback(() => {
    enteredRef.current = false;
    recordPausedRef.current = false;
    manualMutedRef.current = false;
    setManualMuted(false);
    void startFresh(4);
  }, [startFresh]);

  const abortHold = React.useCallback(() => {
    const context = contextRef.current;
    const node = nodeRef.current;
    const speed = node?.parameters.get('speed');
    const generation = ++generationRef.current;
    clearAutomation();
    if (!context || !node || !speed) {
      stopNode();
      setStatus('idle');
      return;
    }
    setStatus('dropping');
    const startedAt = performance.now();
    const tick = (now: number) => {
      if (generation !== generationRef.current) return;
      const progress = Math.min((now - startedAt) / 3000, 1);
      const nextSpeed = Math.pow(1 - progress, 3);
      rampParam(speed, context, nextSpeed, 0.05);
      if (progress < 1) dropFrameRef.current = requestAnimationFrame(tick);
      else {
        stopNode();
        setStatus('idle');
      }
    };
    dropFrameRef.current = requestAnimationFrame(tick);
  }, [clearAutomation, stopNode]);

  const continueIntoGallery = React.useCallback(() => {
    enteredRef.current = true;
    const context = contextRef.current;
    const gain = gainRef.current;
    if (context && gain && !manualMutedRef.current) rampParam(gain.gain, context, FULL_VOLUME, 0.4);
  }, []);

  const applyPauseState = React.useCallback((paused: boolean) => {
    const context = contextRef.current;
    const node = nodeRef.current;
    const gain = gainRef.current;
    const speed = node?.parameters.get('speed');
    if (!context || !gain || !speed) return;
    if (pauseTimerRef.current !== null) window.clearTimeout(pauseTimerRef.current);
    if (paused) {
      rampParam(gain.gain, context, 0.0001);
      pauseTimerRef.current = window.setTimeout(() => {
        speed.setValueAtTime(0, context.currentTime);
        setStatus('paused');
      }, FADE_SECONDS * 1000);
    } else {
      speed.setValueAtTime(1, context.currentTime);
      rampParam(gain.gain, context, FULL_VOLUME);
      setStatus('playing');
    }
  }, []);

  const toggleMuted = React.useCallback(() => {
    const next = !manualMutedRef.current;
    manualMutedRef.current = next;
    setManualMuted(next);
    if (!recordPausedRef.current) applyPauseState(next);
  }, [applyPauseState]);

  const pauseForRecord = React.useCallback(() => {
    recordPausedRef.current = true;
    applyPauseState(true);
  }, [applyPauseState]);

  const resumeAfterRecord = React.useCallback(() => {
    recordPausedRef.current = false;
    if (!manualMutedRef.current) applyPauseState(false);
  }, [applyPauseState]);

  React.useEffect(() => {
    const onVisibilityChange = () => {
      const context = contextRef.current;
      if (!context || !enteredRef.current) return;
      if (document.hidden) void context.suspend();
      else if (!manualMutedRef.current && !recordPausedRef.current) void context.resume();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  React.useEffect(() => () => {
    generationRef.current += 1;
    clearAutomation();
    stopNode();
    void contextRef.current?.close();
  }, [clearAutomation, stopNode]);

  return {
    status,
    manualMuted,
    isAudible: shouldSoundtrackBeAudible({ status, manualMuted, recordPaused: recordPausedRef.current, pageHidden: document.hidden }),
    beginHold,
    abortHold,
    continueIntoGallery,
    toggleMuted,
    pauseForRecord,
    resumeAfterRecord,
  };
}
