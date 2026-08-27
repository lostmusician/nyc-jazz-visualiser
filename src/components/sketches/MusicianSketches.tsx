import React from 'react';
import { motion } from 'framer-motion';

export interface MusicianSketchProps {
  musician: 'coltrane' | 'miles' | 'monk' | 'billie' | 'monk_coltrane_duo';
  className?: string;
  animate?: boolean;
  showLabel?: boolean;
}

const INK = '#211a15';
const PAPER = '#fbf8f0';
const GOLD = '#b4873d';
const RED = '#9f4432';

const names: Record<MusicianSketchProps['musician'], string> = {
  coltrane: 'John Coltrane',
  miles: 'Miles Davis',
  monk: 'Thelonious Monk',
  billie: 'Billie Holiday',
  monk_coltrane_duo: 'John Coltrane & Thelonious Monk',
};

type PortraitProps = { animate: boolean };

const sharedLine = {
  stroke: INK,
  strokeWidth: 3.2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
};

function useSketchPath(animate: boolean) {
  return function SketchPath({
    delay = 0,
    ...props
  }: React.ComponentProps<typeof motion.path> & { delay?: number }) {
    return (
      <motion.path
        {...sharedLine}
        {...props}
        initial={animate ? { pathLength: 0, opacity: 0.35 } : false}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.15, delay, ease: 'easeInOut' }}
      />
    );
  };
}

/** Miles: closed-eye profile and a trumpet pushed straight into the frame. */
function MilesPortrait({ animate }: PortraitProps) {
  const SketchPath = useSketchPath(animate);

  return (
    <>
      <SketchPath
        d="M55 53 C71 31 111 29 130 50 C143 64 143 83 137 99 C133 109 139 116 132 123 C126 128 121 126 116 129 C105 139 87 139 74 130 C61 121 55 107 52 91 C49 75 48 63 55 53"
      />
      <SketchPath d="M57 63 C69 48 91 43 111 48" delay={0.08} />
      <SketchPath d="M70 86 Q82 79 94 86" delay={0.12} />
      <path d="M74 87 Q82 91 91 86" {...sharedLine} strokeWidth="2.4" />
      <SketchPath d="M104 83 C107 96 106 106 100 113 C106 116 112 116 116 112" delay={0.18} />
      <SketchPath d="M111 121 C119 116 128 117 136 122" delay={0.22} />

      {/* Trumpet mouthpiece, lead pipe and instantly readable bell. */}
      <SketchPath d="M134 120 L150 120 L157 116 L199 116" strokeWidth="3.5" delay={0.28} />
      <SketchPath d="M150 126 L199 126 M157 126 C158 139 186 141 188 126" delay={0.3} />
      <SketchPath d="M199 108 C213 108 224 113 231 120 C224 128 213 132 199 132 Z" delay={0.38} />
      <path d="M205 110 L205 130" {...sharedLine} strokeWidth="2.2" />
      <path d="M164 116 L164 101 M174 116 L174 99 M184 116 L184 103" {...sharedLine} strokeWidth="2.4" />
      <path d="M158 101 L170 101 M169 99 L179 99 M179 103 L190 103" {...sharedLine} strokeWidth="2.2" />

      {/* Valve hand and jacket shoulder. */}
      <SketchPath d="M151 142 C153 130 160 124 168 125 L181 137 C185 143 180 150 174 146 L166 139 L172 151 C175 158 167 162 163 155 L157 145 C157 157 149 158 147 150 Z" delay={0.42} />
      <SketchPath d="M73 132 C65 146 61 167 64 195 M115 133 C126 145 134 163 137 194" delay={0.48} />
      <path d="M65 194 Q99 177 138 194" {...sharedLine} fill={RED} fillOpacity="0.12" />
    </>
  );
}

