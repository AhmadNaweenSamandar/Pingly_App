import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Smile } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";



//objects created for messages
interface Message {
  id: number;
  sender: "me" | "them";
  text: string;
  timestamp: Date;
}


//objects created for ChatPopup
interface ChatPopupProps {
  match: {
    id: number;
    user: {
      name: string;
      avatar: string;
      image: string;
    };
  };
  onClose: () => void;
}


//mock data created for messages
const initialMessages: Message[] = [
  {
    id: 1,
    sender: "them",
    text: "Hey! I saw you're also studying Computer Science. What courses are you taking this semester?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
  },
  {
    id: 2,
    sender: "me",
    text: "Hi! I'm taking Data Structures, Web Development, and AI. How about you?",
    timestamp: new Date(Date.now() - 1000 * 60 * 50) // 50 min ago
  },
  {
    id: 3,
    sender: "them",
    text: "Nice! I'm in Web Dev too! Would you be interested in studying together sometime?",
    timestamp: new Date(Date.now() - 1000 * 60 * 45) // 45 min ago
  },
  {
    id: 4,
    sender: "me",
    text: "That sounds great! I'm free this weekend. Coffee and coding?",
    timestamp: new Date(Date.now() - 1000 * 60 * 40) // 40 min ago
  },
  {
    id: 5,
    sender: "them",
    text: "Perfect! Saturday afternoon at the campus café? Around 2 PM?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 min ago
  }
];




/**
 * ChatPopup Component
 * * A floating modal for real-time messaging.
 * * Handles message history, auto-scrolling, and simulated replies.
 */
