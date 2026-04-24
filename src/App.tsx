import { Suspense, lazy, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { I18nProvider } from './contexts/I18nContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LocalizationBridge from './components/LocalizationBridge';
import ProtectedRoute from './components/ProtectedRoute';
import PixelCat from './components/PixelCat';
import AuroraBackground from './components/AuroraBackground';
import FluidSmokeLayer from './components/FluidSmokeLayer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { motion } from 'framer-motion';
import useLowMotionMode from './hooks/useLowMotionMode';

const Home = lazy(() => import('./pages/Home'));
const Algorithms = lazy(() => import('./pages/Algorithms'));
const AlgorithmDetail = lazy(() => import('./pages/AlgorithmDetail'));
const Book = lazy(() => import('./pages/Book'));
const Lesson = lazy(() => import('./pages/Lesson'));
const Practice = lazy(() => import('./pages/Practice'));
const MindMap = lazy(() => import('./pages/MindMap'));
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Methodology = lazy(() => import('./pages/Methodology'));

function RouteLoadingFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] items-center justify-center px-6 py-20 text-slate-500 dark:text-slate-400"
    >
      <div className="w-full max-w-xl rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/70">
        <div className="h-4 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="mt-4 h-8 w-3/4 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="mt-6 space-y-3">
          <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800/80" />
          <div className="h-4 w-5/6 rounded-full bg-slate-100 dark:bg-slate-800/80" />
          <div className="h-4 w-2/3 rounded-full bg-slate-100 dark:bg-slate-800/80" />
        </div>
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">正在加载页面内容...</p>
      </div>
    </div>
  );
}

function RoutedPage({
  children,
  routeKey,
  protectedPage = false,
}: {
  children: ReactNode;
  routeKey: string;
  protectedPage?: boolean;
}) {
  const content = (
    <ErrorBoundary>
      <Suspense fallback={<RouteLoadingFallback />}>{children}</Suspense>
    </ErrorBoundary>
  );

  return (
    <PageWrapper routeKey={routeKey}>
      {protectedPage ? <ProtectedRoute>{content}</ProtectedRoute> : content}
    </PageWrapper>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <Routes>
      <Route path="/" element={<RoutedPage routeKey={location.pathname}><Home /></RoutedPage>} />
      <Route path="/algorithms" element={<RoutedPage routeKey={location.pathname} protectedPage><Algorithms /></RoutedPage>} />
      <Route path="/algorithms/:id" element={<RoutedPage routeKey={location.pathname} protectedPage><AlgorithmDetail /></RoutedPage>} />
      <Route path="/book" element={<RoutedPage routeKey={location.pathname} protectedPage><Book /></RoutedPage>} />
      <Route path="/book/*" element={<RoutedPage routeKey={location.pathname} protectedPage><Lesson /></RoutedPage>} />
      <Route path="/practice" element={<RoutedPage routeKey={location.pathname} protectedPage><Practice /></RoutedPage>} />
      <Route path="/mindmap" element={<RoutedPage routeKey={location.pathname} protectedPage><MindMap /></RoutedPage>} />
      <Route path="/auth" element={<RoutedPage routeKey={location.pathname}><Auth /></RoutedPage>} />
      <Route path="/dashboard" element={<RoutedPage routeKey={location.pathname} protectedPage><Dashboard /></RoutedPage>} />
      <Route path="/methodology" element={<RoutedPage routeKey={location.pathname} protectedPage><Methodology /></RoutedPage>} />
    </Routes>
  );
}

function PageWrapper({ children, routeKey }: { children: ReactNode; routeKey: string }) {
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
    <ErrorBoundary>
      <ThemeProvider>
        <I18nProvider>
          <UserProvider>
            <Router>
            <LocalizationBridge />
            <AuroraBackground lowMotion={lowMotionMode} />
            <FluidSmokeLayer lowMotion={lowMotionMode} />

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
    </ErrorBoundary>
  );
}

export default App;
