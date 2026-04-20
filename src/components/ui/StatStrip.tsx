import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Stat } from './Stat';
import type { StatProps } from './Stat';
import useLowMotionMode from '../../hooks/useLowMotionMode';

export interface StatStripProps {
  items: StatProps[];
  className?: string;
}

export function StatStrip({ items, className }: StatStripProps) {
  const lowMotion = useLowMotionMode();

  const container = lowMotion
    ? undefined
    : {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.06, delayChildren: 0.04 },
        },
      };
  const child = lowMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 12 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
        },
      };

  return (
    <GlassCard
      variant="soft"
      padding="md"
      hoverable={false}
      className={className}
    >
      <motion.div
        className="grid grid-cols-2 gap-y-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center"
        variants={container}
        initial={lowMotion ? false : 'hidden'}
        whileInView={lowMotion ? undefined : 'show'}
        viewport={{ once: true, amount: 0.3 }}
      >
        {items.map((item, index) => (
          <Fragment key={`${item.label}-${index}`}>
            <motion.div variants={child}>
              <Stat {...item} />
            </motion.div>
            {index < items.length - 1 ? (
              <div
                aria-hidden="true"
                className="h-10 w-px bg-slate-200/80 dark:bg-slate-700/60 mx-4 sm:mx-6 md:mx-8 hidden sm:block"
              />
            ) : null}
          </Fragment>
        ))}
      </motion.div>
    </GlassCard>
  );
}
