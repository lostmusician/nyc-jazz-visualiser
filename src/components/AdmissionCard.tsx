import React from 'react';
import { useMuseumVisit } from '../context/useMuseumVisit';

const stamps = [
  ['listening', 'EAR'], ['clubs', 'ROOM'], ['economics', 'LEDGER'], ['map', 'CITY'],
] as const;

export const AdmissionCard: React.FC = () => {
  const { completedExhibits } = useMuseumVisit();
  return (
    <div className="admission-card" aria-label="Digital museum admission card">
      <div><span className="font-typewriter">ADMIT ONE</span><b className="font-display">Night rooms of New York</b></div>
      <div className="admission-stamps">
        {stamps.map(([id, label]) => <span key={id} className={completedExhibits.includes(id) ? 'is-stamped' : ''}>{completedExhibits.includes(id) ? '✓' : '○'} {label}</span>)}
      </div>
    </div>
  );
};
