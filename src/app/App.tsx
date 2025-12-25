import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProfessionalMode } from "./components/ProfessionalMode";
import { Header } from "./components/Header";
import { SocialMode } from "./components/SocialMode";
import { LoginSignup } from "./components/Auth/LoginSignUp";
import { RegistrationForm } from "./components/Auth/RegistrationForm";
import { ProfileModal } from "./components/Modals/ProfileModal";
import { SettingsModal } from "./components/Modals/SettingsModal";
import { FeedbackModal } from "./components/Modals/FeedbackModal";


type AppState = "login" | "registration" | "dashboard";

export default function App() {
  const [appState, setAppState] = useState<AppState>("login");
  const [mode, setMode] = useState<"professional" | "social">("professional");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const handleLogin = () => {
    setAppState("dashboard");
  };

  const handleSignup = () => {
    setAppState("registration");
  };

  const handleRegistrationComplete = () => {
    setAppState("dashboard");
  };

  const handleSignOut = () => {
    setAppState("login");
    setMode("professional");
  };


   if (appState === "login") {
    return <LoginSignup onLogin={handleLogin} onSignup={handleSignup} />;
  }

  if (appState === "registration") {
    return <RegistrationForm onComplete={handleRegistrationComplete} />;
  }


  return (
    <div className={`min-h-screen transition-colors duration-700 ${
      mode === "professional" 
        ? "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50" 
        : "bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50"
    }`}>
        
      {/* Header */}
      <Header 
        mode={mode} 
        onModeChange={setMode}
        onProfileClick={() => setShowProfileModal(true)}
        onSettingsClick={() => setShowSettingsModal(true)}
        onFeedbackClick={() => setShowFeedbackModal(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {mode === "professional" ? (
          <motion.div
            key="professional"
            initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: -90, scale: 0.8 }}
            transition={{ 
              duration: 0.6,
              type: "spring",
              stiffness: 100
            }}
          >
            <ProfessionalMode />
          </motion.div>
        ) : (
          <motion.div
            key="social"
            initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: 90, scale: 0.8 }}
            transition={{ 
              duration: 0.6,
              type: "spring",
              stiffness: 100
            }}
          >
            <SocialMode />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
      <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />

    </div>
  );
}
