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


  return (
    <AnimatePresence>
      <>

        {/* =========================================
            LAYER 1: Backdrop Overlay
            ========================================= */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* =========================================
            LAYER 2: Modal Content
            ========================================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4">

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <h2 className="text-gray-800 mb-6">Settings</h2>

            <div className="space-y-6">
    
              {/* === SECTION 1: Notifications === */}
              <div>
                {/* Section Header */}
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <h3 className="text-gray-800">Notifications</h3>
                </div>
                {/* Toggle List 
                    - pl-7: Indents content to align with the header text (skipping the icon width).
                */}
                <div className="space-y-3 pl-7">

                  {/* Toggle: Email */}
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700">Email Notifications</span>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                  </label>

                  {/* Toggle: Push */}
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700">Push Notifications</span>
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                  </label>

                  {/* Toggle: Matches */}
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700">Match Notifications</span>
                    <input
                      type="checkbox"
                      checked={settings.matchNotifications}
                      onChange={(e) => setSettings({ ...settings, matchNotifications: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                  </label>

                  {/* Toggle: Messages */}
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700">Message Notifications</span>
                    <input
                      type="checkbox"
                      checked={settings.messageNotifications}
                      onChange={(e) => setSettings({ ...settings, messageNotifications: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                  </label>

                  {/* Toggle: Projects */}
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700">Project Notifications</span>
                    <input
                      type="checkbox"
                      checked={settings.projectNotifications}
                      onChange={(e) => setSettings({ ...settings, projectNotifications: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                  </label>
                </div>
              </div>


    
              {/* === SECTION 2: Privacy & Security === */}
              <div>

                {/* Section Header */}
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-5 h-5 text-purple-600" />
                  <h3 className="text-gray-800">Privacy</h3>
                </div>

                {/* Controls Container */}
                <div className="space-y-3 pl-7">

                  {/* Control: Profile Visibility (Dropdown) */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <label className="block text-gray-700 mb-2">Profile Visibility</label>
                    <select
                      value={settings.profileVisibility}
                      onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value as any })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  {/* Toggle: Online Status (Incognito) */}
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700">Show Online Status</span>
                    <input
                      type="checkbox"
                      checked={settings.showOnlineStatus}
                      onChange={(e) => setSettings({ ...settings, showOnlineStatus: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />

                  {/* Toggle: Direct Messages */}
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700">Allow Direct Messages</span>
                    <input
                      type="checkbox"
                      checked={settings.allowMessages}
                      onChange={(e) => setSettings({ ...settings, allowMessages: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                  </label>
                </div>
              </div>

              
              {/* === FORM ACTIONS === */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}