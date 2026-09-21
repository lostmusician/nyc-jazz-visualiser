import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { SaxophoneSketch } from './sketches/SaxophoneSketch';
export function MemoryPassage({ kind }: { kind:'score'|'receipt'|'city' }) {
  const ref=useRef<HTMLElement>(null), reduced=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});
  const rotation=useTransform(scrollYProgress,[0,1],[-15,15]);
  const scale=useTransform(scrollYProgress,[0,.6,1],[.65,1,kind==='city'?5:1.25]);
  const rotateX=useTransform(scrollYProgress,[0,1],[55,0]);
  return <section ref={ref} className={`memory-passage passage-${kind}`} aria-label={kind==='score'?'Between listening and memory':kind==='receipt'?'Behind the performance':'From one room to the city'}>
    <div className="passage-sticky">
      <motion.div className="passage-object" aria-hidden="true" style={reduced?{}:{rotate:rotation,scale,rotateX:kind==='city'?rotateX:0}}>
        {kind==='score'?<><SaxophoneSketch animate={false}/><div className="score-lines"><i/><i/><i/><i/><i/></div></>:kind==='receipt'?<div className="remembered-ticket"><span>ADMIT ONE</span><b>One night.</b><em>And everything it takes.</em><div className="ticket-rules"/></div>:<div className="expanding-grid"/>}
      </motion.div>
      <p>{kind==='score'?'A sound needs somewhere to happen.':kind==='receipt'?'Every night has a morning after.':'Step back. The rooms become a city.'}</p>
    </div>
  </section>;
}
