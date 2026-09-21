import React from 'react';
import { motion } from 'framer-motion';
import { MUSEUM_ROOMS } from '../data/museum';
import { FOYER_SCENE } from '../data/assets';
import type { ExhibitId } from '../types';
import { AdmissionCard } from './AdmissionCard';
import { useMuseumVisit } from '../context/useMuseumVisit';

interface MuseumFoyerProps { onEnterRoom: (room: ExhibitId) => void; }

export const MuseumFoyer: React.FC<MuseumFoyerProps> = ({ onEnterRoom }) => {
  const { completedExhibits } = useMuseumVisit();

  return (
    <main className="night-foyer" aria-labelledby="foyer-title">
      <div className="foyer-atmosphere" aria-hidden="true" />
      <header className="foyer-heading">
        <p>NYC / AFTER HOURS / ADMISSION FOR ONE</p>
        <h1 id="foyer-title" tabIndex={-1} data-route-heading>Choose a room.</h1>
        <span>The museum does not prescribe an order. Each lit doorway holds one way of encountering a scene.</span>
      </header>

      <div className="foyer-plan" aria-label="Museum floor plan">
        <div className="foyer-plan-art" aria-hidden="true">
          <figure className="foyer-render">
            <img src={FOYER_SCENE.layers[0].src} alt="" width="1600" height="1000" />
            {MUSEUM_ROOMS.map((room, index) => (
              <span
                key={room.id}
                className={`foyer-render-glow foyer-render-glow-${index + 1} ${completedExhibits.includes(room.id) ? 'is-complete' : ''}`}
                style={{ '--room-accent': room.accent } as React.CSSProperties}
              />
            ))}
          </figure>
        </div>

        <ol className="foyer-door-list">
          {MUSEUM_ROOMS.map((room) => {
            const complete = completedExhibits.includes(room.id);
            return (
              <motion.li key={room.id} whileHover={{ y: -3 }}>
                <button
                  type="button"
                  onClick={() => onEnterRoom(room.id)}
                  className={complete ? 'is-complete' : ''}
                  style={{ '--room-accent': room.accent } as React.CSSProperties}
                  aria-label={`Enter room ${room.number}: ${room.title}${complete ? ', completed' : ''}`}
                >
                  <span className="foyer-door-number">{complete ? '✓' : room.number}</span>
                  <span className="foyer-door-copy"><b>{room.title}</b><small>{room.objectLabel}</small></span>
                  <span className="foyer-door-action">{complete ? 'Revisit' : room.shortTitle} →</span>
                </button>
              </motion.li>
            );
          })}
        </ol>
      </div>

      <aside className="foyer-card"><AdmissionCard /><p>{FOYER_SCENE.credit} <span>Illustrative reconstruction.</span></p></aside>
    </main>
  );
};
