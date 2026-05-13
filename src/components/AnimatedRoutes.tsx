import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './PageTransition';
import { useSwipeBack } from '@/hooks/useSwipeBack';
import Index from '@/pages/Index';
import Photos from '@/pages/Photos';
import ImagesSection from '@/pages/ImagesSection';
import Documents from '@/pages/Documents';
import Notes from '@/pages/Notes';
import Privacy from '@/pages/Privacy';
import Admin from '@/pages/Admin';
import Tools from '@/pages/Tools';
import Explore from '@/pages/Explore';
import GroupChats from '@/pages/GroupChats';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Terms from '@/pages/Terms';
import Features from '@/pages/Features';
import FAQ from '@/pages/FAQ';
import FreeAIChatbot from '@/pages/seo/FreeAIChatbot';
import AIHomeworkHelper from '@/pages/seo/AIHomeworkHelper';
import HindiAIAssistant from '@/pages/seo/HindiAIAssistant';
import NotFound from '@/pages/NotFound';

export const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Enable swipe-back gesture on mobile
  useSwipeBack({ threshold: 80, edgeWidth: 25 });

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Index />
            </PageTransition>
          }
        />
        <Route
          path="/photos"
          element={
            <PageTransition>
              <Photos />
            </PageTransition>
          }
        />
        <Route
          path="/images"
          element={
            <PageTransition>
              <ImagesSection />
            </PageTransition>
          }
        />
        <Route
          path="/tools"
          element={
            <PageTransition>
              <Tools />
            </PageTransition>
          }
        />
        <Route
          path="/documents"
          element={
            <PageTransition>
              <Documents />
            </PageTransition>
          }
        />
        <Route
          path="/notes"
          element={
            <PageTransition>
              <Notes />
            </PageTransition>
          }
        />
        <Route
          path="/privacy"
          element={
            <PageTransition>
              <Privacy />
            </PageTransition>
          }
        />
        <Route
          path="/admin"
          element={
            <PageTransition>
              <Admin />
            </PageTransition>
          }
        />
        <Route
          path="/explore"
          element={
            <PageTransition>
              <Explore />
            </PageTransition>
          }
        />
        <Route
          path="/group-chats"
          element={
            <PageTransition>
              <GroupChats />
            </PageTransition>
          }
        />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
        <Route path="/features" element={<PageTransition><Features /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
        <Route path="/free-ai-chatbot" element={<PageTransition><FreeAIChatbot /></PageTransition>} />
        <Route path="/ai-homework-helper" element={<PageTransition><AIHomeworkHelper /></PageTransition>} />
        <Route path="/hindi-ai-assistant" element={<PageTransition><HindiAIAssistant /></PageTransition>} />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};
