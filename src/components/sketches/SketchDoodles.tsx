import React from 'react';
import { motion } from 'framer-motion';

// Coffee Cup Ring Stain
export const CoffeeStain: React.FC<{ className?: string }> = ({ className = "w-28 h-28" }) => (
  <div className={`pointer-events-none select-none opacity-20 ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="50" cy="50" r="42" stroke="#7a4b28" strokeWidth="6" strokeDasharray="30 8 15 12" />
      <circle cx="50" cy="50" r="36" stroke="#5c381e" strokeWidth="2" strokeDasharray="20 18" />
      <path d="M48 20 C60 18 70 25 72 32" stroke="#7a4b28" strokeWidth="3" />
    </svg>
  </div>
);

// Hand-Drawn Arrow pointing to data
export const HandDrawnArrow: React.FC<{ text?: string; className?: string; flip?: boolean }> = ({
  text,
  className = "w-28",
  flip = false,
}) => (
  <div className={`inline-flex flex-col items-center select-none ${className} ${flip ? 'scale-x-[-1]' : ''}`}>
    {text && <span className="font-hand text-sm font-bold text-[#a63d2b] mb-1">{text}</span>}
    <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 overflow-visible">
      <motion.path
        d="M10 25 Q60 5 105 20"
        stroke="#a63d2b"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2 }}
      />
      <motion.path
        d="M92 12 L106 20 L96 30"
        stroke="#a63d2b"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8 }}
      />
    </svg>
  </div>
);

// Hand-Drawn Musical Staff & Notes
export const MusicalStaffDoodle: React.FC<{ className?: string }> = ({ className = "w-full h-12" }) => (
  <div className={`select-none opacity-40 overflow-hidden ${className}`}>
    <svg viewBox="0 0 400 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <line x1="0" y1="10" x2="400" y2="10" stroke="#231b14" strokeWidth="1.5" strokeDasharray="300 2" />
      <line x1="0" y1="18" x2="400" y2="18" stroke="#231b14" strokeWidth="1.5" strokeDasharray="300 2" />
      <line x1="0" y1="26" x2="400" y2="26" stroke="#231b14" strokeWidth="1.5" strokeDasharray="300 2" />
      <line x1="0" y1="34" x2="400" y2="34" stroke="#231b14" strokeWidth="1.5" strokeDasharray="300 2" />
      <line x1="0" y1="42" x2="400" y2="42" stroke="#231b14" strokeWidth="1.5" strokeDasharray="300 2" />

      {/* Treble Clef sketchy silhouette */}
      <path d="M25 46 C20 30 35 15 30 5 C25 20 15 35 25 48" stroke="#231b14" strokeWidth="2" fill="none" />
      {/* Scattered notes */}
      <circle cx="80" cy="26" r="4" fill="#231b14" />
      <line x1="84" y1="26" x2="84" y2="8" stroke="#231b14" strokeWidth="2" />
      <circle cx="140" cy="18" r="4" fill="#231b14" />
      <line x1="144" y1="18" x2="144" y2="2" stroke="#231b14" strokeWidth="2" />
      <circle cx="200" cy="34" r="4" fill="#231b14" />
      <line x1="204" y1="34" x2="204" y2="15" stroke="#231b14" strokeWidth="2" />
      <circle cx="260" cy="10" r="4" fill="#231b14" />
      <line x1="264" y1="10" x2="264" y2="-5" stroke="#231b14" strokeWidth="2" />
    </svg>
  </div>
);

// Archival Red Wax / Ink Stamp
export const ArchivalStamp: React.FC<{ label: string; sub?: string; className?: string }> = ({
  label,
  sub,
  className = "",
}) => (
  <div
    className={`inline-block border-2 border-dashed border-[#a63d2b] bg-[#faf0ec]/80 px-3 py-1.5 rounded text-center transform -rotate-3 select-none ${className}`}
  >
    <div className="font-typewriter text-[11px] font-bold text-[#a63d2b] tracking-wider leading-none uppercase">
      {label}
    </div>
    {sub && (
      <div className="font-hand text-[12px] font-bold text-[#8a2f1f] leading-tight mt-0.5">
        {sub}
      </div>
    )}
  </div>
);
