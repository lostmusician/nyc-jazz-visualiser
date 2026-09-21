/**
 * Texture-cache strategy adapted from Codrops Infinite Canvas at commit
 * 4e710decd0a99b2e312c594668dd2ccc834764ee (MIT).
 */
import * as THREE from 'three';
import type { ClubMediaItem } from './types';

const textureCache = new Map<string, THREE.CanvasTexture>();
const MAX_TEXTURE_CACHE = 64;

const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
};

const paintCard = (context: CanvasRenderingContext2D, item: ClubMediaItem, image?: HTMLImageElement) => {
  const { venue, profile } = item;
  const width = 768;
  const height = 1000;
  context.clearRect(0, 0, width, height);
  context.fillStyle = '#17110e';
  context.fillRect(0, 0, width, height);

  if (image) {
    const targetHeight = 650;
    const scale = Math.max(width / image.naturalWidth, targetHeight / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    context.filter = 'sepia(.48) contrast(1.1) brightness(.78)';
    context.drawImage(image, (width - drawWidth) / 2, (targetHeight - drawHeight) / 2, drawWidth, drawHeight);
    context.filter = 'none';
    const fade = context.createLinearGradient(0, 390, 0, 700);
    fade.addColorStop(0, 'rgba(23,17,14,0)');
    fade.addColorStop(1, '#17110e');
    context.fillStyle = fade;
    context.fillRect(0, 390, width, 320);
  } else {
    const glow = context.createRadialGradient(180, 180, 10, 180, 180, 430);
    glow.addColorStop(0, 'rgba(190,78,42,.7)');
    glow.addColorStop(1, 'rgba(23,17,14,0)');
    context.fillStyle = glow;
    context.fillRect(0, 0, width, 650);
  }

  context.strokeStyle = '#d7aa56';
  context.lineWidth = 8;
  context.strokeRect(22, 22, width - 44, height - 44);
  context.fillStyle = '#d7aa56';
  context.font = '600 28px Arial';
  context.fillText(venue.properties.neighborhood.toUpperCase(), 62, 665);

  context.fillStyle = '#fff4dc';
  context.font = '700 64px Georgia';
  const lines = wrapText(context, venue.properties.name, width - 124);
  lines.forEach((line, index) => context.fillText(line, 62, 745 + index * 70));

  context.fillStyle = '#cdbda6';
  context.font = '32px Arial';
  const years = `${venue.properties.open_year ?? 'Unknown'} — ${venue.properties.close_year ?? 'Present'}`;
  context.fillText(years, 62, 945);
  context.fillStyle = '#d7aa56';
  context.beginPath();
  context.arc(690, 920, 27, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#17110e';
  context.beginPath();
  context.arc(690, 920, 8, 0, Math.PI * 2);
  context.fill();

  if (!profile.image) return;
};

export const getCardTexture = (item: ClubMediaItem) => {
  const key = item.venue.properties.id;
  const cached = textureCache.get(key);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 1000;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D is required to render club cards.');
  paintCard(context, item);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 4;
  textureCache.set(key, texture);
  while (textureCache.size > MAX_TEXTURE_CACHE) {
    const oldestKey = textureCache.keys().next().value as string | undefined;
    if (!oldestKey) break;
    textureCache.get(oldestKey)?.dispose();
    textureCache.delete(oldestKey);
  }

  const image = new Image();
  image.onload = () => {
    paintCard(context, item, image);
    texture.needsUpdate = true;
  };
  image.src = item.profile.image;
  return texture;
};

export const disposeCardTextures = () => {
  textureCache.forEach((texture) => texture.dispose());
  textureCache.clear();
};

export const getCardTextureCacheSize = () => textureCache.size;
