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