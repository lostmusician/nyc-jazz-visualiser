import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';
import { motion } from 'framer-motion';

interface SketchProps {
  className?: string;
  animate?: boolean;
}

export const PianoSketch: React.FC<SketchProps> = ({ className = "w-56 h-32", animate = true }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const rc = rough.svg(svg);

    // 1. Piano outer keyboard chassis rectangle
    const chassis = rc.rectangle(15, 30, 210, 75, {
      stroke: "#231b14",
      strokeWidth: 3.5,
      fill: "#ecd9b5",
      fillStyle: "hachure",
      hachureAngle: 90,
      hachureGap: 12,
      roughness: 1.5,
    });
    svg.appendChild(chassis);

    // 2. White keys - 10 adjacent rectangles
    const whiteKeyWidth = 20;
    const startX = 20;
    for (let i = 0; i < 10; i++) {
      const whiteKey = rc.rectangle(startX + i * whiteKeyWidth, 40, whiteKeyWidth, 60, {
        stroke: "#231b14",
        strokeWidth: 2,
        fill: "#fbf8f0",
        fillStyle: "solid",
        roughness: 1.3,
      });
      svg.appendChild(whiteKey);
    }

    // 3. Black keys - alternating elevated rectangles
    // Standard piano black key pattern: 2, space, 3, space, 2
    const blackKeyIndices = [0, 1, 3, 4, 5, 7, 8];
    blackKeyIndices.forEach((idx) => {
      const blackKey = rc.rectangle(
        startX + idx * whiteKeyWidth + 13,
        40,
        13,
        38,
        {
          stroke: "#231b14",
          strokeWidth: 2,
          fill: "#231b14",
          fillStyle: "solid",
          roughness: 1.6,
        }
      );
      svg.appendChild(blackKey);
    });
  }, []);

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      animate={animate ? { y: [0, -2, 0] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 240 120"
        className="w-full h-full overflow-visible select-none"
      />
    </motion.div>
  );
};
