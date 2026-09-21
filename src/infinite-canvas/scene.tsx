/**
 * Camera, input, chunk streaming, and fade architecture adapted from
 * Codrops Infinite Canvas, commit 4e710decd0a99b2e312c594668dd2ccc834764ee.
 * Copyright (c) 2009–2025 Codrops, used under the MIT License.
 */
import { KeyboardControls, useKeyboardControls } from '@react-three/drei';
import { Canvas, type ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import React from 'react';
import * as THREE from 'three';
import { useIsTouchDevice } from '../hooks/useIsTouchDevice';
import {
  CHUNK_FADE_MARGIN,
  CHUNK_OFFSETS,
  CHUNK_SIZE,
  DEPTH_FADE_END,
  DEPTH_FADE_START,
  INITIAL_CAMERA_Z,
  INVIS_THRESHOLD,
  KEYBOARD_SPEED,
  MAX_VELOCITY,
  RENDER_DISTANCE,
  VELOCITY_DECAY,
  VELOCITY_LERP,
} from './constants';
import { getCardTexture } from './texture-manager';
import type { ChunkData, ClubMediaItem, InfiniteCanvasProps, PlaneData } from './types';
import { generateChunkPlanesCached, getChunkUpdateThrottleMs, shouldThrottleUpdate } from './utils';

const PLANE_GEOMETRY = new THREE.PlaneGeometry(1, 1);
const KEYBOARD_MAP = [
  { name: 'forward', keys: ['w', 'W', 'ArrowUp'] },
  { name: 'backward', keys: ['s', 'S', 'ArrowDown'] },
  { name: 'left', keys: ['a', 'A', 'ArrowLeft'] },
  { name: 'right', keys: ['d', 'D', 'ArrowRight'] },
  { name: 'up', keys: ['e', 'E'] },
  { name: 'down', keys: ['q', 'Q'] },
];

type KeyboardKeys = { forward: boolean; backward: boolean; left: boolean; right: boolean; up: boolean; down: boolean };
type CameraGridState = { cx: number; cy: number; cz: number; camZ: number };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

const getTouchDistance = (touches: Touch[]) => {
  if (touches.length < 2) return 0;
  const [first, second] = touches;
  return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
};

function ClubPlane({
  plane,
  media,
  chunk,
  cameraGridRef,
  hoveredVenueId,
  onHoverVenue,
  onSelectVenue,
}: {
  plane: PlaneData;
  media: ClubMediaItem;
  chunk: ChunkData;
  cameraGridRef: React.RefObject<CameraGridState>;
  hoveredVenueId: string | null;
  onHoverVenue: (venueId: string | null) => void;
  onSelectVenue: (venueId: string) => void;
}) {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const materialRef = React.useRef<THREE.MeshBasicMaterial>(null);
  const borderRef = React.useRef<THREE.MeshBasicMaterial>(null);
  const opacityRef = React.useRef(0);
  const texture = React.useMemo(() => getCardTexture(media), [media]);
  const isHighlighted = hoveredVenueId === media.venue.properties.id;
  const aspect = media.width / media.height;
  const displayScale = React.useMemo(() => new THREE.Vector3(plane.scale.y * aspect, plane.scale.y, 1), [aspect, plane.scale.y]);

  useFrame(() => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    const border = borderRef.current;
    if (!mesh || !material || !border) return;
    const cameraGrid = cameraGridRef.current;
    const gridDistance = Math.max(
      Math.abs(chunk.cx - cameraGrid.cx),
      Math.abs(chunk.cy - cameraGrid.cy),
      Math.abs(chunk.cz - cameraGrid.cz),
    );
    const depth = Math.abs(plane.position.z - cameraGrid.camZ);
    if (depth > DEPTH_FADE_END + 50) {
      opacityRef.current = 0;
      mesh.visible = false;
      return;
    }
    const gridFade = gridDistance <= RENDER_DISTANCE
      ? 1
      : Math.max(0, 1 - (gridDistance - RENDER_DISTANCE) / Math.max(CHUNK_FADE_MARGIN, 0.0001));
    const depthFade = depth <= DEPTH_FADE_START
      ? 1
      : Math.max(0, 1 - (depth - DEPTH_FADE_START) / Math.max(DEPTH_FADE_END - DEPTH_FADE_START, 0.0001));
    const target = Math.min(gridFade, depthFade * depthFade);
    opacityRef.current = target < INVIS_THRESHOLD && opacityRef.current < INVIS_THRESHOLD
      ? 0
      : lerp(opacityRef.current, target, 0.18);
    material.opacity = opacityRef.current;
    border.opacity = opacityRef.current * (isHighlighted ? 1 : 0.82);
    mesh.visible = opacityRef.current > INVIS_THRESHOLD;
    const emphasis = isHighlighted ? 1.08 : 1;
    mesh.scale.lerp(new THREE.Vector3(displayScale.x * emphasis, displayScale.y * emphasis, 1), 0.12);
  });

  const stopAndHover = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    document.body.style.cursor = 'pointer';
    onHoverVenue(media.venue.properties.id);
  };

  return (
    <mesh
      ref={meshRef}
      position={plane.position}
      scale={displayScale}
      visible={false}
      geometry={PLANE_GEOMETRY}
      onPointerOver={stopAndHover}
      onPointerOut={(event) => { event.stopPropagation(); document.body.style.cursor = ''; onHoverVenue(null); }}
      onClick={(event) => { event.stopPropagation(); onSelectVenue(media.venue.properties.id); }}
    >
      <meshBasicMaterial ref={materialRef} map={texture} transparent opacity={0} side={THREE.DoubleSide} toneMapped={false} />
      <mesh position={[0, 0, -0.04]} scale={[1.045, 1.035, 1]} geometry={PLANE_GEOMETRY}>
        <meshBasicMaterial ref={borderRef} color={isHighlighted ? '#ffd785' : '#6d482e'} transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
    </mesh>
  );
}

