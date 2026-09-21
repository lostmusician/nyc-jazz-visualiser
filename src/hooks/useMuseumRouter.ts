import { useCallback, useEffect, useState } from 'react';
import type { ExhibitId, MuseumRoute } from '../types';

const ROOM_HASHES: Record<ExhibitId, string> = {
  listening: '#room/listening',
  clubs: '#room/clubs',
  economics: '#room/economics',
  map: '#room/map',
};

export const parseMuseumRoute = (hash: string): MuseumRoute => {
  if (hash === '#foyer') return 'foyer';
  const room = (Object.entries(ROOM_HASHES) as Array<[ExhibitId, string]>)
    .find(([, roomHash]) => roomHash === hash)?.[0];
  return room || 'entrance';
};

const parseRoute = (): MuseumRoute => typeof window === 'undefined' ? 'entrance' : parseMuseumRoute(window.location.hash);

export const routeHash = (route: MuseumRoute) => {
  if (route === 'entrance') return '#';
  if (route === 'foyer') return '#foyer';
  return ROOM_HASHES[route];
};

export const useMuseumRouter = () => {
  const [route, setRoute] = useState<MuseumRoute>(parseRoute);

  useEffect(() => {
    const sync = () => setRoute(parseRoute());
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  const navigate = useCallback((next: MuseumRoute) => {
    const hash = routeHash(next);
    if (window.location.hash === hash) {
      setRoute(next);
      return;
    }
    window.location.hash = hash;
  }, []);

  return { route, navigate };
};
