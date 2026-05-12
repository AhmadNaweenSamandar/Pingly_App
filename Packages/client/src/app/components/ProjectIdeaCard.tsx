import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, Users, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { formatImageUrl } from "./utils/imageUtils";
import { formatTimeAgo } from "./utils/dateUtils";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { projectIdeasApi } from "./API Calls/services/projectIdeas.api";


//Project idea objects created
interface ProjectIdeaProps {
  project: {
    id: string; //CHANGE: to string to match backend UUID
    title: string;
    idea: string;
    skills: string[];
    wishesCount: number;
    hasWished: boolean; // Indicates if the current user has already wished for this idea
    userId: string;
    createdAt: string;
    user: { name: string; profilePicture: string };
    
  };
  delay: number;
  activeTab: 'latest' | 'forYou';
}

interface ProjectJoinRequest {
  name: string;
  email: string;
  skills: string[];
  motivation: string;

}


// skills list for the project idea join request (can be used for a dropdown)
const professionalSkills = [
  "JavaScript", "Python", "Java", "C++", "React", "Node.js", 
  "TypeScript", "SQL", "MongoDB", "Docker", "AWS", "Git",
  "Machine Learning", "Data Science", "Mobile Development",
  "UI/UX Design", "Graphic Design", "Video Editing", "Copywriting", "3D Modeling",
  "Project Management", "Financial Modeling", "Marketing", "Sales", "Public Speaking", "Data Analysis"
];

/**
 * ProjectIdeaCard Component
 * * Displays a single project concept/pitch card.
 * * Handles user interactions like "Wishing" (voting) on an idea and opening the Join form.
 * * @param {ProjectIdeaProps} props - Contains the idea data and animation delay.
 */
