import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";



//variable for feedback modal created
interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}



/**
 * FeedbackModal Component
 * * A general-purpose modal for collecting user sentiment and bug reports.
 */
export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {

  // =========================================
  // State Definitions
  // =========================================
  const [rating, setRating] = useState(0);                 // Star rating (0-5)
  const [category, setCategory] = useState("");            // Feedback Type
  const [feedback, setFeedback] = useState("");            // Text content
  const [submitted, setSubmitted] = useState(false);       // UI Switch (Form vs Success)


  // =========================================
  // Handlers
  // =========================================
  const handleSubmit = (e: React.FormEvent) => {


    e.preventDefault();
    // 1. Trigger Success View
    setSubmitted(true);

    // 2. Auto-Close Sequence
    // Show the "Thank You" message for 2 seconds, then clean up.
    setTimeout(() => {
      onClose();                // Close Modal
      setSubmitted(false);      // Reset UI mode
      setRating(0);             // Reset Rating
      setCategory("");          // Reset Category
      setFeedback("");          // Reset Text
    }, 2000);
  };
  

  // Conditional Rendering: Don't render anything if modal is closed
  if (!isOpen) return null;

}