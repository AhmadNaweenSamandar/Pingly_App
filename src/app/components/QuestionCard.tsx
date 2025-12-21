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


  return (

    {/* Main Question Card Container
        - Uses Framer Motion for entrance animations.
        - transition={{ delay }}: Staggers the appearance based on list index.
    */}
    <motion.div

      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}

      // Card Styling:
      // - hover:shadow-xl: Lifts the card visually when hovered.
      // - border-gray-100: Very subtle border for structure.
      className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all"
    >

        {/* Header & Content Wrapper 
          - flex items-start: Aligns content to the top (useful for long questions).
      */}
      <div className="flex items-start gap-4 mb-4">

        {/* User Avatar 
            - purple-to-pink gradient: Visual theme for the "Q&A" section.
            - flex-shrink-0: Prevents avatar from squishing if text is wide.
        */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white flex-shrink-0">
          {question.user.avatar}
        </div>

        {/* Question Text Container 
            - min-w-0: Standard fix for text truncation/wrapping inside Flexbox.
        */}
        <div className="flex-1 min-w-0">

            {/* User Name */}
          <h4 className="text-gray-800 mb-1">{question.user.name}</h4>

          {/* The Actual Question 
              - leading-relaxed: Increases line-height for better readability.
          */}
          <p className="text-gray-700 leading-relaxed">{question.question}</p>
        </div>
      </div>

      {/* Action Buttons Container 
          - justify-end: Aligns the buttons to the right side of the card.
          - mb-4: Adds spacing below the buttons (before the input box appears).
      */}
      <div className="flex items-center justify-end gap-2 mb-4">

        {/* Vote / "Useful" Button 
            - Uses Framer Motion for tactile micro-interactions (scale up/down).
        */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleVote}

          /* Conditional Styling:
             - Checks 'hasVoted' to determine if the button should look "active".
             - Active: Solid Blue-Purple gradient + Shadow.
             - Inactive: Light Purple background + Border.
          */
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            hasVoted
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
              : "bg-gradient-to-r from-blue-50 to-purple-50 text-purple-700 hover:from-blue-100 hover:to-purple-100 border border-purple-200"
          }`}
        >
          <ThumbsUp className="w-4 h-4" />

          {/* Display the current count of helpful votes */}
          <span>{useful}</span>
        </motion.button>


        {/* Answer Toggle Button 
            - Toggles the visibility of the input text area.
            - Styled with Purple/Pink gradient to match the Q&A visual theme.
        */}

        <Button
          onClick={() => setShowAnswerBox(!showAnswerBox)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Answer
        </Button>
      </div>