function Chunk({
  chunk,
  media,
  cameraGridRef,
  hoveredVenueId,
  onHoverVenue,
  onSelectVenue,
}: {
  chunk: ChunkData;
  media: ClubMediaItem[];
  cameraGridRef: React.RefObject<CameraGridState>;
  hoveredVenueId: string | null;
  onHoverVenue: (venueId: string | null) => void;
  onSelectVenue: (venueId: string) => void;
}) {
  const [planes, setPlanes] = React.useState<PlaneData[] | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    const generate = () => { if (!cancelled) setPlanes(generateChunkPlanesCached(chunk.cx, chunk.cy, chunk.cz)); };
    if (typeof requestIdleCallback !== 'undefined') {
      const id = requestIdleCallback(generate, { timeout: 100 });
      return () => { cancelled = true; cancelIdleCallback(id); };
    }
    const id = window.setTimeout(generate, 0);
    return () => { cancelled = true; window.clearTimeout(id); };
  }, [chunk.cx, chunk.cy, chunk.cz]);
  if (!planes || media.length === 0) return null;
  return <group>{planes.map((plane) => {
    const item = media[plane.mediaIndex % media.length];
    return <ClubPlane key={plane.id} plane={plane} media={item} chunk={chunk} cameraGridRef={cameraGridRef} hoveredVenueId={hoveredVenueId} onHoverVenue={onHoverVenue} onSelectVenue={onSelectVenue} />;
  })}</group>;
}

type ControllerState = {
  velocity: { x: number; y: number; z: number };
  targetVelocity: { x: number; y: number; z: number };
  basePosition: { x: number; y: number; z: number };
  drift: { x: number; y: number };
  mouse: { x: number; y: number };
  lastMouse: { x: number; y: number };
  scroll: number;
  dragging: boolean;
  touches: Touch[];
  touchDistance: number;
  lastChunkKey: string;
  lastChunkUpdate: number;
  pendingChunk: { cx: number; cy: number; cz: number } | null;
};

const initialControllerState = (): ControllerState => ({
  velocity: { x: 0, y: 0, z: 0 }, targetVelocity: { x: 0, y: 0, z: 0 },
  basePosition: { x: 0, y: 0, z: INITIAL_CAMERA_Z }, drift: { x: 0, y: 0 },
  mouse: { x: 0, y: 0 }, lastMouse: { x: 0, y: 0 }, scroll: 0, dragging: false,
  touches: [], touchDistance: 0, lastChunkKey: '', lastChunkUpdate: 0, pendingChunk: null,
});

