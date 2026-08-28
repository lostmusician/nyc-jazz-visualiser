import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';
import { motion } from 'framer-motion';

interface SketchProps {
  className?: string;
  animate?: boolean;
}

export const DrumKitSketch: React.FC<SketchProps> = ({ className = "w-52 h-44", animate = true }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const rc = rough.svg(svg);

    // 1. Large Circle: Bass Drum (Kick) in center-bottom
    const bassDrum = rc.circle(120, 140, 75, {
      stroke: "#231b14",
      strokeWidth: 3.5,
      fill: "#ecd9b5",
      fillStyle: "hachure",
      hachureAngle: 45,
      hachureGap: 6,
      roughness: 1.8,
    });
    // Bass drum rim & spurs (legs)
    const spurLeft = rc.line(90, 165, 75, 185, { stroke: "#231b14", strokeWidth: 3 });
    const spurRight = rc.line(150, 165, 165, 185, { stroke: "#231b14", strokeWidth: 3 });
    svg.appendChild(bassDrum);
    svg.appendChild(spurLeft);
    svg.appendChild(spurRight);

    // 2. Medium Circle: Snare Drum on stand (left)
    const snare = rc.ellipse(70, 105, 45, 24, {
      stroke: "#231b14",
      strokeWidth: 2.8,
      fill: "#fbf8f0",
      fillStyle: "solid",
      roughness: 1.5,
    });
    const snareStand = rc.line(70, 117, 70, 175, { stroke: "#231b14", strokeWidth: 2.5 });
    const snareLeg1 = rc.line(70, 175, 55, 190, { stroke: "#231b14", strokeWidth: 2 });
    const snareLeg2 = rc.line(70, 175, 85, 190, { stroke: "#231b14", strokeWidth: 2 });
    svg.appendChild(snare);
    svg.appendChild(snareStand);
    svg.appendChild(snareLeg1);
    svg.appendChild(snareLeg2);

    // 3. Medium Circle: Tom-Tom mounted atop kick
    const tom = rc.ellipse(115, 80, 36, 20, {
      stroke: "#231b14",
      strokeWidth: 2.8,
      fill: "#ecd9b5",
      fillStyle: "solid",
      roughness: 1.6,
    });
    svg.appendChild(tom);

    // 4. Cymbals: Hi-Hat (left) & Ride Cymbal (right)
    // Hi-Hat Cymbals (2 flat angled ellipses on high stand)
    const hihatTop = rc.ellipse(40, 70, 42, 10, {
      stroke: "#231b14",
      strokeWidth: 2.2,
      fill: "#c59b4c",
      fillStyle: "solid",
      roughness: 1.4,
    });
    const hihatStand = rc.line(40, 70, 40, 185, { stroke: "#231b14", strokeWidth: 2.5 });
    svg.appendChild(hihatTop);
    svg.appendChild(hihatStand);

    // Ride / Crash Cymbal (right)
    const rideCymbal = rc.ellipse(180, 75, 48, 12, {
      stroke: "#231b14",
      strokeWidth: 2.2,
      fill: "#c59b4c",
      fillStyle: "solid",
      roughness: 1.5,
    });
    const rideStand = rc.line(180, 75, 175, 180, { stroke: "#231b14", strokeWidth: 2.5 });
    svg.appendChild(rideCymbal);
    svg.appendChild(rideStand);

    // 5. Two Crossed Drumsticks (thin lines)
    const stick1 = rc.line(55, 60, 105, 110, {
      stroke: "#8c7456",
      strokeWidth: 2.5,
      roughness: 0.8,
    });
    const stick2 = rc.line(110, 65, 60, 115, {
      stroke: "#8c7456",
      strokeWidth: 2.5,
      roughness: 0.8,
    });
    svg.appendChild(stick1);
    svg.appendChild(stick2);
  }, []);

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      animate={animate ? { rotate: [-0.8, 0.8, -0.8] } : {}}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 240 200"
        className="w-full h-full overflow-visible select-none"
      />
    </motion.div>
  );
};
