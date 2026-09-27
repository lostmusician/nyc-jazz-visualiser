/*
 * Tonearm geometry adapted to TypeScript from Codrops RecordPlayer main.js.
 * Original: Copyright 2016 Codrops, MIT licensed.
 * https://github.com/codrops/RecordPlayer/blob/master/js/main.js
 */
import { clamp } from './audio';

export interface Point {
  x: number;
  y: number;
}

export interface TonearmGeometry {
  pivot: Point;
  restAngle: number;
  startAngle: number;
  endAngle: number;
}

export const circleIntersections = (
  firstCenter: Point,
  firstRadius: number,
  secondCenter: Point,
  secondRadius: number,
): [Point, Point] | null => {
  const dx = secondCenter.x - firstCenter.x;
  const dy = secondCenter.y - firstCenter.y;
  const distance = Math.hypot(dx, dy);
  if (distance === 0 || distance > firstRadius + secondRadius || distance < Math.abs(firstRadius - secondRadius)) return null;

  const along = (firstRadius ** 2 - secondRadius ** 2 + distance ** 2) / (2 * distance);
  const height = Math.sqrt(Math.max(0, firstRadius ** 2 - along ** 2));
  const midpoint = {
    x: firstCenter.x + dx * along / distance,
    y: firstCenter.y + dy * along / distance,
  };
  const offset = { x: -dy * height / distance, y: dx * height / distance };
  return [
    { x: midpoint.x + offset.x, y: midpoint.y + offset.y },
    { x: midpoint.x - offset.x, y: midpoint.y - offset.y },
  ];
};

export const pointerAngleFromPivot = (pivot: Point, pointer: Point) => {
  const angle = Math.atan2(pointer.y - pivot.y, pointer.x - pivot.x) * 180 / Math.PI - 90;
  return ((angle % 360) + 360) % 360;
};

const playableIntersectionAngle = (pivot: Point, armLength: number, recordCenter: Point, radius: number) => {
  const intersections = circleIntersections(pivot, armLength, recordCenter, radius);
  if (!intersections) return null;
  const candidates = intersections
    .map((point) => pointerAngleFromPivot(pivot, point))
    .filter((angle) => angle >= 0 && angle <= 120)
    .sort((a, b) => a - b);
  return candidates[0] ?? null;
};

export const calculateTonearmGeometry = ({
  pivot,
  armLength,
  recordCenter,
  outerRadius,
  innerRadius,
}: {
  pivot: Point;
  armLength: number;
  recordCenter: Point;
  outerRadius: number;
  innerRadius: number;
}): TonearmGeometry | null => {
  const outerAngle = playableIntersectionAngle(pivot, armLength, recordCenter, outerRadius);
  const innerAngle = playableIntersectionAngle(pivot, armLength, recordCenter, innerRadius);
  if (outerAngle === null || innerAngle === null) return null;
  return {
    pivot,
    restAngle: 0,
    startAngle: Math.min(outerAngle, innerAngle),
    endAngle: Math.max(outerAngle, innerAngle),
  };
};

export const clampTonearmAngle = (angle: number, geometry: TonearmGeometry) =>
  clamp(angle, geometry.restAngle, geometry.endAngle);

export const progressForTonearmAngle = (angle: number, geometry: TonearmGeometry) => {
  const span = geometry.endAngle - geometry.startAngle;
  return span > 0 ? clamp((angle - geometry.startAngle) / span) : 0;
};

export const tonearmAngleForProgress = (progress: number, geometry: TonearmGeometry) =>
  geometry.startAngle + clamp(progress) * (geometry.endAngle - geometry.startAngle);
