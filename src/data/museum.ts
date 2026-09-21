import type { MuseumRoomDefinition } from '../types';

export const MUSEUM_ROOMS: MuseumRoomDefinition[] = [
  {
    id: 'listening', number: '01', title: 'Listening Booth', shortTitle: 'Listen',
    question: 'Which set would you stay for?', accent: '#d7a650', objectLabel: 'Two unlabelled recordings',
  },
  {
    id: 'clubs', number: '02', title: 'Inside the Clubs', shortTitle: 'Enter',
    question: 'What had to be in the room for a sound to emerge?', accent: '#b9513d', objectLabel: 'Four musical ecosystems',
  },
  {
    id: 'economics', number: '03', title: 'Keep the Room Open', shortTitle: 'Balance',
    question: 'Which part of the night absorbs the pressure?', accent: '#9f7650', objectLabel: 'One illustrative month',
  },
  {
    id: 'map', number: '04', title: 'City Archive', shortTitle: 'Trace',
    question: 'What pattern appears when we step back?', accent: '#547e7b', objectLabel: 'Venues and residential rent',
  },
];