/** Coltrane: compact, focused face enclosed by the sweeping tenor sax. */
function ColtranePortrait({ animate }: PortraitProps) {
  const SketchPath = useSketchPath(animate);

  return (
    <>
      <SketchPath d="M69 47 C85 31 116 31 132 45 C144 56 147 78 142 96 C139 112 127 126 109 129 C91 130 75 120 68 105 C61 91 59 58 69 47" />
      <SketchPath d="M68 57 C82 43 108 40 128 50" delay={0.06} />
      <path d="M76 77 Q88 70 99 77 M111 76 Q122 70 133 78" {...sharedLine} strokeWidth="2.5" />
      <path d="M82 80 Q89 84 96 79 M115 79 Q122 83 129 79" {...sharedLine} strokeWidth="2.1" />
      <SketchPath d="M104 77 L102 99 Q106 104 113 100" delay={0.14} />
      <SketchPath d="M89 109 Q106 116 124 108 M93 110 Q107 104 121 109" strokeWidth="2.4" delay={0.18} />

      {/* Curved sax neck meets his mouth, then crosses the torso. */}
      <SketchPath d="M119 110 L139 114 C153 118 158 129 153 139" stroke={GOLD} strokeWidth="3.5" delay={0.23} />
      <SketchPath d="M153 139 C143 153 139 172 144 192 C149 211 166 221 181 212" stroke={GOLD} strokeWidth="4" delay={0.28} />
      <SketchPath d="M160 140 C151 155 150 175 155 190 C160 204 171 209 181 202" stroke={GOLD} strokeWidth="2.8" delay={0.31} />
      <SketchPath d="M181 202 C194 194 207 194 218 202 C211 215 196 222 181 216 Z" stroke={GOLD} strokeWidth="3.5" delay={0.38} />
      <path d="M190 207 Q201 203 211 205" {...sharedLine} stroke={GOLD} strokeWidth="2.2" />

      {/* Key stack and both hands gripping the horn. */}
      <path d="M154 151 L163 197" {...sharedLine} stroke={GOLD} strokeWidth="2" />
      {[158, 169, 180, 191].map((y, index) => (
        <circle key={y} cx={158 + index} cy={y} r="3.3" fill={PAPER} stroke={INK} strokeWidth="2" />
      ))}
      <SketchPath d="M87 132 C77 144 71 162 70 187 M128 131 C137 139 142 147 145 158" delay={0.4} />
      <SketchPath d="M105 153 C119 145 137 148 151 160 L146 174 C134 166 122 164 111 169" delay={0.43} />
      <SketchPath d="M84 171 C98 161 111 164 121 174 C124 181 118 187 112 182 L104 176 L107 186 C109 193 101 196 97 190 L91 180" delay={0.47} />
      <path d="M69 188 Q105 176 145 191" {...sharedLine} fill={GOLD} fillOpacity="0.09" />
    </>
  );
}

/** Monk: beret, round dark glasses, goatee and percussive hands at a piano. */
function MonkPortrait({ animate }: PortraitProps) {
  const SketchPath = useSketchPath(animate);

  return (
    <>
      {/* Asymmetric beret rather than the generic wide fedora in the old sketch. */}
      <SketchPath d="M51 68 C61 42 92 31 126 38 C148 42 161 52 167 68 C135 61 88 62 51 68 Z" fill={INK} fillOpacity="0.12" />
      <SketchPath d="M45 70 C75 61 142 59 174 72" strokeWidth="4" delay={0.06} />
      <path d="M112 38 Q122 29 132 39" {...sharedLine} strokeWidth="2.5" />

      <SketchPath d="M62 72 C59 91 62 114 75 129 C87 144 108 150 126 142 C143 135 151 119 151 96 C151 84 148 76 143 69" delay={0.1} />
      {/* Round sunglasses are Monk's strongest facial shorthand. */}
      <circle cx="86" cy="91" r="14" fill={INK} fillOpacity="0.82" stroke={INK} strokeWidth="3" />
      <circle cx="124" cy="91" r="14" fill={INK} fillOpacity="0.82" stroke={INK} strokeWidth="3" />
      <path d="M100 90 Q105 85 110 90 M72 88 L61 84 M138 88 L151 84" {...sharedLine} strokeWidth="2.6" />
      <SketchPath d="M105 93 L101 112 Q105 117 112 113" delay={0.18} />
      <SketchPath d="M87 123 Q105 132 126 121" delay={0.22} />
      <path d="M99 130 Q106 148 114 130 Q122 148 127 126" fill={INK} stroke={INK} strokeWidth="2" />

      {/* Jacket, long hands, and a compact keyboard establish his playing posture. */}
      <SketchPath d="M69 132 C52 144 43 162 41 187 M133 137 C151 145 162 158 168 175" delay={0.29} />
      <SketchPath d="M82 158 C100 153 118 161 129 174 L151 184" delay={0.32} />
      <SketchPath d="M145 172 C158 168 172 173 181 183 L192 195 C196 201 189 207 184 202 L173 191 L181 205 C185 212 177 216 172 209 L162 196 L168 209 C171 216 162 219 158 212 L149 196" delay={0.38} />

      <path d="M29 190 L218 190 L211 221 L25 221 Z" fill={PAPER} stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
      <path d="M31 202 L214 202" {...sharedLine} strokeWidth="2" />
      {[48, 69, 90, 111, 132, 153, 174, 195].map((x) => (
        <path key={x} d={`M${x} 202 L${x - 2} 220`} {...sharedLine} strokeWidth="1.8" />
      ))}
      {[57, 78, 120, 141, 183].map((x) => (
        <path key={x} d={`M${x} 190 L${x} 210 L${x + 9} 210 L${x + 9} 190`} fill={INK} stroke={INK} strokeWidth="1.5" />
      ))}
    </>
  );
}