export function ProjectIdeaCard({ project, activeTab }: ProjectIdeaProps) {

  // =========================================
  // State Definitions
  // =========================================

  // Manages the list of skills the user selects when applying to join a project idea.
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Controls the visibility of the "Request to Join" modal/form
  const [showJoinForm, setShowJoinForm] = useState(false);

  // 1. local states to immediately reflect changes in the UI when a user clicks "Wish" without waiting for the server response.
  const [localWishes, setLocalWishes] = useState(project.wishesCount);
  const [localHasWished, setLocalHasWished] = useState(project.hasWished);

  


  // 2. Sync Local State with Server Data
  // This ensures that if the cache updates in the background (or after a refresh), 
  // our local state doesn't get out of sync.
  useEffect(() => {
    setLocalWishes(project.wishesCount);
    setLocalHasWished(project.hasWished);
  }, [project.wishesCount, project.hasWished]);

  // =========================================
  // Mutation Function for "Wishing" (Liking) an Idea
  // =========================================

  const queryClient = useQueryClient();

  const wishMutation = useMutation({
    mutationFn: () => projectIdeasApi.toggleWish(project.id),
    
    onMutate: async () => {
      // INSTANT UI UPDATE: We don't mess with the complex global cache here.
      // We just immediately flip our local state variables so the user sees it instantly.
      const isNowWishing = !localHasWished;
      
      setLocalHasWished(isNowWishing);
      setLocalWishes((prev) => isNowWishing ? prev + 1 : Math.max(0, prev - 1));
    },
    
    onError: () => {
      // ROLLBACK: If the API fails, revert the visual state back to the true server props
      setLocalWishes(project.wishesCount);
      setLocalHasWished(project.hasWished);
      console.error("Failed to update wish status");
    },
    
    onSettled: () => {
      // BACKGROUND SYNC: Tell React Query to fetch the fresh list quietly in the background.
      // Note: We are strictly invalidating the base key to ensure it catches everything.
      queryClient.invalidateQueries({ queryKey: ['projectIdeas'] });
    },
  });
  


  // =========================================
  // Event Handlers
  // =========================================

  /**
   * Handles the "Make a Wish" (Like) action.
   * - Prevents multiple rapid clicks while a mutation is in flight.
   * - Triggers the mutation which optimistically updates the UI and syncs with the backend.
   */
  const handleWish = () => {
    // Prevent spam clicking while a request is actively resolving
    if (wishMutation.isPending) return;
    wishMutation.mutate();
  };

  /**
   * Handles adding a skill to the selected skills list.
   * @param skill 
   * handling skills removal and addition in the join request form. 
   * This allows users to select their relevant skills when applying to join a project idea, and also remove any mistakenly added skills before submitting their join request.
   */

  const handleAddSkill = (skill: string) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  // Format the URL once before rendering
  const profilePicUrl = formatImageUrl(project.user.profilePicture);

    return (
    <>

    {/* Main Card Container 
          - Uses Framer Motion for entrance animations.
      */}
      <motion.div
        // Animation States:
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}

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
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-sm">
            <img 
              className="w-full h-full object-cover"
              src={profilePicUrl} 
              alt={`${project.user.name}'s profile`} 
              // Optional: Add a fallback image locally in your public folder in case the backend image 404s
              onError={(e) => {
                e.currentTarget.src = '/default-avatar.png'; 
              }}
            />
          </div>

          {/* Content Wrapper 
              - flex-1: Takes up remaining width.
              - min-w-0: Flexbox hack that forces text children to wrap/truncate 
                instead of overflowing the container.
          */}
          <div className="flex-1 min-w-0">
            {/* Header Row: Name + Timestamp */}
            <div className="flex items-center gap-2 mb-2.5"> {/* mb-2.5 adds exactly 10px of space below */}
              <h4 className="text-gray-800 font-medium leading-none">{project.user.name}</h4>
              
              <div className="flex items-center text-gray-500 text-sm leading-none">
                <span className="mr-2 text-gray-400">•</span>
                
                <span>{formatTimeAgo(project.createdAt)}</span>
              </div>
            </div>

            {/* Project Title */}
            <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
            
            {/* Project Idea / Pitch */}
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
                localHasWished
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                  : "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 border border-green-200"
              }`}
            >
              <Leaf className="w-4 h-4" />
              <span>{localWishes}</span>
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
        {/* =========================================
            OUTER WRAPPER (THE FIX)
            - fixed inset-0: Fills the whole screen.
            - flex items-center justify-center: Forces the modal to the dead center.
            - z-50: Sits on top of everything.
            - p-4: Adds padding so the modal doesn't touch screen edges on mobile.
           ========================================= */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Backdrop Overlay 
                - fixed inset-0: Stretches to fill the entire viewport.
                - backdrop-blur-sm: Blurs the content behind the modal for focus.
                - z-50: High z-index to sit on top of all other content.
                - onClick: Closes the modal if the user clicks the dark background.
                - Changed to 'absolute' to fill the wrapper.
                - Handled click to close.
            */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowJoinForm(false)}
            />

            {/* Modal Window Container 
                - fixed top-1/2 left-1/2...: Centers the element perfectly.
                - max-w-2xl: Sets a comfortable maximum width for the form.
                - Removed: fixed top-1/2 left-1/2 -translate... (The cause of the bug)
                - Added: relative (to sit above backdrop)
                - Added: bg-white (Fixes the "void" background issue)
                - Added: w-full max-w-2xl (Size constraints)
            */}
            <motion.div
            // Entrance Animation: Slide Up + Scale Up + Fade In
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 mx-4"
              // CRITICAL: Stop Propagation
              // Prevents clicks inside the white form box from bubbling up 
              // to the backdrop and closing the modal.
              onClick={(e) => e.stopPropagation()}
            >
              

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
                      - Asks the user to select relevant tech stack experience from predefined skills.
                  */}
                  <div>
                    <label htmlFor="joinRequestSkills" className="block mb-2 text-sm font-medium">Your Skills</label>
                    
                    {/* Display selected skills as removable badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedSkills.length === 0 && (
                        <span className="text-sm text-gray-500 italic">No skills selected yet.</span>
                      )}
                      {selectedSkills.map(skill => (
                        <span 
                          key={skill} 
                          className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 border border-blue-200"
                        >
                          {skill}
                          <button 
                            type="button" // Prevents accidental form submission
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:text-red-600 transition-colors focus:outline-none"
                            aria-label={`Remove ${skill}`}
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Dropdown to add new skill */}
                    <select
                      id="joinRequestSkills"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      onChange={(e) => {
                        handleAddSkill(e.target.value);
                        e.target.value = ""; // Reset the select dropdown back to default after choosing
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>Select a skill to add...</option>
                      {professionalSkills
                        .filter(skill => !selectedSkills.includes(skill)) // Efficiency: Hide skills they already selected
                        .sort() // Maintainability: Alphabetical sorting
                        .map(skill => (
                          <option key={skill} value={skill}>
                            {skill}
                          </option>
                        ))
                      }
                    </select>
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
              
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}