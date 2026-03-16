import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { I18nProvider } from './contexts/I18nContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LocalizationBridge from './components/LocalizationBridge';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Algorithms from './pages/Algorithms';
import AlgorithmDetail from './pages/AlgorithmDetail';
import Book from './pages/Book';
import Lesson from './pages/Lesson';
import Practice from './pages/Practice';
import MindMap from './pages/MindMap';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Methodology from './pages/Methodology';
import PixelCat from './components/PixelCat';
import { motion } from 'framer-motion';
import useLowMotionMode from './hooks/useLowMotionMode';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <Routes>
      <Route path="/" element={<PageWrapper routeKey={location.pathname}><Home /></PageWrapper>} />
      <Route path="/algorithms" element={<PageWrapper routeKey={location.pathname}><ProtectedRoute><Algorithms /></ProtectedRoute></PageWrapper>} />
      <Route path="/algorithms/:id" element={<PageWrapper routeKey={location.pathname}><ProtectedRoute><AlgorithmDetail /></ProtectedRoute></PageWrapper>} />
      <Route path="/book" element={<PageWrapper routeKey={location.pathname}><ProtectedRoute><Book /></ProtectedRoute></PageWrapper>} />
      <Route path="/book/*" element={<PageWrapper routeKey={location.pathname}><ProtectedRoute><Lesson /></ProtectedRoute></PageWrapper>} />
      <Route path="/practice" element={<PageWrapper routeKey={location.pathname}><ProtectedRoute><Practice /></ProtectedRoute></PageWrapper>} />
      <Route path="/mindmap" element={<PageWrapper routeKey={location.pathname}><ProtectedRoute><MindMap /></ProtectedRoute></PageWrapper>} />
      <Route path="/auth" element={<PageWrapper routeKey={location.pathname}><Auth /></PageWrapper>} />
      <Route path="/dashboard" element={<PageWrapper routeKey={location.pathname}><ProtectedRoute><Dashboard /></ProtectedRoute></PageWrapper>} />
      <Route path="/methodology" element={<PageWrapper routeKey={location.pathname}><ProtectedRoute><Methodology /></ProtectedRoute></PageWrapper>} />
    </Routes>
  );
}

function PageWrapper({ children, routeKey }: { children: React.ReactNode; routeKey: string }) {
  const lowMotionMode = useLowMotionMode();

  return (
    <motion.div
      key={routeKey}
      initial={lowMotionMode ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={lowMotionMode ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' }}
      className="relative z-10 min-w-0"
    >
      {children}
    </motion.div>
  );
}

function App() {
  const lowMotionMode = useLowMotionMode();

  return (
    <ThemeProvider>
      <I18nProvider>
        <UserProvider>
          <Router>
            <LocalizationBridge />
            {/* Global Aurora Background - Soft, Flowing, High-End */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
               {/* Static Base Gradients (Klein Blue & Pine Yellow) */}
               <div className="absolute inset-0 opacity-40 dark:opacity-30"
                    style={{
                      background: `
                        radial-gradient(circle at 15% 15%, rgba(0, 47, 167, 0.35) 0%, transparent 50%), /* Klein Top-Left */
                        radial-gradient(circle at 85% 85%, rgba(0, 47, 167, 0.3) 0%, transparent 50%), /* Klein Bottom-Right */
                        radial-gradient(circle at 50% 50%, rgba(255, 225, 53, 0.1) 0%, transparent 60%) /* Pine Center */
                      `,
                      filter: 'contrast(120%) blur(20px)', // Soften edges
                    }}
               />

               {lowMotionMode ? (
                 <div
                   className="absolute inset-0 opacity-25 dark:opacity-20"
                   style={{
                     background: `
                       radial-gradient(circle at 72% 28%, rgba(255, 225, 53, 0.18) 0%, transparent 38%),
                       radial-gradient(circle at 22% 78%, rgba(0, 47, 167, 0.2) 0%, transparent 42%)
                     `,
                   }}
                 />
               ) : (
                 <>
                   {/* Animated Floating Orb (Pine Yellow) */}
                   <motion.div 
                     animate={{ 
                       transform: ['translate(0,0) scale(1)', 'translate(5%, -5%) scale(1.1)', 'translate(-2%, 5%) scale(0.95)', 'translate(0,0) scale(1)']
                     }}
                     transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                     className="absolute inset-0 opacity-30 dark:opacity-20 will-change-transform"
                     style={{
                       background: `radial-gradient(circle at 70% 30%, rgba(255, 225, 53, 0.25) 0%, transparent 40%)`
                     }}
                   />

                   {/* Animated Floating Orb (Klein Blue) */}
                   <motion.div 
                     animate={{ 
                       transform: ['translate(0,0) scale(1)', 'translate(-5%, 5%) scale(1.1)', 'translate(5%, -2%) scale(0.95)', 'translate(0,0) scale(1)']
                     }}
                     transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                     className="absolute inset-0 opacity-30 dark:opacity-20 will-change-transform"
                     style={{
                       background: `radial-gradient(circle at 20% 80%, rgba(0, 47, 167, 0.25) 0%, transparent 40%)`
                     }}
                   />
                 </>
               )}
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                 <AnimatedRoutes />
              </main>
              <Footer />
            </div>
            
            <PixelCat lowMotion={lowMotionMode} />
          </Router>
        </UserProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
