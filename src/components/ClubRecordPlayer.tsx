import React from 'react';
import { formatPlaybackTime, progressForTime } from '../gallery/audio';
import {
  calculateTonearmGeometry,
  clampTonearmAngle,
  pointerAngleFromPivot,
  progressForTonearmAngle,
  tonearmAngleForProgress,
  type TonearmGeometry,
} from '../gallery/turntable';
import type { GallerySoundtrackController } from '../hooks/useGallerySoundtrack';

export function ClubRecordPlayer({ venueName, audio }: {
  venueName: string;
  audio: GallerySoundtrackController;
}) {
  const deckRef = React.useRef<HTMLDivElement>(null);
  const recordRef = React.useRef<HTMLDivElement>(null);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const armRef = React.useRef<HTMLDivElement>(null);
  const cartridgeRef = React.useRef<HTMLElement>(null);
  const resumeAfterDragRef = React.useRef(false);
  const [geometry, setGeometry] = React.useState<TonearmGeometry | null>(null);
  const [dragAngle, setDragAngle] = React.useState<number | null>(null);

  const progress = progressForTime(audio.currentTime, audio.duration);
  const artist = audio.activeTrack.artist ?? 'Artist not supplied';
  const contextLabel = audio.activeTrack.decade ? `${audio.activeTrack.decade}s` : 'Gallery';
  const seekDisabled = audio.duration <= 0 || audio.status === 'error' || audio.status === 'loading';
  const playbackAngle = geometry
    ? tonearmAngleForProgress(progress, geometry)
    : 0;
  const tonearmAngle = dragAngle ?? (audio.isAudible ? playbackAngle : geometry?.restAngle ?? 0);

  const measureGeometry = React.useCallback(() => {
    const deck = deckRef.current;
    const record = recordRef.current;
    const label = labelRef.current;
    const arm = armRef.current;
    const cartridge = cartridgeRef.current;
    if (!deck || !record || !label || !arm || !cartridge) return;

    const pivot = {
      x: arm.offsetLeft + arm.offsetWidth / 2,
      y: arm.offsetTop + arm.offsetHeight * 0.07,
    };
    const cartridgeCenter = {
      x: arm.offsetLeft + cartridge.offsetLeft + cartridge.offsetWidth / 2,
      y: arm.offsetTop + cartridge.offsetTop + cartridge.offsetHeight / 2,
    };
    const recordCenter = {
      x: record.offsetParent instanceof HTMLElement
        ? record.offsetParent.offsetLeft + record.offsetLeft + record.offsetWidth / 2
        : record.offsetLeft + record.offsetWidth / 2,
      y: record.offsetParent instanceof HTMLElement
        ? record.offsetParent.offsetTop + record.offsetTop + record.offsetHeight / 2
        : record.offsetTop + record.offsetHeight / 2,
    };
    const stylusClearance = cartridge.offsetWidth / 2;
    const nextGeometry = calculateTonearmGeometry({
      pivot,
      armLength: Math.hypot(cartridgeCenter.x - pivot.x, cartridgeCenter.y - pivot.y),
      recordCenter,
      outerRadius: record.offsetWidth / 2 - stylusClearance,
      innerRadius: label.offsetWidth / 2 + stylusClearance,
    });
    if (nextGeometry) setGeometry(nextGeometry);
  }, []);

  React.useLayoutEffect(() => {
    measureGeometry();
    const deck = deckRef.current;
    if (!deck) return;
    const observer = new ResizeObserver(measureGeometry);
    observer.observe(deck);
    window.addEventListener('resize', measureGeometry);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measureGeometry);
    };
  }, [measureGeometry]);

  const angleFromPointer = React.useCallback((clientX: number, clientY: number) => {
    const deck = deckRef.current;
    if (!deck || !geometry) return null;
    const bounds = deck.getBoundingClientRect();
    return clampTonearmAngle(pointerAngleFromPivot(geometry.pivot, {
      x: clientX - bounds.left,
      y: clientY - bounds.top,
    }), geometry);
  }, [geometry]);

  const startDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if (seekDisabled || !geometry) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    resumeAfterDragRef.current = audio.isAudible;
    setDragAngle(playbackAngle);
    if (audio.isAudible) audio.pause();
  };

  const dragTonearm = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragAngle === null) return;
    const nextAngle = angleFromPointer(event.clientX, event.clientY);
    if (nextAngle !== null) setDragAngle(nextAngle);
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragAngle === null || !geometry) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const droppedAngle = angleFromPointer(event.clientX, event.clientY) ?? dragAngle;
    const droppedOnRecord = droppedAngle >= geometry.startAngle && droppedAngle <= geometry.endAngle;
    setDragAngle(null);
    if (!droppedOnRecord) return;
    audio.seek(progressForTonearmAngle(droppedAngle, geometry) * audio.duration);
    if (resumeAfterDragRef.current) void audio.play();
  };

  const seekWithKeyboard = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (seekDisabled || !geometry) return;
    const step = event.shiftKey ? 30 : 5;
    let nextTime: number | null = null;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') nextTime = audio.currentTime - step;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') nextTime = audio.currentTime + step;
    if (event.key === 'Home') nextTime = 0;
    if (event.key === 'End') nextTime = audio.duration;
    if (nextTime === null) return;
    event.preventDefault();
    audio.seek(nextTime);
  };

  return (
    <section
      className={`club-record-player${audio.isAudible ? ' is-playing' : ''}${dragAngle !== null ? ' is-dragging' : ''}${audio.status === 'error' ? ' has-error' : ''}`}
      aria-label={`${contextLabel} record player for ${venueName}`}
      data-audio-context={audio.activeTrack.decade ?? 'gallery'}
      data-tonearm-start={geometry?.startAngle}
      data-tonearm-end={geometry?.endAngle}
    >
      <div ref={deckRef} className="turntable-deck">
        <div className="turntable-platter" aria-hidden="true">
          <div ref={recordRef} className="turntable-record">
            <div ref={labelRef} className="turntable-label"><span>{venueName}</span><b>{contextLabel}</b></div>
          </div>
        </div>
        <div
          ref={armRef}
          className="turntable-arm"
          style={{ transform: `rotate(${tonearmAngle}deg)` }}
          role="slider"
          tabIndex={seekDisabled ? -1 : 0}
          aria-label={`Seek ${audio.activeTrack.title}`}
          aria-valuemin={0}
          aria-valuemax={Math.round(audio.duration)}
          aria-valuenow={Math.round(audio.currentTime)}
          aria-valuetext={`${formatPlaybackTime(audio.currentTime)} of ${formatPlaybackTime(audio.duration)}`}
          aria-disabled={seekDisabled}
          onPointerDown={startDragging}
          onPointerMove={dragTonearm}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onKeyDown={seekWithKeyboard}
        >
          <i aria-hidden="true" />
          <b ref={cartridgeRef} aria-hidden="true" />
        </div>
      </div>
      <div className="record-readout">
        <span>{contextLabel} soundtrack</span>
        <strong>{audio.activeTrack.title}</strong>
        <em>{artist}{audio.activeTrack.year ? ` · ${audio.activeTrack.year}` : ''}</em>
      </div>
      <div className="record-transport">
        {audio.status === 'error' ? (
          <button type="button" onClick={audio.retry}>Retry audio</button>
        ) : (
          <button type="button" onClick={audio.togglePlayback} disabled={audio.status === 'loading'}>
            {audio.status === 'loading' ? 'Loading…' : audio.isAudible ? 'Pause' : 'Play'}
          </button>
        )}
        <output aria-live="off">{formatPlaybackTime(audio.currentTime)} / {formatPlaybackTime(audio.duration)}</output>
        <button type="button" onClick={audio.toggleMute} disabled={audio.status === 'loading' || audio.status === 'error'}>
          {audio.muted ? 'Unmute' : 'Mute'}
        </button>
      </div>
      <label className="record-volume">
        <span>Volume</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={audio.volume}
          aria-label="Soundtrack volume"
          onChange={(event) => audio.setVolume(Number(event.currentTarget.value))}
        />
      </label>
      <p className="record-player-status" role="status" aria-live="polite">
        {audio.status === 'error' ? 'This soundtrack is unavailable. The gallery remains open.' : ''}
      </p>
    </section>
  );
}
