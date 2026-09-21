import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AudioPreference, ExhibitId } from '../types';
import { INITIAL_MUSEUM_VISIT, readMuseumVisit, writeMuseumVisit, type PersistedMuseumVisit } from '../utils/museumVisitState';
import { MuseumVisitContext, type MuseumVisitContextValue } from './useMuseumVisit';
import { Soundscape } from '../services/soundscape';
import type { JourneyChapter } from '../utils/journey';

const readVisit = () => typeof window === 'undefined' ? INITIAL_MUSEUM_VISIT : readMuseumVisit(window.localStorage);

export const MuseumVisitProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [visit, setVisit] = useState<PersistedMuseumVisit>(readVisit);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopTimerRef = useRef<number | null>(null);
  const soundscape = useRef(new Soundscape());
  const enterSoundScene=useCallback((scene:JourneyChapter)=>soundscape.current.enterSoundScene(scene),[]);
  const leaveSoundScene=useCallback((scene:JourneyChapter)=>soundscape.current.leaveSoundScene(scene),[]);
  const playInteraction=useCallback((kind:'step'|'paper'|'door')=>soundscape.current.interaction(kind),[]);
  const prepareMusic=useCallback((audio:HTMLMediaElement)=>soundscape.current.prepareMusic(audio),[]);

  useEffect(() => {
    writeMuseumVisit(window.localStorage, visit);
  }, [visit]);

  const stopAudio = useCallback(() => {
    if (stopTimerRef.current !== null) window.clearTimeout(stopTimerRef.current);
    stopTimerRef.current = null;
    audioRef.current?.pause();
    setActiveAudioId(null);
  }, []);

  const playClip = useCallback(async (id: string, src: string, excerpt: [number, number]) => {
    if (visit.audioPreference !== 'on') return;
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    if (stopTimerRef.current !== null) window.clearTimeout(stopTimerRef.current);
    audio.pause();
    audio.src = src;
    audio.currentTime = excerpt[0];
    audio.onerror = stopAudio;
    audio.onended = stopAudio;
    setActiveAudioId(id);
    try {
      await prepareMusic(audio);
      await audio.play();
      stopTimerRef.current = window.setTimeout(stopAudio, Math.max(0, excerpt[1] - excerpt[0]) * 1000);
    } catch (error) {
      stopAudio();
      throw error;
    }
  }, [stopAudio, visit.audioPreference, prepareMusic]);

  const claimAudio = useCallback((id: string) => {
    if (stopTimerRef.current !== null) window.clearTimeout(stopTimerRef.current);
    audioRef.current?.pause();
    setActiveAudioId(id);
  }, []);

  useEffect(() => {
    if (visit.audioPreference !== 'on') stopAudio();
  }, [stopAudio, visit.audioPreference]);

  useEffect(() => () => {
    if (stopTimerRef.current !== null) window.clearTimeout(stopTimerRef.current);
    audioRef.current?.pause();
    soundscape.current.dispose();
  }, []);

  const completeExhibit = useCallback((id: ExhibitId) => {
    setVisit((current) => current.completedExhibits.includes(id)
      ? current
      : { ...current, completedExhibits: [...current.completedExhibits, id] });
  }, []);

  const visitVenue = useCallback((id: string) => {
    setVisit((current) => current.visitedVenueIds.includes(id)
      ? current
      : { ...current, visitedVenueIds: [...current.visitedVenueIds, id] });
  }, []);

  const value = useMemo<MuseumVisitContextValue>(() => ({
    ...visit,
    audioMuted: visit.audioPreference !== 'on',
    activeAudioId,
    completeExhibit,
    visitVenue,
    setPollChoice: (pollChoice) => setVisit((current) => ({ ...current, pollChoice })),
    toggleMuted: () => { if(visit.audioPreference === 'on') soundscape.current.mute(); else void soundscape.current.enable(); setVisit((current) => ({ ...current, audioPreference: (current.audioPreference === 'on' ? 'off' : 'on') as AudioPreference })); },
    enterSoundScene,
    leaveSoundScene,
    playInteraction,
    prepareMusic,
    playClip,
    stopAudio,
    claimAudio,
  }), [activeAudioId, claimAudio, completeExhibit, playClip, stopAudio, visit, visitVenue, enterSoundScene, leaveSoundScene, playInteraction, prepareMusic]);

  return <MuseumVisitContext.Provider value={value}>{children}</MuseumVisitContext.Provider>;
};
