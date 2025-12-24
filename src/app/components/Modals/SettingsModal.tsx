import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Bell, Lock, Eye, Globe } from "lucide-react";
import { Button } from "../ui/button";


//interface created to control setting visibility
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}


/**
 * SettingsModal Component
 * * Manages User Preferences for Notifications and Privacy.
 * * Uses a unified state object for easier API synchronization.
 */
export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {

  // =========================================
  // State: Preferences
  // =========================================
  const [settings, setSettings] = useState({

    // --- Notification Channels ---
    emailNotifications: true,
    pushNotifications: true,

    // --- Notification Types ---
    matchNotifications: true,   // "New Match!"
    messageNotifications: true, // "New Message from X"
    projectNotifications: true, // "New Project Invite"

    // --- Privacy Settings ---
    profileVisibility: "public" as "public" | "friends" | "private",
    showOnlineStatus: true,     // Toggle "Active Now" dot
    allowMessages: true,        // Global DM switch
  });


  // =========================================
  // Handlers
  // =========================================
  const handleSave = () => {
    // Save settings
    // TODO: Dispatch API call to PATCH /api/user/settings
    onClose();
  };

  // Logic: Do not render if closed
  if (!isOpen) return null;

}