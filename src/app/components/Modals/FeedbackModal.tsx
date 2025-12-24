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
            LAYER 2: Modal Card
            ========================================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl"

          // Prevent clicks inside the modal from closing it
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4">

            {/* Close Button (Top Right X) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>


            {/* =========================================
                CONTENT SWITCHER: Success vs Form
                ========================================= */}
            {submitted ? (

              // --- VIEW 1: SUCCESS STATE ---
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >

                {/* Success Icon */}
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-gray-800 mb-2">Thank you for your feedback!</h3>
                <p className="text-gray-600">We appreciate your input and will use it to improve Pingly.</p>
              </motion.div>
            ) : (
              <>

                // --- VIEW 2: FEEDBACK FORM ---
                <h2 className="text-gray-800 mb-2">Send Feedback</h2>
                <p className="text-gray-600 mb-6">Help us improve your experience</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* === INPUT: Star Rating === */}
                  <div>
                    <label className="block mb-2 text-gray-700">How would you rate your experience?</label>
                    <div className="flex gap-2">
                      {/* Generate 5 Stars */}
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"  // Prevent form submission
                          onClick={() => setRating(star)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 ${

                              // Logic: Fill stars up to the selected rating
                              star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>


                  {/* Category */}

                  {/* === INPUT: Category Dropdown === 
                      - Uses a native select for simplicity in this modal.
                  */}
                  <div>
                    <label className="block mb-2 text-gray-700">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="bug">Bug Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="improvement">Improvement Suggestion</option>
                      <option value="ui">UI/UX Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>


                  {/* Feedback */}

                  {/* === INPUT: Detailed Feedback Text Area === 
                      - Large area for open-ended text.
                  */}
                  <div>
                    <label className="block mb-2 text-gray-700">Your Feedback</label>
                    <Textarea
                      placeholder="Tell us what you think..."
                      rows={6}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      required // Prevents empty submission
                    />
                  </div>

                  {/* Submit Button */}

                  {/* === FORM ACTIONS === 
                      - Flex container aligns buttons to the right.
                  */}
                  <div className="flex gap-3 justify-end pt-4">

                    {/* Cancel Button: Closes modal without action */}
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel

                    {/* Submit Button: Triggers the form submission */}
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                      <Send className="w-4 h-4 mr-2" />
                      Send Feedback
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}