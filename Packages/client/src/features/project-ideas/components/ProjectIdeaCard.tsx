import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, Users, X } from "lucide-react";
import { Button } from "../../../app/components/ui/button";
import { Badge } from "../../../app/components/ui/badge";
import { Input } from "../../../app/components/ui/input";
import { Textarea } from "../../../app/components/ui/textarea";
import { formatImageUrl } from "../../../app/components/utils/imageUtils";
import { formatTimeAgo } from "../../../app/components/utils/dateUtils";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { projectIdeasApi } from "../api/projectIdeas.api";
import { useJoinProject } from '../hooks/projectJoinRequest'; // Custom hook for handling join requests

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
export function ProjectIdeaCard({ project, showJoinForm, setShowJoinForm}: ProjectIdeaProps) {

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


  const { 
    motivation, setMotivation, isSubmitDisabled, isPending, handleSendRequest 
  } = useJoinProject(project.id, onClose);

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
    </>
  );
}