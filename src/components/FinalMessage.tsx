import { motion } from 'motion/react';
import { COUPLE_INFO, FINAL_MESSAGE_CONTENT } from '../config/anniversary';

export function FinalMessage() {
  return (
    <footer
      id="forever"
      aria-label="Anniversary closing dedication"
      className="relative surface-burgundy-linen text-[#FFF8F2] py-24 sm:py-32 px-5 sm:px-8 border-t border-[#C6A36A]/25 overflow-hidden"
    >
      {/* Subtle central radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(181,43,69,0.22),transparent_62%)]"
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 0.85, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl text-[#F7DDE2] mb-3"
        >
          {FINAL_MESSAGE_CONTENT.lead}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="font-[family-name:var(--font-editorial)] font-normal text-[clamp(2.35rem,7.5vw,4.15rem)] leading-[1.08] text-[#FFF8F2] mb-8"
        >
          {FINAL_MESSAGE_CONTENT.animatedLine}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, delay: 0.34 }}
          className="space-y-2.5 mb-10"
        >
          <p className="font-[family-name:var(--font-display)] text-xl sm:text-2xl text-[#FFF8F2]/95">
            {FINAL_MESSAGE_CONTENT.anniversaryGreeting}
          </p>
          <p className="font-[family-name:var(--font-script)] text-[2rem] sm:text-[2.35rem] text-[#F7DDE2]">
            {FINAL_MESSAGE_CONTENT.signOff}
          </p>
          <p className="text-sm sm:text-[15px] text-[#F7DDE2]/80 pt-1">
            {FINAL_MESSAGE_CONTENT.closingNote}
          </p>
        </motion.div>

        {/* Final restrained animated heart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, delay: 0.45 }}
          className="flex flex-col items-center gap-5"
        >
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#C6A36A]/40 bg-[#310916]/60"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#F7DDE2"
              className="text-[#F7DDE2]"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>

          <p className="text-[11px] tracking-[0.26em] uppercase text-[#C6A36A]/85 tabular-nums">
            {COUPLE_INFO.coupleDisplay} · {FINAL_MESSAGE_CONTENT.dateRange}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
