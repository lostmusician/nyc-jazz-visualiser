import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';
import { motion } from 'framer-motion';

interface SketchProps {
  className?: string;
  animate?: boolean;
}

export const TrumpetSketch: React.FC<SketchProps> = ({ className = "w-52 h-36", animate = true }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const rc = rough.svg(svg);

    // 1. Mouthpiece circle/cone at left
    const mouthpiece = rc.polygon(
      [
        [15, 62],
        [28, 67],
        [28, 73],
        [15, 78],
      ],
      {
        stroke: "#231b14",
        strokeWidth: 2,
        fill: "#231b14",
        fillStyle: "solid",
        roughness: 1.2,
      }
    );
    svg.appendChild(mouthpiece);

    // 2. Straight tubes running horizontally
    const topTube = rc.line(28, 70, 160, 70, {
      stroke: "#231b14",
      strokeWidth: 3.5,
      roughness: 1.4,
    });
    const bottomTube = rc.line(45, 82, 155, 82, {
      stroke: "#231b14",
      strokeWidth: 3.0,
      roughness: 1.5,
    });
    const rearLoop = rc.curve([[45, 82], [30, 76], [45, 70]], {
      stroke: "#231b14",
      strokeWidth: 3.0,
      roughness: 1.6,
    });
    svg.appendChild(topTube);
    svg.appendChild(bottomTube);
    svg.appendChild(rearLoop);

    // 3. Three small parallel cylinders sticking up (the valves)
    const valveXCoords = [80, 96, 112];
    valveXCoords.forEach((x) => {
      // Cylinder body
      const cylinder = rc.rectangle(x - 5, 48, 10, 42, {
        stroke: "#231b14",
        strokeWidth: 2.2,
        fill: "#edd8b2",
        fillStyle: "solid",
        roughness: 1.3,
      });
      // Piston cap
      const cap = rc.circle(x, 44, 7, {
        stroke: "#231b14",
        strokeWidth: 2,
        fill: "#c59b4c",
        fillStyle: "solid",
        roughness: 1.4,
      });
      svg.appendChild(cylinder);
      svg.appendChild(cap);
    });

    // 4. Flaring Cone / Bell at the right end
    const flaredBell = rc.polygon(
      [
        [160, 70],
        [195, 42],
        [198, 100],
        [155, 82],
      ],
      {
        stroke: "#231b14",
        strokeWidth: 3,
        fill: "#ecd9b5",
        fillStyle: "hachure",
        hachureAngle: 60,
        hachureGap: 3.5,
        roughness: 1.8,
      }
    );
    svg.appendChild(flaredBell);

    // Harmon Mute inserted inside bell
    const mute = rc.polygon(
      [
        [198, 62],
        [215, 65],
        [215, 78],
        [198, 80],
      ],
      {
        stroke: "#231b14",
        strokeWidth: 2.5,
        fill: "#c59b4c",
        fillStyle: "solid",
        roughness: 1.5,
      }
    );
    svg.appendChild(mute);

    // 5. Sound Burst Waves
    const sound1 = rc.arc(205, 72, 40, 50, -0.9, 0.9, false, {
      stroke: "#a63d2b",
      strokeWidth: 2.2,
      roughness: 2.0,
    });
    const sound2 = rc.arc(215, 72, 65, 75, -1.0, 1.0, false, {
      stroke: "#c59b4c",
      strokeWidth: 1.8,
      roughness: 2.3,
    });
    svg.appendChild(sound1);
    svg.appendChild(sound2);
  }, []);

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      animate={animate ? { rotate: [1, -1.5, 1], y: [0, -2, 0] } : {}}
      transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 240 140"
        className="w-full h-full overflow-visible select-none"
      />
    </motion.div>
  );
};
