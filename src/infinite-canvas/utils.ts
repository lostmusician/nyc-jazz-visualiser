/**
 * Deterministic chunk generation and LRU behavior adapted from Codrops Infinite
 * Canvas, commit 4e710decd0a99b2e312c594668dd2ccc834764ee (MIT).
 */
import * as THREE from 'three';
import { CHUNK_SIZE } from './constants';
import type { PlaneData } from './types';

const MAX_PLANE_CACHE = 256;
const planeCache = new Map<string, PlaneData[]>();

const hashString = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const touchPlaneCache = (key: string) => {
  const value = planeCache.get(key);
  if (!value) return;
  planeCache.delete(key);
  planeCache.set(key, value);
};

const evictPlaneCache = () => {
  while (planeCache.size > MAX_PLANE_CACHE) {
    const firstKey = planeCache.keys().next().value as string | undefined;
    if (!firstKey) break;
    planeCache.delete(firstKey);
  }
};

export const getChunkUpdateThrottleMs = (isZooming: boolean, zoomSpeed: number) => {
  if (zoomSpeed > 1) return 500;
  return isZooming ? 400 : 100;
};

export const generateChunkPlanes = (cx: number, cy: number, cz: number): PlaneData[] => {
  const planes: PlaneData[] = [];
  const seed = hashString(`${cx},${cy},${cz}`);
  for (let index = 0; index < 5; index += 1) {
    const itemSeed = seed + index * 1000;
    const random = (offset: number) => seededRandom(itemSeed + offset);
    const size = 12 + random(4) * 8;
    planes.push({
      id: `${cx}-${cy}-${cz}-${index}`,
      position: new THREE.Vector3(
        cx * CHUNK_SIZE + random(0) * CHUNK_SIZE,
        cy * CHUNK_SIZE + random(1) * CHUNK_SIZE,
        cz * CHUNK_SIZE + random(2) * CHUNK_SIZE,
      ),
      scale: new THREE.Vector3(size, size, 1),
      mediaIndex: Math.floor(random(5) * 1_000_000),
    });
  }
  return planes;
};

export const generateChunkPlanesCached = (cx: number, cy: number, cz: number) => {
  const key = `${cx},${cy},${cz}`;
  const cached = planeCache.get(key);
  if (cached) {
    touchPlaneCache(key);
    return cached;
  }
  const planes = generateChunkPlanes(cx, cy, cz);
  planeCache.set(key, planes);
  evictPlaneCache();
  return planes;
};

export const shouldThrottleUpdate = (lastUpdateTime: number, throttleMs: number, currentTime: number) =>
  currentTime - lastUpdateTime >= throttleMs;

export const getPlaneCacheSize = () => planeCache.size;
