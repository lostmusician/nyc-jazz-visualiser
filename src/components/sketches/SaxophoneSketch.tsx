import React, { useEffect, useRef } from 'react';
import rough from 'roughjs';
import type { Options } from 'roughjs/bin/core';
import { motion, useReducedMotion } from 'framer-motion';

interface SketchProps {
  className?: string;
  animate?: boolean;
}

const INK = '#1c140e';
const BRASS = '#b18435';

export const SaxophoneSketch: React.FC<SketchProps> = ({
  className = 'w-44 h-72',
  animate = true,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const reduceMotion = useReducedMotion();
  const shouldAnimate = animate && !reduceMotion;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    svg.replaceChildren();
    const rc = rough.svg(svg);

    const wire: Options = {
      stroke: INK,
      strokeWidth: 2.5,
      roughness: 1.15,
      bowing: 0.8,
      fill: 'none',
    };
    const fineWire: Options = {
      ...wire,
      strokeWidth: 1.65,
      roughness: 1,
    };

    const add = (...nodes: SVGElement[]) => {
      nodes.forEach((node) => svg.appendChild(node));
    };

    // Mouthpiece and neck. The two rails stay close together until the body.
    add(
      rc.path('M 22 42 L 47 32 C 54 30, 60 31, 66 35', {
        ...wire,
        strokeWidth: 3.2,
      }),
      rc.path('M 25 50 L 49 40 C 55 38, 60 39, 65 42', wire),
      rc.path('M 22 42 L 25 50', fineWire),
      rc.path(
        'M 66 35 C 84 36, 99 46, 104 59 C 108 69, 105 78, 99 88',
        wire,
      ),
      rc.path(
        'M 65 42 C 78 43, 90 50, 95 61 C 99 70, 96 76, 91 84',
        wire,
      ),
      // Neck brace makes the neck-to-body transition legible.
      rc.path('M 91 84 L 99 88', fineWire),
    );

    // Body, bottom bow, and the outside rail rising into the bell.
    add(
      rc.path(
        [
          'M 91 84',
          'C 88 108, 87 142, 85 177',
          'L 82 226',
          'C 80 258, 93 278, 113 279',
          'C 135 280, 149 262, 153 236',
          'C 156 215, 158 197, 162 181',
        ].join(' '),
        wire,
      ),
      rc.path(
        [
          'M 99 88',
          'C 100 114, 100 145, 99 178',
          'L 98 224',
          'C 98 241, 104 251, 114 252',
          'C 124 253, 132 243, 134 226',
          'C 136 208, 137 194, 138 183',
        ].join(' '),
        wire,
      ),
    );

    // Bell: a narrow throat opens into a broad, upturned oval rim.
    add(
      rc.path('M 138 183 C 133 179, 129 175, 127 169', wire),
      rc.path('M 162 181 C 170 177, 176 172, 179 166', wire),
      rc.ellipse(153, 163, 55, 24, {
        ...wire,
        strokeWidth: 3,
        roughness: 1.25,
      }),
      rc.ellipse(153, 163, 39, 13, fineWire),
      rc.path('M 128 169 C 141 175, 165 176, 179 166', fineWire),
    );

    // Long key rod and six pearl key cups along the front of the body.
    add(rc.path('M 106 101 C 109 130, 108 173, 105 207', fineWire));

    const keys: Array<[number, number, number]> = [
      [102, 111, 9],
      [103, 129, 9],
      [103, 148, 10],
      [103, 168, 10],
      [102, 188, 10],
      [101, 207, 9],
    ];

    keys.forEach(([x, y, diameter]) => {
      add(
        rc.path(`M ${x - 5} ${y} L ${x - 12} ${y - 3}`, fineWire),
        rc.circle(x, y, diameter, {
          ...fineWire,
          strokeWidth: 1.9,
          fill: '#f4ead7',
          fillStyle: 'solid',
        }),
      );
    });

    // Low-key guards and side-key arms around the lower stack and bow.
    add(
      rc.path('M 86 192 C 74 196, 72 207, 82 213', fineWire),
      rc.circle(77, 203, 10, fineWire),
      rc.path('M 99 217 L 88 230', fineWire),
      rc.circle(85, 234, 12, fineWire),
      rc.path('M 99 229 L 106 241', fineWire),
      rc.circle(110, 245, 11, fineWire),
      rc.path('M 92 97 L 82 91 L 76 94', fineWire),
      rc.circle(74, 95, 8, fineWire),
    );

    // Upward-travelling sound waves match the direction of the bell opening.
    if (shouldAnimate) {
      add(
        rc.path('M 132 139 Q 153 126, 176 138', {
          ...fineWire,
          stroke: BRASS,
          strokeWidth: 2,
          roughness: 1.5,
        }),
        rc.path('M 124 127 Q 153 108, 184 125', {
          ...fineWire,
          stroke: '#a63d2b',
          strokeWidth: 1.7,
          roughness: 1.7,
        }),
      );
    }
  }, [shouldAnimate]);

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      animate={shouldAnimate ? { rotate: [-0.8, 1, -0.8], y: [0, -3, 0] } : {}}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 205 305"
        role="img"
        aria-label="Hand-drawn wire sculpture of a saxophone"
        className="h-full w-full select-none overflow-visible"
      />
    </motion.div>
  );
};
