import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { changeProgress, type DecadeTransitionState } from '../gallery/decade-transition';
import { createAshGeometry, createAshMaterial, createPaperMaterial } from './ash-material';

const PAPER = new THREE.PlaneGeometry(1, 1);

export function CardErosion({ texture, closing, transition, opacity }: {
  texture: THREE.Texture;
  closing: boolean;
  transition: DecadeTransitionState;
  opacity: React.RefObject<number>;
}) {
  const { gl, camera } = useThree();
  const projected = React.useMemo(() => new THREE.Vector3(), []);
  const paper = React.useMemo(() => createPaperMaterial(texture), [texture]);
  const ash = React.useMemo(() => createAshMaterial(texture, gl.getPixelRatio()), [texture, gl]);
  const dust = React.useMemo(() => createAshGeometry(173, 600), []);
  const groupRef = React.useRef<THREE.Group>(null);
  const pointsRef = React.useRef<THREE.Points>(null);
  React.useEffect(() => () => { paper.dispose(); ash.dispose(); dust.dispose(); }, [paper, ash, dust]);
  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    group.getWorldPosition(projected).project(camera);
    const inView = Math.abs(projected.x) < 1.5 && Math.abs(projected.y) < 1.5 && projected.z > -1 && projected.z < 1;
    group.visible = inView && opacity.current > .02;
    if (!group.visible) return;
    const p = changeProgress(transition.clock.seconds, transition.reducedMotion);
    const erosion = closing ? p.closing : 1-p.opening;
    paper.uniforms.uProgress.value = erosion;
    paper.uniforms.uReduced.value = transition.reducedMotion ? 1 : 0;
    paper.uniforms.uOpacity.value = opacity.current;
    ash.uniforms.uProgress.value = erosion;
    ash.uniforms.uOpening.value = closing ? 0 : 1;
    ash.uniforms.uOpacity.value = opacity.current * (closing ? 1 : .45);
    group.visible = erosion < 1;
    if (pointsRef.current) pointsRef.current.visible = erosion > 0 && erosion < 1;
  });
  return <group ref={groupRef} position={[0,0,.01]}>
    <mesh geometry={PAPER} material={paper} />
    {!transition.reducedMotion && <points ref={pointsRef} geometry={dust} material={ash} frustumCulled={false} />}
  </group>;
}
