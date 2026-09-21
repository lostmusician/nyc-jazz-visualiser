import React from 'react';
import { MUSEUM_ROOMS } from '../data/museum';
import type { ExhibitId } from '../types';
import { useMuseumVisit } from '../context/useMuseumVisit';

interface MuseumRoomFrameProps extends React.PropsWithChildren {
  roomId: ExhibitId;
  onReturn: () => void;
}

export const MuseumRoomFrame: React.FC<MuseumRoomFrameProps> = ({ roomId, onReturn, children }) => {
  const { completedExhibits, audioMuted, toggleMuted } = useMuseumVisit();
  const room = MUSEUM_ROOMS.find((item) => item.id === roomId)!;
  const complete = completedExhibits.includes(roomId);

  return (
    <div className="night-room-shell" style={{ '--room-accent': room.accent } as React.CSSProperties}>
      <nav className="night-room-nav" aria-label="Current museum room">
        <button type="button" onClick={onReturn} className="night-room-back">← Foyer</button>
        <div><span>Room {room.number}</span><b>{room.title}</b></div>
        <button type="button" onClick={toggleMuted} aria-pressed={audioMuted} aria-label={audioMuted ? 'Enable exhibit sound' : 'Mute exhibit sound'}>
          {audioMuted ? 'Sound off' : 'Sound on'}
        </button>
      </nav>
      {children}
      <footer className="room-departure">
        <span>{complete ? `Room ${room.number} stamped` : `Leave room ${room.number}`}</span>
        <p>{complete ? 'The room remains lit in the foyer.' : 'You can return before completing an interaction.'}</p>
        <button type="button" onClick={onReturn}>Return to the floor plan <span aria-hidden="true">→</span></button>
      </footer>
    </div>
  );
};
