import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Briefcase,
  Bell,
  MoreVertical,
  User,
  Settings,
  MessageSquare,
  LogOut,
  HelpCircle,
  FolderKanban,
  Lightbulb,
  MessageCircle,
  Trophy,
  Heart,
  Calendar,
  MessageSquareText,
  Users,
} from "lucide-react";

// 'interface' defines a custom data type called 'Notification'.
// Any variable or object labeled as a 'Notification' MUST have exactly these properties.
interface Notification {
  // A unique number to identify this specific notification (like a primary key in a database).
  // Example: 1, 42, 105
  id: number;

  // A text string indicating the category or kind of notification.
  // Example: "success", "error", "friend_request", "system_alert"
  type: string;

  // The actual text content that will be shown to the user.
  // Example: "Ahmad sent you a message."
  message: string;

  // A string representing when the notification happened.
  // This could be a raw date ("2025-12-18") or relative text ("2 mins ago").
  time: string;

  // A true/false flag to track if the user has looked at this notification.
  // true = read (don't show badge), false = unread (show badge).
  read: boolean;
}

//here the instances of notification are created for porfessional mode
//Notification[] indicates that these bunch of hard coded notifications are list of arrays
//all the Notification interface variables must be declared here other than that the code will give an error
const professionalNotifications: Notification[] = [
  {
    id: 1,
    type: "project",
    message: "New project posted: AI Study Assistant",
    time: "5m ago",
    read: false,
  },
  {
    id: 2,
    type: "join",
    message: "Sarah joined your project 'Web Dev Course'",
    time: "1h ago",
    read: false,
  },
  {
    id: 3,
    type: "wish",
    message: "Alex sent best wishes to your project",
    time: "2h ago",
    read: true,
  },
  {
    id: 4,
    type: "answer",
    message: "Your question received a new answer",
    time: "3h ago",
    read: true,
  },
];

//here the instances of notification are created for social mode
const socialNotifications: Notification[] = [
  {
    id: 1,
    type: "match",
    message: "You matched with Emma Wilson!",
    time: "10m ago",
    read: false,
  },
  {
    id: 2,
    type: "message",
    message: "New message from Alex Park",
    time: "30m ago",
    read: false,
  },
  {
    id: 3,
    type: "schedule",
    message: "Mike posted a new study schedule",
    time: "1h ago",
    read: true,
  },
];

// for both professional and social modes, we have different sections that users can navigate to.
// these sections are added to navbar in header component to make navigation easy for users
type ProfessionalSection =
  | "leaderboard"
  | "discussions"
  | "projects"
  | "ideas"
  | "questions";
type SocialSection = "discover" | "schedule" | "matches" | "chat";

// 'interface' defines the requirements for the Header component.
// This is a contract: The Parent (App) MUST provide these exact items to the Child (Header).
interface HeaderProps {
  // 1. DATA (State)
  // The current visual state of the application.
  // It is restricted to ONLY "professional" or "social" (Union Type).
  mode: "professional" | "social";

  // 2. ACTIONS (Event Handlers)
  // A function that notifies the parent when the user toggles the switch.
  // It passes the *new* mode back to the parent so the state can update.
  onModeChange: (mode: "professional" | "social") => void;

  //Since we are changing current mode trigger change to button we need to add the following lines of code
  // it helps react to determine which button (mode) is currently active and which one is not active and change the color of the button accordingly
  professionalSection: ProfessionalSection;
  onProfessionalSectionChange: (section: ProfessionalSection) => void;
  socialSection: SocialSection;
  onSocialSectionChange: (section: SocialSection) => void;

  // Triggered when the user clicks their avatar/name.
  // Usually redirects to the Profile page in three doted menu.
  onProfileClick: () => void;

  // Triggered when the user clicks the gear icon.
  // Opens the settings page in three doted menu.
  onSettingsClick: () => void;

  // Triggered when the user clicks the "Help" or "Feedback" button.
  // Important for beta testing to gather user thoughts.
  onFeedbackClick: () => void;

  // Triggered when the user clicks "Log Out".
  // The Header doesn't log them out; it just tells the Parent "User wants to leave."
  onSignOut: () => void;
}

