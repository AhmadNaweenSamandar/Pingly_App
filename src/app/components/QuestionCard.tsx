import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThumbsUp, MessageSquare, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";


// reusable objects for question card created
interface QuestionCardProps {
  question: {
    id: number;
    user: { name: string; avatar: string };
    question: string;
    useful: number;
    replies: Array<{ user: string; text: string }>;
  };
  delay: number;
}


/**
 * QuestionCard Component
 * * Displays a user-submitted question with options to upvote and reply.
 * * Manages local state for the reply thread and helpfulness counters.
 * * @param {QuestionCardProps} props - Contains question data and animation delay.
 */
export function QuestionCard({ question, delay }: QuestionCardProps) {

  // =========================================
  // UI Visibility State
  // =========================================

  // Toggles the textarea input for writing a new answer
  const [showAnswerBox, setShowAnswerBox] = useState(false);

  // Toggles the list of existing replies (accordion style)
  const [showReplies, setShowReplies] = useState(false);

  // =========================================
  // Data State
  // =========================================

  // Tracks the text input for a new reply
  const [newAnswer, setNewAnswer] = useState("");
  // Local copy of replies array to allow immediate updates when user posts
  const [useful, setUseful] = useState(question.useful);

  // =========================================
  // Voting State
  // =========================================

  // Local counter for "Useful" votes (initialized from props)
  const [hasVoted, setHasVoted] = useState(false);
  // Prevents multiple upvotes in the same session
  const [replies, setReplies] = useState(question.replies);

  // =========================================
  // Handlers
  // =========================================

  /**
   * Handles the "Useful" (Upvote) action.
   * Increments the counter and locks the button.
   */
  const handleVote = () => {
    if (!hasVoted) {
      setUseful(useful + 1);
      setHasVoted(true);
      // TODO: API call to persist vote would go here
    }
  };



  /**
   * Submits a new answer to the thread.
   * Updates the local list and manages UI visibility.
   */
  const handleSendAnswer = () => {
    // Validation: Ensure message is not empty
    if (newAnswer.trim()) {
      // 1. Update list
      setReplies([...replies, { user: "You", text: newAnswer }]);
      // 2. Reset input
      setNewAnswer("");

      // 3. UI Cleanup: Hide input box, but ensure the list of replies is OPEN
      // so the user sees their new message immediately.
      setShowAnswerBox(false);
      setShowReplies(true);
    }
  };




