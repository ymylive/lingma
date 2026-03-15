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
        <Route path="/mindmap" element={<PageWrapper><ProtectedRoute><MindMap /></ProtectedRoute></PageWrapper>} />
        <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><ProtectedRoute><Dashboard /></ProtectedRoute></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.01 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative z-10 will-change-transform"
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <UserProvider>
          <Router>
            <LocalizationBridge />
            {/* Global Aurora Background - Soft, Flowing, High-End */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-slate-50 dark:bg-[#000510] transition-colors duration-500">
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
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                 <AnimatedRoutes />
              </main>
              <Footer />
            </div>
            
            <PixelCat />
          </Router>
        </UserProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
