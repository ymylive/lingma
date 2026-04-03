import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  "Meow! 🐱",
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
  const timeoutHandlesRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const [isBlinking, setIsBlinking] = useState(false);
  const sleeping = lowMotion ? false : isSleeping;
  const blinking = lowMotion ? false : isBlinking;

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
      if (random < 0.3) {
        setIsSleeping(prev => !prev);
      } else if (random > 0.7 && !sleeping) {
        // Show random message
        setMessage(messages[Math.floor(Math.random() * messages.length)]);
        setShowMessage(true);
        scheduleTimeout(() => setShowMessage(false), 3000);
      }
    }, 5000);

    // Blinking logic
    const blinkInterval = setInterval(() => {
      if (!sleeping && Math.random() > 0.7) {
        setIsBlinking(true);
        scheduleTimeout(() => setIsBlinking(false), 150);
      }
    }, 3000);

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
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
    setShowMessage(true);
    scheduleTimeout(() => setShowMessage(false), 3000);
  };

  return (
    <motion.div
      drag={!lowMotion}
      dragMomentum={false}
      whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
      className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 cursor-grab touch-none"
      onClick={handleClick}
      initial={lowMotion ? false : { y: 100, opacity: 0 }}
      animate={lowMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
      transition={lowMotion ? { duration: 0 } : { delay: 1, type: 'spring' }}
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-full mb-2 right-0 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] sm:text-xs font-bold py-2 px-3 rounded-xl shadow-lg border-2 border-slate-900 dark:border-slate-600 whitespace-nowrap pointer-events-none max-w-[200px] break-words z-50"
            style={{ fontFamily: "'Press Start 2P', cursive, sans-serif" }} // Pixel font fallback
          >
            {message}
            <div className="absolute -bottom-2 right-4 sm:right-6 w-3 h-3 bg-white dark:bg-slate-800 border-r-2 border-b-2 border-slate-900 dark:border-slate-600 transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pixel Cat SVG */}
      <div className="relative w-14 h-14 sm:w-20 sm:h-20 drop-shadow-xl hover:scale-105 transition-transform duration-200">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          style={{ shapeRendering: 'crispEdges' }} // Key for pixel art look
        >
          {/* Tail Animation */}
          <motion.g
            animate={lowMotion ? undefined : { rotate: [0, 15, 0, -5, 0] }}
            transition={lowMotion ? undefined : { repeat: Infinity, duration: 2, ease: "linear", times: [0, 0.25, 0.5, 0.75, 1] }}
            style={{ transformOrigin: "27px 25px" }} // Fixed origin at the base of the tail
          >
             {/* Tail pixels */}
             <rect x="26" y="24" width="2" height="2" fill="#d97706" />
             <rect x="28" y="22" width="2" height="2" fill="#d97706" />
             <rect x="29" y="20" width="2" height="2" fill="#fb923c" />
             <rect x="29" y="18" width="2" height="2" fill="#fb923c" />
          </motion.g>

          {/* Body */}
          <motion.g
            animate={lowMotion ? undefined : { y: sleeping ? 1 : [0, -1, 0] }}
            transition={lowMotion ? undefined : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Main Body */}
            <rect x="8" y="18" width="18" height="10" rx="1" fill="#fb923c" /> {/* Orange Body */}
            <rect x="10" y="20" width="14" height="6" fill="#fdba74" /> {/* Lighter Belly */}
            
            {/* Head */}
            <rect x="6" y="10" width="14" height="10" fill="#fb923c" />
            
            {/* Ears */}
            <rect x="6" y="8" width="2" height="2" fill="#d97706" />
            <rect x="18" y="8" width="2" height="2" fill="#d97706" />
            <rect x="7" y="7" width="2" height="2" fill="#fb923c" />
            <rect x="17" y="7" width="2" height="2" fill="#fb923c" />

            {/* Face details */}
            {sleeping ? (
              <>
                {/* Sleeping Eyes (Lines) */}
                <rect x="9" y="14" width="2" height="1" fill="#1e293b" />
                <rect x="15" y="14" width="2" height="1" fill="#1e293b" />
                <motion.text x="22" y="10" className="text-[8px] font-bold fill-indigo-500"
                  animate={lowMotion ? undefined : { opacity: [0, 1, 0], y: -5 }}
                  transition={lowMotion ? undefined : { duration: 2, repeat: Infinity }}
                >z</motion.text>
              </>
            ) : blinking ? (
              <>
                 {/* Blinking Eyes (Closed Line) */}
                 <rect x="9" y="14" width="2" height="1" fill="#1e293b" />
                 <rect x="15" y="14" width="2" height="1" fill="#1e293b" />
              </>
            ) : (
              <>
                 {/* Open Eyes */}
                 <g>
                    <rect x="9" y="13" width="2" height="2" fill="#1e293b" />
                    <rect x="15" y="13" width="2" height="2" fill="#1e293b" />
                    <rect x="10" y="13" width="1" height="1" fill="white" /> {/* Sparkle */}
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

            {/* Paws */}
            <rect x="8" y="27" width="3" height="2" fill="white" />
            <rect x="14" y="27" width="3" height="2" fill="white" />
            <rect x="20" y="27" width="3" height="2" fill="white" />
          </motion.g>
        </svg>
      </div>
    </motion.div>
  );
}
