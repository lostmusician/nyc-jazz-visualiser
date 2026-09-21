import React from 'react';
import { ROOM_SCENES } from '../data/assets';
import { MUSEUM_ROOMS } from '../data/museum';
import type { ExhibitId } from '../types';

interface RoomTableauProps {
  roomId: ExhibitId;
  hinge: string;
}

export const RoomTableau: React.FC<RoomTableauProps> = ({ roomId, hinge }) => {
  const room = MUSEUM_ROOMS.find((item) => item.id === roomId)!;
  const scene = ROOM_SCENES[roomId];
  return (
    <header className={`room-tableau room-tableau-${roomId}`}>
      <img src={scene.layers[0].src} alt="" width="1400" height="900" />
      <div className="room-tableau-vignette" aria-hidden="true" />
      <div className="room-tableau-copy">
        <span>Room {room.number} / {hinge}</span>
        <h1 tabIndex={-1} data-route-heading>{room.title}</h1>
        <p>{room.question}</p>
      </div>
      <small>{scene.credit} Illustrative reconstruction.</small>
    </header>
  );
};