function SceneController(props: Pick<InfiniteCanvasProps, 'media' | 'hoveredVenueId' | 'onHoverVenue' | 'onSelectVenue' | 'onTextureProgress'>) {
  const { camera, gl } = useThree();
  const [, getKeys] = useKeyboardControls<keyof KeyboardKeys>();
  const state = React.useRef(initialControllerState());
  const cameraGridRef = React.useRef<CameraGridState>({ cx: 0, cy: 0, cz: 0, camZ: camera.position.z });
  const [chunks, setChunks] = React.useState<ChunkData[]>([]);
  const reducedMotion = React.useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const textureProgressCallback = props.onTextureProgress;
  const mediaForProgress = props.media;

  React.useEffect(() => { textureProgressCallback?.(100); }, [textureProgressCallback, mediaForProgress]);

  React.useEffect(() => {
    const canvas = gl.domElement;
    const controller = state.current;
    canvas.style.cursor = 'grab';
    const mouseDown = (event: MouseEvent) => {
      controller.dragging = true;
      controller.lastMouse = { x: event.clientX, y: event.clientY };
      canvas.style.cursor = 'grabbing';
    };
    const mouseUp = () => { controller.dragging = false; canvas.style.cursor = 'grab'; };
    const mouseMove = (event: MouseEvent) => {
      controller.mouse = { x: event.clientX / window.innerWidth * 2 - 1, y: -(event.clientY / window.innerHeight * 2 - 1) };
      if (!controller.dragging) return;
      controller.targetVelocity.x -= (event.clientX - controller.lastMouse.x) * 0.025;
      controller.targetVelocity.y += (event.clientY - controller.lastMouse.y) * 0.025;
      controller.lastMouse = { x: event.clientX, y: event.clientY };
    };
    const wheel = (event: WheelEvent) => { event.preventDefault(); controller.scroll += event.deltaY * 0.006; };
    const touchStart = (event: TouchEvent) => {
      event.preventDefault();
      controller.touches = Array.from(event.touches) as Touch[];
      controller.touchDistance = getTouchDistance(controller.touches);
    };
    const touchMove = (event: TouchEvent) => {
      event.preventDefault();
      const touches = Array.from(event.touches) as Touch[];
      if (touches.length === 1 && controller.touches.length >= 1) {
        controller.targetVelocity.x -= (touches[0].clientX - controller.touches[0].clientX) * 0.02;
        controller.targetVelocity.y += (touches[0].clientY - controller.touches[0].clientY) * 0.02;
      } else if (touches.length === 2 && controller.touchDistance > 0) {
        const distance = getTouchDistance(touches);
        controller.scroll += (controller.touchDistance - distance) * 0.006;
        controller.touchDistance = distance;
      }
      controller.touches = touches;
    };
    const touchEnd = (event: TouchEvent) => {
      controller.touches = Array.from(event.touches) as Touch[];
      controller.touchDistance = getTouchDistance(controller.touches);
    };
    canvas.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);
    window.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('wheel', wheel, { passive: false });
    canvas.addEventListener('touchstart', touchStart, { passive: false });
    canvas.addEventListener('touchmove', touchMove, { passive: false });
    canvas.addEventListener('touchend', touchEnd, { passive: false });
    return () => {
      document.body.style.cursor = '';
      canvas.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
      window.removeEventListener('mousemove', mouseMove);
      canvas.removeEventListener('wheel', wheel);
      canvas.removeEventListener('touchstart', touchStart);
      canvas.removeEventListener('touchmove', touchMove);
      canvas.removeEventListener('touchend', touchEnd);
    };
  }, [gl]);

  useFrame(() => {
    const controller = state.current;
    const keys = getKeys();
    if (keys.forward) controller.targetVelocity.z -= KEYBOARD_SPEED;
    if (keys.backward) controller.targetVelocity.z += KEYBOARD_SPEED;
    if (keys.left) controller.targetVelocity.x -= KEYBOARD_SPEED;
    if (keys.right) controller.targetVelocity.x += KEYBOARD_SPEED;
    if (keys.down) controller.targetVelocity.y -= KEYBOARD_SPEED;
    if (keys.up) controller.targetVelocity.y += KEYBOARD_SPEED;

    const zooming = Math.abs(controller.velocity.z) > 0.05;
    const zoomFactor = clamp(controller.basePosition.z / 50, 0.3, 2);
    const driftAmount = reducedMotion ? 0 : 8 * zoomFactor;
    if (!controller.dragging) {
      controller.drift.x = lerp(controller.drift.x, controller.mouse.x * driftAmount, 0.12);
      controller.drift.y = lerp(controller.drift.y, controller.mouse.y * driftAmount, 0.12);
    }
    controller.targetVelocity.z += controller.scroll;
    controller.scroll *= 0.8;
    for (const axis of ['x', 'y', 'z'] as const) {
      controller.targetVelocity[axis] = clamp(controller.targetVelocity[axis], -MAX_VELOCITY, MAX_VELOCITY);
      controller.velocity[axis] = lerp(controller.velocity[axis], controller.targetVelocity[axis], VELOCITY_LERP);
      controller.basePosition[axis] += controller.velocity[axis];
      controller.targetVelocity[axis] *= reducedMotion ? 0.72 : VELOCITY_DECAY;
    }
    camera.position.set(
      controller.basePosition.x + controller.drift.x,
      controller.basePosition.y + controller.drift.y,
      controller.basePosition.z,
    );
    const cx = Math.floor(controller.basePosition.x / CHUNK_SIZE);
    const cy = Math.floor(controller.basePosition.y / CHUNK_SIZE);
    const cz = Math.floor(controller.basePosition.z / CHUNK_SIZE);
    cameraGridRef.current = { cx, cy, cz, camZ: controller.basePosition.z };
    const key = `${cx},${cy},${cz}`;
    if (key !== controller.lastChunkKey) {
      controller.pendingChunk = { cx, cy, cz };
      controller.lastChunkKey = key;
    }
    const now = performance.now();
    if (controller.pendingChunk && shouldThrottleUpdate(controller.lastChunkUpdate, getChunkUpdateThrottleMs(zooming, Math.abs(controller.velocity.z)), now)) {
      const next = controller.pendingChunk;
      controller.pendingChunk = null;
      controller.lastChunkUpdate = now;
      setChunks(CHUNK_OFFSETS.map((offset) => ({
        key: `${next.cx + offset.dx},${next.cy + offset.dy},${next.cz + offset.dz}`,
        cx: next.cx + offset.dx, cy: next.cy + offset.dy, cz: next.cz + offset.dz,
      })));
    }
  });

  React.useEffect(() => {
    setChunks(CHUNK_OFFSETS.map((offset) => ({ key: `${offset.dx},${offset.dy},${offset.dz}`, cx: offset.dx, cy: offset.dy, cz: offset.dz })));
  }, []);

  return <>{chunks.map((chunk) => <Chunk key={chunk.key} chunk={chunk} media={props.media} cameraGridRef={cameraGridRef} hoveredVenueId={props.hoveredVenueId} onHoverVenue={props.onHoverVenue} onSelectVenue={props.onSelectVenue} />)}</>;
}

