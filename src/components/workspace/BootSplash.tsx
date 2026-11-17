'use client';

import { AnimatePresence, motion } from 'framer-motion';

const HEX_GRADIENT_ID = 'academy-boot-hex-gradient';

export default function BootSplash({
  done,
  onSkip,
}: {
  done: boolean;
  onSkip?: () => void;
}) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          onClick={onSkip}
          className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-[#090A0F]"
          exit={{ opacity: 0, scale: 1.03, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          <div className="relative flex h-28 w-28 items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full border border-dashed border-[#00F0FF]/25"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
            />
            <svg width="52" height="52" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <defs>
                <linearGradient
                  id={HEX_GRADIENT_ID}
                  x1="8"
                  y1="4"
                  x2="56"
                  y2="60"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#00F0FF" />
                  <stop offset="100%" stopColor="#8A2BE2" />
                </linearGradient>
              </defs>
              <path
                d="M32 4 L56.2 18 L56.2 46 L32 60 L7.8 46 L7.8 18 Z"
                stroke={`url(#${HEX_GRADIENT_ID})`}
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M32 16 L45.9 24 L45.9 40 L32 48 L18.1 40 L18.1 24 Z"
                stroke={`url(#${HEX_GRADIENT_ID})`}
                strokeWidth="1.5"
                strokeLinejoin="round"
                opacity="0.55"
              />
            </svg>
          </div>

          <h1 className="mt-7 text-sm font-semibold tracking-[0.34em] text-slate-100">
            FULL-STACK ACADEMY
          </h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">
            Curriculum architecture · v1.1
          </p>

          <div className="mt-5 h-[3px] w-44 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full w-1/3 rounded-full bg-gradient-to-r from-[#00F0FF] via-[#10B981] to-[#8A2BE2]"
              initial={{ x: '-150%' }}
              animate={{ x: ['-150%', '350%'] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
