import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  "Meow!",
  "Code code code...",
  "Don't forget to rest!",
  "Algorithms are fun!",
  "Purr...",
  "You're doing great!",
  "Feed me bits!",
  "Bug? Where?",
  "Zzz...",
];

type PixelCatProps = {
  lowMotion?: boolean;
};

export default function PixelCat({ lowMotion = false }: PixelCatProps) {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [isSleeping, setIsSleeping] = useState(false);
  const [isExcited, setIsExcited] = useState(false);
  const [earTwitch, setEarTwitch] = useState(false);
  const [headTilt, setHeadTilt] = useState(false);
  const timeoutHandlesRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const [isBlinking, setIsBlinking] = useState(false);
  const sleeping = lowMotion ? false : isSleeping;
  const blinking = lowMotion ? false : isBlinking;
  const excited = lowMotion ? false : isExcited;
  const twitching = lowMotion ? false : earTwitch;
  const tilting = lowMotion ? false : headTilt;

  const clearAllTimeouts = () => {
    timeoutHandlesRef.current.forEach(handle => {
      clearTimeout(handle);
    });
    timeoutHandlesRef.current = [];
  };

  const scheduleTimeout = (callback: () => void, delay: number) => {
    const handle = setTimeout(() => {
      timeoutHandlesRef.current = timeoutHandlesRef.current.filter(currentHandle => currentHandle !== handle);
      callback();
    }, delay);
    timeoutHandlesRef.current.push(handle);
  };

  // Random behavior
  useEffect(() => {
    if (lowMotion) return;

    const interval = setInterval(() => {
      const random = Math.random();
      if (random < 0.22) {
        setIsSleeping(prev => !prev);
      } else if (random < 0.55 && !sleeping) {
        // Ear twitch (quick)
        setEarTwitch(true);
        scheduleTimeout(() => setEarTwitch(false), 320);
      } else if (random < 0.78 && !sleeping) {
        // Curious head tilt
        setHeadTilt(true);
        scheduleTimeout(() => setHeadTilt(false), 900);
      } else if (!sleeping) {
        // Show random message
        setMessage(messages[Math.floor(Math.random() * messages.length)]);
        setShowMessage(true);
        scheduleTimeout(() => setShowMessage(false), 3000);
      }
    }, 4200);

    // Blinking logic — occasional double-blink for personality
    const blinkInterval = setInterval(() => {
      if (!sleeping && Math.random() > 0.55) {
        setIsBlinking(true);
        scheduleTimeout(() => {
          setIsBlinking(false);
          // double-blink chance
          if (Math.random() > 0.75) {
            scheduleTimeout(() => {
              setIsBlinking(true);
              scheduleTimeout(() => setIsBlinking(false), 140);
            }, 140);
          }
        }, 160);
      }
    }, 2600);

    return () => {
      clearInterval(interval);
      clearInterval(blinkInterval);
      clearAllTimeouts();
    };
  }, [lowMotion, sleeping]);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  const handleClick = () => {
    setIsSleeping(false);
    if (!lowMotion) {
      setIsExcited(true);
      scheduleTimeout(() => setIsExcited(false), 600);
    }
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
    setShowMessage(true);
    scheduleTimeout(() => setShowMessage(false), 3000);
  };

  return (
    <motion.div
      drag={!lowMotion}
      dragMomentum={false}
      whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
      whileHover={lowMotion ? undefined : { scale: 1.08, rotate: -3 }}
      className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 z-30 cursor-grab touch-none"
      onClick={handleClick}
      initial={lowMotion ? false : { y: 100, opacity: 0 }}
      animate={
        lowMotion
          ? { opacity: 1 }
          : excited
            ? { y: [-18, 0], rotate: [0, -8, 8, -4, 0], opacity: 1 }
            : { y: 0, rotate: 0, opacity: 1 }
      }
      transition={
        lowMotion
          ? { duration: 0 }
          : excited
            ? { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }
            : { delay: 1, type: 'spring' }
      }
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-full mb-2 right-0 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] sm:text-xs font-bold py-2 px-3 rounded-xl shadow-lg border-2 border-slate-900 dark:border-slate-600 whitespace-nowrap pointer-events-none max-w-[200px] break-words z-50"
            style={{ fontFamily: "'Press Start 2P', cursive, sans-serif" }}
          >
            {message}
            <div className="absolute -bottom-2 right-4 sm:right-6 w-3 h-3 bg-white dark:bg-slate-800 border-r-2 border-b-2 border-slate-900 dark:border-slate-600 transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pixel Cat SVG */}
      <motion.div
        className="relative w-14 h-14 sm:w-20 sm:h-20 drop-shadow-xl"
        animate={
          lowMotion || sleeping
            ? undefined
            : { scale: excited ? [1, 1.12, 1] : [1, 1.015, 1] }
        }
        transition={
          lowMotion
            ? undefined
            : excited
              ? { duration: 0.45, ease: 'easeOut' }
              : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          style={{ shapeRendering: 'crispEdges' }}
        >
          {/* Tail — swishes with a smoother sine curve */}
          <motion.g
            animate={
              lowMotion
                ? undefined
                : sleeping
                  ? { rotate: 0 }
                  : excited
                    ? { rotate: [0, 28, -18, 22, 0] }
                    : { rotate: [0, 18, 6, -6, 0] }
            }
            transition={
              lowMotion
                ? undefined
                : excited
                  ? { duration: 0.6, ease: 'easeOut' }
                  : { repeat: Infinity, duration: 2.4, ease: 'easeInOut' }
            }
            style={{ transformOrigin: '27px 25px' }}
          >
            <rect x="26" y="24" width="2" height="2" fill="#d97706" />
            <rect x="28" y="22" width="2" height="2" fill="#d97706" />
            <rect x="29" y="20" width="2" height="2" fill="#fb923c" />
            <rect x="29" y="18" width="2" height="2" fill="#fb923c" />
          </motion.g>

          {/* Body — subtle breathing squash */}
          <motion.g
            animate={
              lowMotion
                ? undefined
                : sleeping
                  ? { y: 1, scaleY: 0.96 }
                  : { y: [0, -0.6, 0], scaleY: [1, 1.02, 1] }
            }
            transition={
              lowMotion
                ? undefined
                : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
            }
            style={{ transformOrigin: '17px 28px' }}
          >
            <rect x="8" y="18" width="18" height="10" rx="1" fill="#fb923c" />
            <rect x="10" y="20" width="14" height="6" fill="#fdba74" />

            {/* Paws — alternating tiny wiggle when excited */}
            <motion.g
              animate={
                lowMotion
                  ? undefined
                  : excited
                    ? { y: [0, -1.5, 0, -1.5, 0] }
                    : { y: 0 }
              }
              transition={
                lowMotion
                  ? undefined
                  : { duration: 0.45, ease: 'easeOut' }
              }
            >
              <rect x="8" y="27" width="3" height="2" fill="white" />
              <rect x="20" y="27" width="3" height="2" fill="white" />
            </motion.g>
            <rect x="14" y="27" width="3" height="2" fill="white" />
          </motion.g>

          {/* Head — tilts on curiosity, ears twitch independently */}
          <motion.g
            animate={
              lowMotion
                ? undefined
                : sleeping
                  ? { rotate: -4, y: 1 }
                  : tilting
                    ? { rotate: [-0, -7, -7, 0], y: 0 }
                    : { rotate: [0, 1, -1, 0], y: [0, -0.4, 0] }
            }
            transition={
              lowMotion
                ? undefined
                : tilting
                  ? { duration: 0.9, ease: 'easeInOut' }
                  : sleeping
                    ? { duration: 0.6 }
                    : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
            }
            style={{ transformOrigin: '13px 18px' }}
          >
            <rect x="6" y="10" width="14" height="10" fill="#fb923c" />

            {/* Ears — twitch animation */}
            <motion.g
              animate={
                lowMotion
                  ? undefined
                  : twitching
                    ? { rotate: [0, -14, 6, 0] }
                    : { rotate: 0 }
              }
              transition={
                lowMotion
                  ? undefined
                  : { duration: 0.32, ease: 'easeOut' }
              }
              style={{ transformOrigin: '7px 9px' }}
            >
              <rect x="6" y="8" width="2" height="2" fill="#d97706" />
              <rect x="7" y="7" width="2" height="2" fill="#fb923c" />
            </motion.g>
            <motion.g
              animate={
                lowMotion
                  ? undefined
                  : twitching
                    ? { rotate: [0, 10, -4, 0] }
                    : { rotate: 0 }
              }
              transition={
                lowMotion
                  ? undefined
                  : { duration: 0.32, ease: 'easeOut', delay: 0.08 }
              }
              style={{ transformOrigin: '19px 9px' }}
            >
              <rect x="18" y="8" width="2" height="2" fill="#d97706" />
              <rect x="17" y="7" width="2" height="2" fill="#fb923c" />
            </motion.g>

            {/* Face details */}
            {sleeping ? (
              <>
                <rect x="9" y="14" width="2" height="1" fill="#1e293b" />
                <rect x="15" y="14" width="2" height="1" fill="#1e293b" />
                <motion.text
                  x="22"
                  y="10"
                  className="text-[8px] font-bold fill-klein-500"
                  animate={lowMotion ? undefined : { opacity: [0, 1, 0], y: [-2, -6, -10] }}
                  transition={lowMotion ? undefined : { duration: 2, repeat: Infinity }}
                >
                  z
                </motion.text>
              </>
            ) : blinking ? (
              <>
                <rect x="9" y="14" width="2" height="1" fill="#1e293b" />
                <rect x="15" y="14" width="2" height="1" fill="#1e293b" />
              </>
            ) : excited ? (
              <>
                {/* Excited "^ ^" happy eyes */}
                <rect x="9" y="14" width="1" height="1" fill="#1e293b" />
                <rect x="10" y="13" width="1" height="1" fill="#1e293b" />
                <rect x="11" y="14" width="1" height="1" fill="#1e293b" />
                <rect x="15" y="14" width="1" height="1" fill="#1e293b" />
                <rect x="16" y="13" width="1" height="1" fill="#1e293b" />
                <rect x="17" y="14" width="1" height="1" fill="#1e293b" />
              </>
            ) : (
              <>
                <g>
                  <rect x="9" y="13" width="2" height="2" fill="#1e293b" />
                  <rect x="15" y="13" width="2" height="2" fill="#1e293b" />
                  <rect x="10" y="13" width="1" height="1" fill="white" />
                  <rect x="16" y="13" width="1" height="1" fill="white" />
                </g>
              </>
            )}

            {/* Nose & Mouth */}
            <rect x="12" y="16" width="2" height="1" fill="#be185d" />
            <rect x="13" y="17" width="1" height="1" fill="#be185d" />

            {/* Whiskers */}
            <rect x="5" y="15" width="2" height="1" fill="#000000" opacity="0.3" />
            <rect x="5" y="17" width="2" height="1" fill="#000000" opacity="0.3" />
            <rect x="19" y="15" width="2" height="1" fill="#000000" opacity="0.3" />
            <rect x="19" y="17" width="2" height="1" fill="#000000" opacity="0.3" />
          </motion.g>
        </svg>
      </motion.div>
    </motion.div>
  );
}
