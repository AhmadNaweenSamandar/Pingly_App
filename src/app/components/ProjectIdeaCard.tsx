import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, Users, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";


//Project idea objects created
interface ProjectIdeaProps {
  project: {
    id: number;
    user: { name: string; avatar: string };
    idea: string;
    skills: string[];
    wishes: number;
  };
  delay: number;
}


/**
 * ProjectIdeaCard Component
 * * Displays a single project concept/pitch card.
 * * Handles user interactions like "Wishing" (voting) on an idea and opening the Join form.
 * * @param {ProjectIdeaProps} props - Contains the idea data and animation delay.
 */
export function ProjectIdeaCard({ project, delay }: ProjectIdeaProps) {

  // =========================================
  // State Definitions
  // =========================================

  // Controls the visibility of the "Request to Join" modal/form
  const [showJoinForm, setShowJoinForm] = useState(false);

  // Local state for the "Wish" (Like) count. 
  // Initialized with the value from props so we can increment it locally.
  const [wishes, setWishes] = useState(project.wishes);

  // Boolean flag to track if the current user has already clicked "Wish".
  // Prevents multiple votes on the same item during this session.
  const [hasWished, setHasWished] = useState(false);


  // =========================================
  // Event Handlers
  // =========================================

  /**
   * Handles the "Make a Wish" (Like) action.
   * Increments the counter only if the user hasn't voted yet.
   */
  const handleWish = () => {
    if (!hasWished) {
        // Optimistic Update: Increment UI immediately for better responsiveness
      setWishes(wishes + 1);

      // Lock the button to prevent spamming
      setHasWished(true);
    }
  };

    return (
    <>

    {/* Main Card Container 
          - Uses Framer Motion for entrance animations.
      */}
      <motion.div
        // Animation States:
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}

        // Card Styling:
        // - hover:shadow-xl: Increases shadow depth on mouseover for interactivity.
        // - transition-all: Smooths the shadow change.
        className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all"
      >

        {/* Header Section: Avatar + Content 
            - items-start: Aligns avatar to the top (better for long text).
        */}
        <div className="flex items-start gap-4 mb-4">
            {/* User Avatar 
              - flex-shrink-0: CRITICAL. Prevents the avatar circle from squishing 
                if the flex container gets crowded.
          */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
            {project.user.avatar}
          </div>

          {/* Content Wrapper 
              - flex-1: Takes up remaining width.
              - min-w-0: Flexbox hack that forces text children to wrap/truncate 
                instead of overflowing the container.
          */}
          <div className="flex-1 min-w-0">
            <h4 className="text-gray-800 mb-1">{project.user.name}</h4>

            {/* Project Idea / Pitch 
                - leading-relaxed: Increases line-height for better readability of paragraph text.
            */}
            <p className="text-gray-700 leading-relaxed">{project.idea}</p>
          </div>
        </div>

        {/* Card Footer Container 
            - flex items-end: Aligns the tags and the (upcoming) buttons to the bottom baseline.
            - justify-between: Pushes the Tags (left) and Action Buttons (right) to opposite edges.
            - flex-wrap: Ensures the layout doesn't break on small screens; items will stack if needed.
        */}

        <div className="flex items-end justify-between gap-4 flex-wrap">
          {/* Skills Tag Cloud 
              - flex-wrap: Allows the badges to flow into multiple rows if there are many skills.
          */}
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="outline"

                // Badge Styling:
                // - bg-gradient: Adds a subtle tint consistent with the project's blue/purple theme.
                // - border-blue-200: Provides a soft boundary for the badge.
                className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700"
              >
                {skill}
              </Badge>
            ))}
          </div>

          {/* Action Buttons Container
              - ml-auto: "Margin Left Auto" pushes this container to the far right
                of the parent flexbox, separating it from the tags on the left.
          */}
          <div className="flex gap-2 ml-auto">

            {/* Wish / Vote Button 
                - Uses Framer Motion for tactile feedback (scale effects).
            */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWish}

              /* Conditional Styling:
                 - Checks 'hasWished' state to toggle appearance.
                 - TRUE (Voted): Solid Green Gradient + Shadow (Active look).
                 - FALSE (Default): Light Green Background + Border (Interactive look).
              */
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                hasWished
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                  : "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 border border-green-200"
              }`}
            >
              <Leaf className="w-4 h-4" />
              <span>{wishes}</span>
            </motion.button>

            {/* Join Project Button 
                - Triggers the application modal (showJoinForm).
                - Styled with Blue/Purple gradient to distinguish from the "Wish" action.
            */}
            <Button
              onClick={() => setShowJoinForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
            >
              <Users className="w-4 h-4 mr-2" />
              Join
            </Button>
          </div>
        </div>
      </motion.div>



      {/* Join Form Popup 
          - AnimatePresence: Ensures the 'exit' animation plays before the component 
            is removed from the DOM.
      */}
      <AnimatePresence>
        {showJoinForm && (
          <>

          {/* Backdrop Overlay 
                - fixed inset-0: Stretches to fill the entire viewport.
                - backdrop-blur-sm: Blurs the content behind the modal for focus.
                - z-50: High z-index to sit on top of all other content.
                - onClick: Closes the modal if the user clicks the dark background.
            */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={() => setShowJoinForm(false)}
            />

            {/* Modal Window Container 
                - fixed top-1/2 left-1/2...: Centers the element perfectly.
                - max-w-2xl: Sets a comfortable maximum width for the form.
            */}
            <motion.div
            // Entrance Animation: Slide Up + Scale Up + Fade In
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl"
              // CRITICAL: Stop Propagation
              // Prevents clicks inside the white form box from bubbling up 
              // to the backdrop and closing the modal.
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4">

                {/* Close Button (Top Right) 
                    - absolute: Positioned relative to the white container.
                */}
                <button
                  onClick={() => setShowJoinForm(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Form Header */}
                <h3 className="text-gray-800 mb-6">Join Project: {project.user.name}'s Idea</h3>

                {/* Form Fields Container 
                    - space-y-4: Adds vertical spacing between each input group (Name, Email, etc.)
                */}
                <div className="space-y-4">

                {/* Field: Full Name */}
                  <div>
                    <label className="block mb-2 text-gray-700">Your Name</label>
                    <Input placeholder="Enter your full name" />
                  </div>

                {/* Field: Email Address 
                      - type="email": Ensures mobile keyboards show the "@" symbol.
                  */}
                  <div>
                    <label className="block mb-2 text-gray-700">Email</label>
                    <Input type="email" placeholder="your.email@example.com" />
                  </div>

                {/* Field: Skills 
                      - Asks the user to list relevant tech stack experience.
                  */}
                  <div>
                    <label className="block mb-2 text-gray-700">Your Skills</label>
                    <Input placeholder="e.g., React, Node.js, UI/UX Design" />
                  </div>

                {/* Field: Motivation Message 
                      - Uses Textarea for longer content.
                  */}
                  <div>
                    <label className="block mb-2 text-gray-700">Why do you want to join?</label>
                    <Textarea
                      placeholder="Tell the project owner why you're interested..."
                      rows={4}
                    />
                  </div>

                {/* Action Footer (Buttons) 
                      - pt-4: Padding top to separate buttons from the last input.
                      - justify-end: Aligns buttons to the right (standard modal pattern).
                  */}
                  <div className="flex gap-3 justify-end pt-4">

                    {/* Cancel Button: Closes the modal without saving */}
                    <Button
                      variant="outline"
                      onClick={() => setShowJoinForm(false)}
                    >
                      Cancel
                    </Button>

                    {/* Submit Button 
                        - NOTE: Currently missing an 'onClick' or 'onSubmit' handler.
                        - Styled with the Blue/Purple gradient to match the "Join" theme.
                    */}
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Send Join Request
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}