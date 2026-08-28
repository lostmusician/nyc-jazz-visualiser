import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';
import { motion } from 'framer-motion';

interface SketchProps {
  className?: string;
  animate?: boolean;
}

export const UprightBassSketch: React.FC<SketchProps> = ({ className = "w-44 h-60", animate = true }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const rc = rough.svg(svg);

    // 1. Long thin neck sticking up
    const neck = rc.rectangle(84, 40, 12, 100, {
      stroke: "#231b14",
      strokeWidth: 3,
      fill: "#231b14",
      fillStyle: "solid",
      roughness: 1.4,
    });
    svg.appendChild(neck);

    // Scroll & Pegbox at very top
    const scroll = rc.circle(90, 28, 18, {
      stroke: "#231b14",
      strokeWidth: 3,
      roughness: 1.6,
    });
    const peg1 = rc.line(76, 25, 104, 25, { stroke: "#231b14", strokeWidth: 3 });
    const peg2 = rc.line(76, 33, 104, 33, { stroke: "#231b14", strokeWidth: 3 });
    svg.appendChild(scroll);
    svg.appendChild(peg1);
    svg.appendChild(peg2);

    // 2. Big rounded figure-8 body (stacked upper bout and lower bout ovals/curves)
    const upperBout = rc.ellipse(90, 140, 75, 60, {
      stroke: "#231b14",
      strokeWidth: 3.5,
      fill: "#ecd9b5",
      fillStyle: "hachure",
      hachureAngle: -35,
      hachureGap: 5,
      roughness: 1.9,
    });
    const lowerBout = rc.ellipse(90, 205, 95, 80, {
      stroke: "#231b14",
      strokeWidth: 3.5,
      fill: "#ecd9b5",
      fillStyle: "hachure",
      hachureAngle: -35,
      hachureGap: 5,
      roughness: 2.0,
    });
    svg.appendChild(upperBout);
    svg.appendChild(lowerBout);

    // F-Holes on the body
    const fHoleLeft = rc.curve([[70, 160], [66, 175], [72, 190]], {
      stroke: "#231b14",
      strokeWidth: 3,
      roughness: 1.5,
    });
    const fHoleRight = rc.curve([[110, 160], [114, 175], [108, 190]], {
      stroke: "#231b14",
      strokeWidth: 3,
      roughness: 1.5,
    });
    svg.appendChild(fHoleLeft);
    svg.appendChild(fHoleRight);

    // Bridge rectangle
    const bridge = rc.rectangle(78, 185, 24, 7, {
      stroke: "#231b14",
      strokeWidth: 2,
      fill: "#c59b4c",
      fillStyle: "solid",
    });
    svg.appendChild(bridge);

    // Tailpiece & Endpin
    const tailpiece = rc.polygon([[84, 215], [96, 215], [92, 246], [88, 246]], {
      stroke: "#231b14",
      fill: "#231b14",
      fillStyle: "solid",
    });
    const endpin = rc.line(90, 246, 90, 260, { stroke: "#231b14", strokeWidth: 3.5 });
    svg.appendChild(tailpiece);
    svg.appendChild(endpin);

    // 3. Four thin lines down the neck for strings
    const stringX = [86, 88.5, 91.5, 94];
    stringX.forEach((x) => {
      const stringLine = rc.line(x, 26, x, 215, {
        stroke: "#73604d",
        strokeWidth: 1.4,
        roughness: 0.8,
      });
      svg.appendChild(stringLine);
    });
  }, []);

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      animate={animate ? { rotate: [-1.2, 1.2, -1.2] } : {}}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 180 270"
        className="w-full h-full overflow-visible select-none"
      />
    </motion.div>
  );
};
