import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Algorithms from './pages/Algorithms';
import AlgorithmDetail from './pages/AlgorithmDetail';
import Book from './pages/Book';
import Lesson from './pages/Lesson';
import Practice from './pages/Practice';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import PixelCat from './components/PixelCat';
import { AnimatePresence, motion } from 'framer-motion';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/algorithms" element={<PageWrapper><ProtectedRoute><Algorithms /></ProtectedRoute></PageWrapper>} />
        <Route path="/algorithms/:id" element={<PageWrapper><ProtectedRoute><AlgorithmDetail /></ProtectedRoute></PageWrapper>} />
        <Route path="/book" element={<PageWrapper><ProtectedRoute><Book /></ProtectedRoute></PageWrapper>} />
        <Route path="/book/*" element={<PageWrapper><ProtectedRoute><Lesson /></ProtectedRoute></PageWrapper>} />
        <Route path="/practice" element={<PageWrapper><ProtectedRoute><Practice /></ProtectedRoute></PageWrapper>} />
        <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><ProtectedRoute><Dashboard /></ProtectedRoute></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }} // Reduced scale effect for smoother entry
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.01 }}
      transition={{ duration: 0.3, ease: "easeOut" }} // Faster, simpler easing
      className="relative z-10 will-change-transform" // Hardware acceleration hint
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          {/* Global Ambient Background - Optimized Performance */}
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-slate-50 dark:bg-[#030712]">
             {/* Use radial gradients instead of blur filters for better FPS */}
             <div className="absolute inset-0 opacity-30 dark:opacity-20"
                  style={{
                    background: `
                      radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.4) 0%, transparent 40%),
                      radial-gradient(circle at 85% 85%, rgba(168, 85, 247, 0.4) 0%, transparent 40%),
                      radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)
                    `,
                    filter: 'contrast(120%)', // Slight pop without heavy blur
                  }}
             />
             
             {/* Subtle animated overlay using transform instead of extensive blur */}
             <motion.div 
               animate={{ 
                 transform: ['translate(0,0) scale(1)', 'translate(2%, 2%) scale(1.05)', 'translate(0,0) scale(1)']
               }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 opacity-40 dark:opacity-30 will-change-transform"
               style={{
                 background: `radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.25) 0%, transparent 35%)`
               }}
             />
          </div>

          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
               <AnimatedRoutes />
            </main>
          </div>
          
          <PixelCat />
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