// This defines the functional component named 'Header'.
// We 'destructure' the props immediately inside the ({ ... }) to make them easier to use.
// ': HeaderProps' ensures these inputs match the interface we defined earlier.
export function Header({
  mode,
  onModeChange,
  professionalSection,
  onProfessionalSectionChange,
  socialSection,
  onSocialSectionChange,
  onProfileClick,
  onSettingsClick,
  onFeedbackClick,
  onSignOut,
}: HeaderProps) {
  // --- LOCAL UI STATE ---
  // These variables track the temporary state of the Header's UI.

  // Controls the visibility of the Notification dropdown (Bell icon).
  // false = hidden (default), true = visible.
  const [showNotifications, setShowNotifications] = useState(false);
  // Controls the visibility of the Profile Menu (three dots).
  // false = hidden (default), true = visible.
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null); // Reference to the menu DOM element for click outside detection

  // --- NEW: Click Outside Listener ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the menu is open AND the click happened outside of our menuRef
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false); // Close it!
      }
    };

    // Listen for mouse clicks
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // --- DERIVED LOGIC ---
  // These variables are calculated on the fly every time the component renders.

  // 1. SELECT DATA:
  // A 'Ternary Operator' (shorthand if/else) to pick the right list of data.
  // IF mode is "professional" -> use professionalNotifications.
  // ELSE -> use socialNotifications.
  const notifications =
    mode === "professional" ? professionalNotifications : socialNotifications;

  // 2. CALCULATE BADGE:
  // We take the selected list above and filter it.
  // We keep only items where 'read' is false (the unread ones).
  // Then we count them (.length) to get the number for the red badge.
  // This is a count number on top right corner of notification icon.
  const unreadCount = notifications.filter((n) => !n.read).length;

  // professionalSections and socialSections are the different navigation options available in the header for each mode.
  // Each section has an id, an icon from lucide-react, and a label to display.
  const professionalSections = [
    { id: "leaderboard" as const, icon: Trophy, label: "Leaderboard" },
    { id: "discussions" as const, icon: MessageCircle, label: "Discussions" },
    { id: "projects" as const, icon: FolderKanban, label: "Projects" },
    { id: "ideas" as const, icon: Lightbulb, label: "Ideas" },
    { id: "questions" as const, icon: HelpCircle, label: "Questions" },
  ];

  const socialSections = [
    { id: "discover" as const, icon: Heart, label: "Discover" },
    { id: "schedule" as const, icon: Calendar, label: "Schedule" },
    { id: "matches" as const, icon: Users, label: "Matches" },
    { id: "chat" as const, icon: MessageSquareText, label: "Chat" },
  ];

  const currentSections =
    mode === "professional" ? professionalSections : socialSections;
  const currentSection =
    mode === "professional" ? professionalSection : socialSection;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.h1
            className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Pingly
          </motion.h1>

          {/* Section Navigation - Centered */}
          {/* It contains icon for of differect sections of both modes */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <motion.div
              className={`flex items-center gap-1 p-1.5 rounded-full shadow-inner ${
                mode === "professional"
                  ? "bg-gradient-to-r from-blue-100 to-purple-100"
                  : "bg-gradient-to-r from-pink-100 to-rose-100"
              }`}
              layout
            >
              {currentSections.map((section) => {
                const Icon = section.icon;
                const isActive = currentSection === section.id;
                return (
                  <motion.button
                    key={section.id}
                    onClick={() => {
                      if (mode === "professional") {
                        onProfessionalSectionChange(
                          section.id as ProfessionalSection,
                        );
                      } else {
                        onSocialSectionChange(section.id as SocialSection);
                      }
                    }}
                    className={`relative p-2.5 rounded-full transition-all ${
                      isActive ? "text-white" : "text-gray-600"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={section.label}
                  >
                    {isActive && (
                      <motion.div
                        layoutId={`section-indicator-${mode}`}
                        className={`absolute inset-0 rounded-full shadow-lg ${
                          mode === "professional"
                            ? "bg-gradient-to-r from-blue-600 to-blue-500"
                            : "bg-gradient-to-r from-pink-600 to-rose-500"
                        }`}
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <Icon className="w-5 h-5 relative z-10" />
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          {/* Right Side - Mode Toggle, Notifications & Menu */}
          <div className="flex items-center gap-3">
            {/* Notification Icon */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowMenu(false);
                }}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Bell className="w-6 h-6 text-gray-600" />
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                  >
                    {unreadCount}
                  </motion.div>
                )}
              </motion.button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                      <h3 className="text-gray-800">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            !notification.read ? "bg-blue-50/50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-800">
                                {notification.message}
                              </p>
                              <p className="text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mode Toggle Button */}
            <motion.button
              onClick={() =>
                onModeChange(
                  mode === "professional" ? "social" : "professional",
                )
              }
              className={`relative px-4 py-2 rounded-full flex items-center gap-2 transition-all shadow-md ${
                mode === "professional"
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                  : "bg-gradient-to-r from-pink-600 to-rose-500 text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mode === "professional" ? (
                <>
                  <Briefcase className="w-5 h-5" />
                  <span className="hidden sm:inline">Professional</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span className="hidden sm:inline">Social</span>
                </>
              )}
            </motion.button>

            {/* Three Dots Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowMenu(!showMenu);
                  setShowNotifications(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreVertical className="w-6 h-6 text-gray-600" />
              </motion.button>

              {/* Menu Dropdown */}
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
                  >
                    <button
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
                      onClick={onProfileClick}
                    >
                      <User className="w-5 h-5" />
                      Profile
                    </button>
                    <button
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
                      onClick={onSettingsClick}
                    >
                      <Settings className="w-5 h-5" />
                      Settings
                    </button>
                    <button
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
                      onClick={onFeedbackClick}
                    >
                      <MessageSquare className="w-5 h-5" />
                      Feedback
                    </button>
                    <div className="border-t border-gray-200">
                      <button
                        className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
                        onClick={onSignOut}
                      >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Section Navigation - Fixed at bottom */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-40">
          <div
            className={`flex items-center justify-around p-1.5 rounded-full shadow-inner ${
              mode === "professional"
                ? "bg-gradient-to-r from-blue-100 to-purple-100"
                : "bg-gradient-to-r from-pink-100 to-rose-100"
            }`}
          >
            {currentSections.map((section) => {
              const Icon = section.icon;
              const isActive = currentSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    if (mode === "professional") {
                      onProfessionalSectionChange(
                        section.id as ProfessionalSection,
                      );
                    } else {
                      onSocialSectionChange(section.id as SocialSection);
                    }
                  }}
                  className={`relative flex-1 py-2.5 rounded-full flex flex-col items-center justify-center gap-1 transition-all ${
                    isActive
                      ? mode === "professional"
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                        : "bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-lg"
                      : "text-gray-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
