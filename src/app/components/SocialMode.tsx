import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MatchingFlipCards } from "./MatchingFlipCards";
import { MatchingSchedule } from "./MatchingSchedule";
import { Matches } from "./Matches";
import { ChatList } from "./ChatList";

interface SocialModeProps {
  currentSection: "discover" | "schedule" | "matches" | "chat";
}

/**
 * SocialMode Container
 * * The main page layout for the "Social / Dating" side of the application.
 * * Orchestrates the Flip Cards, Schedule Feed, and Matches Inbox.
 */
export function SocialMode({ currentSection }: SocialModeProps) {
  const renderSection = () => {
    switch (currentSection) {
      case "discover":
        return (
          <motion.div
            key="discover"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-6 text-center max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Discover Matches
              </h2>
              <p className="text-gray-600">
                Connect with fellow students who share your interests
              </p>
            </div>
            <MatchingFlipCards />
          </motion.div>
        );

        {
          /* Matching Schedule and Matches Grid */
        }
        {
          /* SECTION 2: Dashboard Grid 
          - Contains the Activity Feed (Left) and Inbox (Right).
          - grid-cols-1: Stacked vertically on mobile.
          - lg:grid-cols-2: Side-by-side on desktop.
      */
        }
      case "schedule":
        return (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Matching Schedule
              </h2>
              <p className="text-gray-600">
                Find and join study sessions and social activities
              </p>
            </div>
            <MatchingSchedule />
          </motion.div>
        );

      case "matches":
        return (
          <motion.div
            key="matches"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Your Matches
              </h2>
              <p className="text-gray-600">
                View all your connections and match details
              </p>
            </div>
            <Matches />
          </motion.div>
        );

      case "chat":
        return (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Messages
              </h2>
              <p className="text-gray-600">
                Chat with your matches and stay connected
              </p>
            </div>
            <ChatList />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
      <AnimatePresence mode="wait">{renderSection()}</AnimatePresence>
    </div>
  );
}
