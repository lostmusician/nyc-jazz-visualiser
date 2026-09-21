import React from 'react';

export const ExhibitTransition: React.FC<{ number: string; eyebrow: string; question: string; next: string }> = ({ number, eyebrow, question, next }) => (
  <aside className="exhibit-transition" aria-label={`Transition to ${next}`}>
    <div className="font-typewriter">ROOM {number} / {eyebrow}</div>
    <p className="font-display">{question}</p>
    <a href={`#${next}`}>Enter the next room <span aria-hidden="true">↓</span></a>
  </aside>
);