/** Billie: gardenias, an elegant singing profile, and a vintage microphone. */
function BilliePortrait({ animate }: PortraitProps) {
  const SketchPath = useSketchPath(animate);

  return (
    <>
      {/* Hair mass and gardenias form her unmistakable stage silhouette. */}
      <SketchPath
        d="M70 64 C77 35 111 27 136 42 C153 52 158 73 153 92 C147 80 136 68 119 62 C100 55 84 57 70 64 Z"
        fill={INK}
        fillOpacity="0.1"
      />
      <SketchPath
        d="M62 50 C48 39 51 24 65 23 C70 9 89 11 93 25 C108 21 117 36 108 47 C116 59 103 71 90 65 C82 78 64 70 65 57 C54 63 45 54 50 45 Z"
        fill={PAPER}
        delay={0.08}
      />
      <path d="M62 50 Q72 40 84 48 Q88 35 93 25 M83 48 Q97 45 108 47 M82 49 Q83 61 90 65" {...sharedLine} strokeWidth="2" />

      {/* Three-quarter singing profile with a closed eye and lifted chin. */}
      <SketchPath d="M77 66 C74 84 76 108 87 126 C96 141 111 151 127 146 C139 142 145 133 148 123 C153 120 158 115 154 110 C150 105 146 99 145 90 C142 75 131 66 119 62" delay={0.13} />
      <SketchPath d="M104 91 Q116 84 128 92" delay={0.18} />
      <path d="M108 92 Q116 97 125 91 M110 94 L108 99 M116 95 L116 101 M122 94 L125 99" {...sharedLine} strokeWidth="2.1" />
      <SketchPath d="M135 91 C136 102 140 109 148 112" delay={0.22} />
      <SketchPath d="M132 120 C139 115 149 116 156 122 C149 131 139 132 131 125 M135 123 Q145 126 153 122" stroke={RED} strokeWidth="2.6" delay={0.26} />

      {/* Necklace, shoulders and microphone. */}
      <SketchPath d="M91 134 C78 144 67 163 65 190 M128 146 C137 156 142 174 142 191" delay={0.31} />
      <SketchPath d="M89 149 Q111 166 134 151" stroke={GOLD} strokeWidth="2.4" delay={0.34} />
      {[99, 108, 117, 126].map((x, index) => (
        <circle key={x} cx={x} cy={155 + index * 2} r="2.3" fill={GOLD} />
      ))}
      <rect x="170" y="100" width="36" height="52" rx="17" fill={PAPER} stroke={INK} strokeWidth="3.2" />
      <path d="M178 110 H198 M175 120 H201 M175 130 H201 M178 140 H198 M188 102 V150" {...sharedLine} strokeWidth="1.8" />
      <path d="M188 152 V205 M170 205 H206" {...sharedLine} strokeWidth="3.4" />
      <path d="M65 190 Q104 177 143 191" {...sharedLine} fill={RED} fillOpacity="0.08" />
    </>
  );
}

/** Kept only so older pages using the former duo value do not crash. */
function LegacyDuoPortrait({ animate }: PortraitProps) {
  return (
    <>
      <g transform="translate(-12 28) scale(.63)">
        <ColtranePortrait animate={animate} />
      </g>
      <g transform="translate(105 28) scale(.63)">
        <MonkPortrait animate={animate} />
      </g>
    </>
  );
}

const portraits = {
  miles: MilesPortrait,
  coltrane: ColtranePortrait,
  monk: MonkPortrait,
  billie: BilliePortrait,
  monk_coltrane_duo: LegacyDuoPortrait,
};

export const MusicianSketch: React.FC<MusicianSketchProps> = ({
  musician,
  className = 'h-56 w-56',
  animate = true,
  showLabel = true,
}) => {
  // The fallback protects JavaScript callers and stale persisted values.
  const Portrait = portraits[musician] || BilliePortrait;
  const displayName = names[musician] || 'Jazz musician';

  return (
    <figure className={`relative inline-flex flex-col items-center ${className}`}>
      <svg
        viewBox="0 0 250 240"
        role="img"
        aria-label={`Line sketch of ${displayName}`}
        className="min-h-0 w-full flex-1 select-none overflow-visible"
      >
        <Portrait animate={animate} />
      </svg>
      {showLabel && (
        <figcaption className="mt-1 shrink-0 font-hand text-sm font-bold text-[#6f5942]">
          {displayName}
        </figcaption>
      )}
    </figure>
  );
};