export function InfiniteCanvasScene({
  media,
  hoveredVenueId,
  onHoverVenue,
  onSelectVenue,
  onTextureProgress,
  showControls = true,
  cameraFov = 60,
  cameraNear = 1,
  cameraFar = 500,
  fogNear = 120,
  fogFar = 320,
  backgroundColor = '#0b0807',
  fogColor = '#0b0807',
}: InfiniteCanvasProps) {
  const touch = useIsTouchDevice();
  const dpr = Math.min(window.devicePixelRatio || 1, touch ? 1.25 : 1.5);
  return (
    <KeyboardControls map={KEYBOARD_MAP}>
      <div className="infinite-canvas">
        <Canvas camera={{ position: [0, 0, INITIAL_CAMERA_Z], fov: cameraFov, near: cameraNear, far: cameraFar }} dpr={dpr} flat gl={{ antialias: false, powerPreference: 'high-performance' }}>
          <color attach="background" args={[backgroundColor]} />
          <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
          <SceneController media={media} hoveredVenueId={hoveredVenueId} onHoverVenue={onHoverVenue} onSelectVenue={onSelectVenue} onTextureProgress={onTextureProgress} />
        </Canvas>
        {showControls && <div className="canvas-controls" aria-hidden="true">{touch ? <><b>Drag</b> pan · <b>Pinch</b> depth</> : <><b>Drag</b> pan · <b>Scroll</b> depth · <b>WASD / QE</b> move</>}</div>}
      </div>
    </KeyboardControls>
  );
}
