import React, { useEffect, useState } from 'react';
import type { ExhibitId } from '../types';
import { useMuseumVisit } from '../context/useMuseumVisit';

const ROOMS: Array<{ id: ExhibitId; href: string; short: string; label: string }> = [
  { id: 'listening', href: '#listening-booth', short: '01', label: 'Listening booth' },
  { id: 'clubs', href: '#club-exhibits', short: '02', label: 'Inside the clubs' },
  { id: 'economics', href: '#venue-economics', short: '03', label: 'Keep the room open' },
  { id: 'map', href: '#evidence-map', short: '04', label: 'City archive' },
];

export const MuseumNavigation: React.FC<{ visible: boolean }> = ({ visible }) => {
  const { completedExhibits, audioMuted, toggleMuted } = useMuseumVisit();
  const [active, setActive] = useState<ExhibitId>('listening');

  useEffect(() => {
    const elements = ROOMS.map((room) => document.querySelector(room.href)).filter(Boolean) as Element[];
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current) setActive((current.target.id === 'evidence-map' ? 'map' : current.target.id.replace('-booth', '').replace('club-exhibits', 'clubs').replace('venue-economics', 'economics')) as ExhibitId);
    }, { threshold: [0.2, 0.5], rootMargin: '-15% 0px -55% 0px' });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <nav className="museum-nav" aria-label="Museum rooms">
      <a href="#museum-main" className="skip-link">Skip to exhibits</a>
      <div className="museum-nav-brand font-typewriter" aria-label={`${completedExhibits.length} of 4 exhibits completed`}>
        <span>NYC / JAZZ</span><b>{completedExhibits.length}/4 stamps</b>
      </div>
      <div className="museum-room-links">
        {ROOMS.map((room) => {
          const complete = completedExhibits.includes(room.id);
          return (
            <a key={room.id} href={room.href} className={active === room.id ? 'is-active' : ''} aria-current={active === room.id ? 'location' : undefined}>
              <span>{complete ? '✓' : room.short}</span><b>{room.label}</b>
            </a>
          );
        })}
      </div>
      <button className="museum-mute" type="button" onClick={toggleMuted} aria-pressed={audioMuted} aria-label={audioMuted ? 'Unmute exhibit audio' : 'Mute exhibit audio'}>
        <span aria-hidden="true">{audioMuted ? '×' : '♪'}</span>{audioMuted ? 'Sound off' : 'Sound on'}
      </button>
    </nav>
  );
};
