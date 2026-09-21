import test from 'node:test';
import assert from 'node:assert/strict';
import {chapterFromHash, chapterProgress} from '../src/utils/journey.ts';
import {Soundscape, CROSSFADE_SECONDS} from '../src/services/soundscape.ts';
test('old room links and new chapter anchors resolve to the same chapter',()=>{
  for(const chapter of ['listening','clubs','economics','map']) {assert.equal(chapterFromHash(`#${chapter}`),chapter);assert.equal(chapterFromHash(`#room/${chapter}`),chapter);}
  assert.equal(chapterFromHash('#unknown'),'prologue');
});
test('chapter progress clamps cleanly at both boundaries',()=>{
  assert.equal(chapterProgress(100,1000,800),0);assert.equal(chapterProgress(-100,1000,800),.5);assert.equal(chapterProgress(-300,1000,800),1);
});
test('sound scene changes and disposal are safe before explicit audio opt-in',()=>{
  const scene=new Soundscape();scene.enterSoundScene('clubs');scene.leaveSoundScene('clubs');scene.interaction('door');scene.mute();scene.dispose();assert.equal(CROSSFADE_SECONDS,1);
});
test('ambient scenes crossfade through their own bus and mute all three buses',async()=>{
  const ramps:Array<[number,number]>=[], targets:number[]=[];
  let contexts=0, sources=0;
  const node=()=>({connect(){return this;},disconnect(){},gain:{value:0,cancelScheduledValues(){},setValueAtTime(){},linearRampToValueAtTime(value:number,time:number){ramps.push([value,time]);},setTargetAtTime(value:number){targets.push(value);}}});
  class FakeContext {
    currentTime=10;sampleRate=10;destination={};
    constructor(){contexts++;}
    resume(){return Promise.resolve();}close(){return Promise.resolve();}
    createGain(){return node();}
    createBuffer(){return {getChannelData:()=>new Float32Array(30)};}
    createBufferSource(){sources++;return {...node(),start(){},stop(){}};}
    createBiquadFilter(){return {...node(),frequency:{value:0}};}
  }
  const previous=Object.getOwnPropertyDescriptor(globalThis,'AudioContext');
  Object.defineProperty(globalThis,'AudioContext',{configurable:true,value:FakeContext});
  try {
    const scene=new Soundscape();scene.enterSoundScene('prologue');assert.equal(contexts,0);
    await scene.enable();assert.equal(contexts,1);assert.equal(targets.length,3);
    scene.enterSoundScene('prologue');scene.enterSoundScene('clubs');
    assert.equal(sources,2);assert.deepEqual(ramps,[[.055,11],[0,11],[.025,11]]);
    scene.mute();assert.deepEqual(targets.slice(-3),[0,0,0]);scene.dispose();
  } finally {if(previous)Object.defineProperty(globalThis,'AudioContext',previous);else Reflect.deleteProperty(globalThis,'AudioContext');}
});
