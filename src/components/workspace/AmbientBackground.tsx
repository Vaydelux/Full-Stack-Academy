'use client';

import { motion } from 'framer-motion';

const NOISE_TEXTURE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23grain)'/%3E%3C/svg%3E")`;

const GRID_IMAGE = [
  'repeating-linear-gradient(to right, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 48px)',
  'repeating-linear-gradient(to bottom, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 48px)',
].join(', ');

const LIGHT_GRID_IMAGE = [
  'repeating-linear-gradient(to right, rgba(15,23,42,0.03) 0px, rgba(15,23,42,0.03) 1px, transparent 1px, transparent 48px)',
  'repeating-linear-gradient(to bottom, rgba(15,23,42,0.03) 0px, rgba(15,23,42,0.03) 1px, transparent 1px, transparent 48px)',
].join(', ');

const GRID_MASK = 'radial-gradient(ellipse at 50% 40%, black 30%, transparent 75%)';

export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#f8f9fc] transition-colors duration-300 dark:bg-[#090A0F]"
    >
      {/* Dark mode spatial nebulae */}
      <div className="hidden dark:block">
        <motion.div
          className="absolute -left-24 -top-32 h-[520px] w-[520px] rounded-full blur-[120px] mix-blend-screen"
          style={{
            background:
              'radial-gradient(circle at center, rgba(0,240,255,0.5) 0%, rgba(0,240,255,0) 70%)',
            opacity: 0.13,
          }}
          animate={{ x: [0, 60, -35, 0], y: [0, -45, 30, 0], scale: [1, 1.12, 0.95, 1] }}
          transition={{ duration: 24, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-32 top-1/4 h-[600px] w-[600px] rounded-full blur-[120px] mix-blend-screen"
          style={{
            background:
              'radial-gradient(circle at center, rgba(138,43,226,0.5) 0%, rgba(138,43,226,0) 70%)',
            opacity: 0.11,
          }}
          animate={{ x: [0, -55, 40, 0], y: [0, 55, -40, 0], scale: [1, 0.92, 1.1, 1] }}
          transition={{ duration: 30, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-28 left-[6%] h-[480px] w-[480px] rounded-full blur-[120px] mix-blend-screen"
          style={{
            background:
              'radial-gradient(circle at center, rgba(16,185,129,0.45) 0%, rgba(16,185,129,0) 70%)',
            opacity: 0.07,
          }}
          animate={{ x: [0, 45, -30, 0], y: [0, -35, 25, 0], scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: 18, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
      </div>

      {/* Blueprint grid */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          backgroundImage: GRID_IMAGE,
          maskImage: GRID_MASK,
          WebkitMaskImage: GRID_MASK,
        }}
      />
      <div
        className="absolute inset-0 block dark:hidden"
        style={{
          backgroundImage: LIGHT_GRID_IMAGE,
          maskImage: GRID_MASK,
          WebkitMaskImage: GRID_MASK,
        }}
      />

      {/* Film grain & subtle vignette (dark mode) */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          backgroundImage: NOISE_TEXTURE,
          opacity: 0.035,
          mixBlendMode: 'overlay',
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(3,4,8,0.65) 100%)',
        }}
      />
    </div>
  );
}
