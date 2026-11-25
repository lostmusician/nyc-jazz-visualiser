import * as THREE from 'three';

// Shared by the paper and dust so particles detach from the eroding boundary.
const erosion = /* glsl */ `
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);
}
float threshold(vec2 uv) {
  float edge = min(min(uv.x,1.-uv.x),min(uv.y,1.-uv.y));
  return clamp(edge * 0.85 + noise(uv*13.)*0.43 + noise(uv*77.)*0.13, 0.02, 0.98);
}
`;
const vertex = /* glsl */ `
varying vec2 vUv;
#include <fog_pars_vertex>
void main() {
  vUv=uv;
  vec4 mvPosition=modelViewMatrix*vec4(position,1.);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}
`;

export function createPaperMaterial(texture: THREE.Texture) {
  return new THREE.ShaderMaterial({
    uniforms: { ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog), uMap: { value: texture }, uProgress: { value: 0 }, uOpacity: { value: 1 }, uReduced: { value: 0 } },
    fog: true,
    vertexShader: vertex,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform float uProgress, uOpacity, uReduced;
      varying vec2 vUv;
      #include <fog_pars_fragment>
      ${erosion}
      void main() {
        vec4 color=texture2D(uMap,vUv);
        float grain=threshold(vUv);
        float coverage=uReduced>.5 ? 1.-uProgress : smoothstep(uProgress-.008,uProgress+.008,grain);
        if (uProgress<=0.) coverage=1.;
        if (uProgress>=1.) coverage=0.;
        float rim=(1.-smoothstep(0.,.025,grain-uProgress))*step(uProgress,grain)*step(.001,uProgress);
        color.rgb=mix(color.rgb,vec3(.22,.19,.17),rim*.3*(1.-uReduced));
        gl_FragColor=vec4(color.rgb,color.a*coverage*uOpacity);
        #include <fog_fragment>
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
    transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false,
  });
}

export function createAshMaterial(texture: THREE.Texture, pixelRatio: number) {
  return new THREE.ShaderMaterial({
    uniforms: { uMap: { value: texture }, uProgress: { value: 0 }, uOpacity: { value: 1 }, uOpening: { value: 0 }, uPixelRatio: { value: pixelRatio } },
    vertexShader: /* glsl */ `
      uniform float uProgress, uOpening, uPixelRatio;
      attribute vec2 aUv;
      attribute float aSeed;
      varying vec2 vUv;
      varying float vAlpha;
      ${erosion}
      void main() {
        vUv=aUv;
        float born=threshold(aUv);
        float age=max(0.,uProgress-born);
        float alive=step(born,uProgress)*(1.-smoothstep(.02,.24,age));
        float drift=age*5.;
        vec3 p=position;
        float direction=uOpening>.5 ? -1. : 1.;
        p.x+=direction*(.24+aSeed*.48)*drift + sin(aSeed*30.+age*7.)*age*.5;
        p.y+=(.4+aSeed*.65)*drift;
        p.z+=sin(aSeed*17.)*age*.3;
        vAlpha=alive*(1.-smoothstep(.93,1.,uProgress));
        gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
        gl_PointSize=(1.1+aSeed*1.7)*uPixelRatio;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform float uOpacity;
      varying vec2 vUv;
      varying float vAlpha;
      void main() {
        float shape=1.-smoothstep(.2,.5,length(gl_PointCoord-.5));
        vec3 color=mix(texture2D(uMap,vUv).rgb,vec3(.52,.47,.40),.45);
        gl_FragColor=vec4(color,vAlpha*shape*uOpacity*.85);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
    transparent: true, depthWrite: false, toneMapped: false,
  });
}

export function createAshGeometry(seed: number, count = 1500) {
  const positions = new Float32Array(count * 3);
  const uvs = new Float32Array(count * 2);
  const seeds = new Float32Array(count);
  let value = seed || 1;
  const random = () => { value = (Math.imul(value, 1664525) + 1013904223) >>> 0; return value / 4294967296; };
  for (let i=0; i<count; i++) {
    const u=random(), v=random();
    positions.set([u-.5,v-.5,.001],i*3);
    uvs.set([u,v],i*2);
    seeds[i]=random();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
  geometry.setAttribute('aUv', new THREE.BufferAttribute(uvs,2));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds,1));
  return geometry;
}
