import type { CSSProperties } from 'react';
import type { JourneyProgress } from '../utils/journey';

const PEOPLE = [
  { x: 18, y: 72, scale: .82 }, { x: 27, y: 66, scale: 1 },
  { x: 38, y: 74, scale: .76 }, { x: 49, y: 63, scale: 1.08 },
  { x: 61, y: 72, scale: .88 }, { x: 72, y: 65, scale: 1 },
  { x: 82, y: 73, scale: .72 },
];

export function MemoryStage({ position }: { position: JourneyProgress; walk?: number; paused?: boolean }) {
  const populated = position.chapter === 'clubs' || position.chapter === 'economics';
  return (
    <div className="room-stage" aria-hidden="true" data-world={position.chapter} style={{ '--chapter-progress': position.progress } as CSSProperties}>
      <div className="room-light" />
      <div className="room-outline">
        <i className="room-floor" />
        <i className="room-stage-line" />
        <i className="room-door" />
        <i className="listening-light listening-light-a" />
        <i className="listening-light listening-light-b" />
        <div className="room-piano"><i /><b /></div>
        <div className="room-people">
          {PEOPLE.map((person, index) => <i key={index} className={populated && index < 4 + Math.round(position.progress * 3) ? 'is-present' : ''} style={{ '--x': `${person.x}%`, '--y': `${person.y}%`, '--person-scale': person.scale } as CSSProperties} />)}
        </div>
      </div>
    </div>
  );
}
