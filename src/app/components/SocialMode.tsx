import { useState } from "react";
import { motion } from "motion/react";
import { MatchingFlipCards } from "./MatchingFlipCards";
import { MatchingSchedule } from "./MatchingSchedule";
import { Matches } from "./Matches";



/**
 * SocialMode Container
 * * The main page layout for the "Social / Dating" side of the application.
 * * Orchestrates the Flip Cards, Schedule Feed, and Matches Inbox.
 */
export function SocialMode() {

  // Main Wrapper
  // - max-w-7xl: Constrains width on ultra-wide monitors.
  // - px-4: Horizontal padding for mobile.
  // - pb-24: Critical bottom padding to prevent content being hidden behind mobile nav bars.
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 sm:pb-8">{/* Added pb-24 for mobile bottom nav */}
      {/* Matching Flip Cards */}
      {/* SECTION 1: Swipe Interface 
          - Appears first with a slight fade-in delay.
      */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <MatchingFlipCards />
      </motion.div>

      {/* Matching Schedule and Matches Grid */}
      {/* SECTION 2: Dashboard Grid 
          - Contains the Activity Feed (Left) and Inbox (Right).
          - grid-cols-1: Stacked vertically on mobile.
          - lg:grid-cols-2: Side-by-side on desktop.
      */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <MatchingSchedule />
        <Matches />
      </motion.div>
    </div>
  );
}