export function ChatPopup({ match, onClose }: ChatPopupProps) {

  // =========================================
  // State & Refs
  // =========================================

  // Stores the conversation history
  const [messages, setMessages] = useState<Message[]>(initialMessages);


  // Controlled input for the text field
  const [newMessage, setNewMessage] = useState("");


  // Ref to the message list container (used for auto-scrolling)
  const scrollRef = useRef<HTMLDivElement>(null);



  // =========================================
  // Effects
  // =========================================



  // Auto-scroll to bottom whenever the message list changes
  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollRef.current) {
        // Set the scroll position to the total height of the content
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);



  // =========================================
  // Handlers
  // =========================================

  const handleSendMessage = () => {
    // Prevent sending empty or whitespace-only messages
    if (newMessage.trim()) {

      // 1. Create the User's Message object
      const message: Message = {
        id: Date.now(),
        sender: "me",
        text: newMessage,
        timestamp: new Date()
      };


      // 2. Update State: Add user message immediately
      setMessages([...messages, message]);
      setNewMessage("");

      // Simulate a response after a delay
      // 3. Simulate "Bot" Reply
      setTimeout(() => {
        const responses = [
          "That works for me!",
          "Sounds good! 😊",
          "Looking forward to it!",
          "Great! See you then!",
          "Perfect timing!"
        ];

        // Create the Reply Message object
        const response: Message = {
          id: Date.now() + 1,
          sender: "them",
          text: responses[Math.floor(Math.random() * responses.length)], // Pick random reply
          timestamp: new Date()
        };

        // Add reply to state (using functional update 'prev =>' to ensure we have latest state)
        setMessages(prev => [...prev, response]);
      }, 1000 + Math.random() * 2000);
    }
  };


  /**
   * Formats a message timestamp into a relative string.
   * Used to display time next to chat bubbles.
   * @param {Date} date - The timestamp of the message.
   */
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();  // Difference in milliseconds
    const minutes = Math.floor(diff / 60000);  // Convert to minutes
    
    // Immediate past
    if (minutes < 1) return "just now";

    // Within the last hour
    if (minutes < 60) return `${minutes}m ago`;
    
    // Within the last day
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    

    // Older than 24 hours -> Show full date
    return date.toLocaleDateString();
  };


  return (

    // AnimatePresence: Required to animate the modal *out* when 'selectedMatch' becomes null.
    <AnimatePresence>
      <>
        {/* =========================================
            LAYER 1: Backdrop Overlay
            ========================================= */}
        <motion.div
          // Fade In/Out Animation
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}


          // Styling:
          // - fixed inset-0: Covers the whole screen.
          // - bg-black/50: Dimmed background.
          // - backdrop-blur-sm: Blurs the underlying dashboard.
          // - z-50: High z-index to sit on top of everything.
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"

          // Interaction: Clicking the dark area closes the modal
          onClick={onClose}
        />


        {/* =========================================
            LAYER 2: Main Chat Container
            ========================================= */}
        <motion.div

          // Pop-up Animation: Scales up and slides up slightly
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}


          // Styling:
          // - fixed top-1/2 left-1/2... : Centers the div exactly in the viewport.
          // - w-full max-w-2xl: Responsive width.
          // - max-h-[80vh]: Ensures it fits on smaller laptop screens without scrolling the body.
          // - flex flex-col: Sets up the vertical layout for Header -> Messages -> Input.
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[80vh] flex flex-col"

          // Critical: Stop click propagation. 
          // Without this, clicking inside the chat box would trigger the backdrop's 'onClose'.
          onClick={(e) => e.stopPropagation()}
        >

          {/* Internal Card Container 
              - bg-white: The actual background of the chat box.
              - flex-col: Stacks Header -> Messages -> Input vertically.
              - max-h-full: Ensures it respects the 80vh limit set by the parent.
              - overflow-hidden: Clips the rounded corners so children don't bleed out.
          */}
          <div className="bg-white rounded-2xl shadow-2xl mx-4 flex flex-col max-h-full overflow-hidden">
            {/* Header */}
            {/* === CHAT HEADER === 
                - flex-shrink-0: CRITICAL. Prevents the header from squishing 
                  when the message list gets long.
                - border-b: Separates header from messages.
            */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-gradient-to-r from-pink-50 to-rose-50 flex-shrink-0">

              {/* User Avatar */}
              <img
                src={match.user.image}
                alt={match.user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              />

              {/* User Info & Status */}
              <div className="flex-1">
                <h3 className="text-gray-800">{match.user.name}</h3>
                <p className="text-green-600 flex items-center gap-1">

                  {/* Green Pulse Dot */}
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Active now
                </p>
              </div>


              {/* Close Button 
                  - Triggers the onClose prop passed from the parent component.
              */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Messages */}
            {/* === MESSAGE LIST CONTAINER === 
                - flex-1: Takes up all available vertical space between Header and Input.
                - overflow-y-auto: Enables internal scrolling.
                - ref={scrollRef}: Targeted by auto-scroll logic.
            */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white"
            >
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}

                  // Animation: Messages slide up slightly when they appear
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}

                  // Alignment Control:
                  // - "me" -> Right aligned
                  // - "them" -> Left aligned
                  className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                >

                  {/* Bubble Group Wrapper 
                      - max-w-[70%]: Prevents messages from stretching full width (like real chat apps).
                      - flex-row-reverse: For "me", puts the bubble on the right.
                  */}
                  <div className={`flex gap-2 max-w-[70%] ${message.sender === "me" ? "flex-row-reverse" : "flex-row"}`}>

                    {/* Avatar (Only visible for "them") */}
                    {message.sender === "them" && (
                      <img
                        src={match.user.image}
                        alt={match.user.name}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                    )}

                    {/* Message Bubble & Time Wrapper */}
                    <div>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          message.sender === "me"
                          // My Style: Pink Gradient, Sharp Bottom-Right Corner
                            ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-sm"
                            // Their Style: White/Gray, Sharp Bottom-Left Corner
                            : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                        }`}
                      >
                        <p>{message.text}</p>
                      </div>

                      {/* Timestamp 
                          - Aligned to match the message side.
                      */}
                      <p className={`text-xs text-gray-400 mt-1 ${message.sender === "me" ? "text-right" : "text-left"}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            {/* === INPUT FOOTER === 
                - border-t: Separates input from messages.
                - flex-shrink-0: Keeps this section fixed at the bottom.
            */}
            <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="flex gap-3">

                {/* Message Input Field */}
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  rows={1}

                  // Styling:
                  // - resize-none: Prevents user from dragging the corner (layout breaking).
                  // - min-h-[44px]: Comfortable touch target size.
                  className="flex-1 resize-none min-h-[44px] max-h-[120px]"

                  // Keyboard Shortcuts:
                  // - Enter: Send
                  // - Shift+Enter: New Line
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />


                {/* Send Button 
                    - self-end: Aligns button to the bottom if textarea grows tall.
                    - disabled: Grayed out if input is empty/whitespace only.
                */}
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Helper Hint */}
              <p className="text-xs text-gray-400 mt-2">Press Enter to send, Shift + Enter for new line</p>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}


