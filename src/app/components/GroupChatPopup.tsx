import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";


// Message interface with objects that will be used in Group chat logic
interface Message {
  id: number;
  sender: string;
  avatar: string;
  text: string;
  timestamp: Date;
}

// this interface contain objects for project group chat
interface GroupChatPopupProps {
  project: {
    id: number;
    name: string;
    members: Array<{ name: string; avatar: string }>;
  };
  onClose: () => void;
}


//static message sample for testing
const initialMessages: Message[] = [
  {
    id: 1,
    sender: "Alex Chen",
    avatar: "AC",
    text: "Hey everyone! Thanks for joining the project. Let's discuss our approach.",
    timestamp: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
  },
  {
    id: 2,
    sender: "Sarah Kim",
    avatar: "SK",
    text: "Excited to work on this! I think we should start with the backend API.",
    timestamp: new Date(Date.now() - 1000 * 60 * 110)
  },
  {
    id: 3,
    sender: "Mike Torres",
    avatar: "MT",
    text: "Great idea! I can handle the frontend components.",
    timestamp: new Date(Date.now() - 1000 * 60 * 100)
  },
  {
    id: 4,
    sender: "Emma Davis",
    avatar: "ED",
    text: "I'll work on the database schema and design the data models.",
    timestamp: new Date(Date.now() - 1000 * 60 * 90)
  },
];


/**
 * GroupChatPopup Component
 * * Manages the message history, input state, and auto-scrolling logic for a project chat.
 * @param {GroupChatPopupProps} props - Contains the active project data and close handler.
 */
export function GroupChatPopup({ project, onClose }: GroupChatPopupProps) {

  // =========================================
  // State & Refs
  // =========================================

  // Stores the list of active messages in the chat window
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  // Tracks the current text in the input field
  const [newMessage, setNewMessage] = useState("");

  // Reference to the message container DOM element
  // Used to manipulate scroll position programmatically
  const scrollRef = useRef<HTMLDivElement>(null);


  // =========================================
  // Effects
  // =========================================


  /**
   * Auto-scroll Effect
   * * Triggers whenever the 'messages' array updates (e.g., new message sent/received).
   * Scrolls the container to the bottom so the latest message is visible.
   */

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // =========================================
  // Handlers
  // =========================================


  /**
   * Creates and appends a new message object.
   * Handles "Enter" key or "Send" button clicks.
   */
  const handleSendMessage = () => {

    // Validation: Prevent sending empty or whitespace-only messages
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now(), // Use timestamp as temporary unique ID
        sender: "You",
        avatar: "YO", // Placeholder initials for the current user
        text: newMessage,
        timestamp: new Date()
      };

      // Update state: Append new message to the existing list
      setMessages([...messages, message]);

      // Reset input field
      setNewMessage("");
    }
  };


  /**
   * Formats a Date object into a relative time string.
   * Returns: "just now", "5m ago", "2h ago", or date string.
   */
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // Calculate difference in minutes
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    
    // Calculate difference in hours if > 60 minutes
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    // Fallback to standard date string for older messages
    return date.toLocaleDateString();
  };

  return (
    /* Enables exit animations when the component unmounts */
    <AnimatePresence>
      <>

      {/* Backdrop Overlay
            - fixed inset-0: Covers the entire viewport.
            - bg-black/50: Semi-transparent dark layer.
            - backdrop-blur-sm: Applies a blur filter to content behind the modal.
            - onClick: Triggers the close function when clicking outside the modal.
        */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Chat Modal Window
            - fixed top-1/2 left-1/2...: Centers the modal perfectly in the viewport.
            - flex flex-col: Establishes a vertical layout context. 
              (Header -> Message List -> Input Area)
        */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}

          // Container Styling:
          // - max-w-2xl: Wider width for chat readability.
          // - max-h-[80vh]: Prevents the modal from being taller than the screen.
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[80vh] flex flex-col"

          // Stop Propagation: Prevents clicks inside the chat window from bubbling 
          // to the backdrop and accidentally closing the modal.
          onClick={(e) => e.stopPropagation()}
        >
            {/* Main Chat Card Container 
              - bg-white: The actual background of the chat window.
              - overflow-hidden: Ensures children (like scrollbars) don't poke out of rounded corners.
              - flex flex-col: Stacks Header, Messages, and Input vertically.
              - max-h-full: Respects the parent's height constraint.
            */}
            <div className="bg-white rounded-2xl shadow-2xl mx-4 flex flex-col max-h-full overflow-hidden">
            {/* Header Section 
                - flex-shrink-0: CRITICAL. Prevents the header from collapsing 
                  when the message list grows large.
                - border-b: Visual separation from the message list.
            */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 flex-shrink-0">
                {/* Context Icon (Group/Users) */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                <Users className="w-6 h-6" />
              </div>

              {/* Title & Metadata 
                  - flex-1: Takes up all available space, pushing the Close button to the far right.
              */}
              <div className="flex-1">
                <h3 className="text-gray-800">{project.name}</h3>
                <p className="text-gray-600">{project.members.length} members</p>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Messages Scroll Container 
                - ref={scrollRef}: Connects to the useEffect hook to enable auto-scrolling to bottom.
                - flex-1: Allows this section to grow and fill all available vertical space.
                - overflow-y-auto: Enables vertical scrolling when messages exceed the height.
            */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white"
            >
              {messages.map((message, index) => {

                // Logic: Determine if the message belongs to the current user ("You")
                const isMe = message.sender === "You";
                return (
                  <motion.div
                    key={message.id}

                    // Entrance Animation: Staggered fade-in from the bottom
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}

                    // Alignment Logic:
                    // - isMe = justify-end (Right side)
                    // - !isMe = justify-start (Left side)
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >

                    {/* Message Row Container 
                        - max-w-[70%]: Prevents bubbles from stretching the full screen width.
                        - flex-row-reverse: Swaps avatar/bubble positions for the sender ("You").
                    */}
                    <div className={`flex gap-2 max-w-[70%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>

                    {/* User Avatar 
                          - flex-shrink-0: Prevents avatar from squishing if the message is long.
                      */}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white flex-shrink-0">
                        {message.avatar}
                      </div>

                      {/* Message Content Wrapper */}
                      <div>

                        {/* Sender Name Label 
                            - Only shown for other people, not for "You".
                        */}
                        {!isMe && (
                          <p className="text-xs text-gray-600 mb-1 ml-1">{message.sender}</p>
                        )}

                        {/* Bubble Styling 
                            - Conditional classes apply different colors and "tails".
                            - isMe: Green gradient, sharp bottom-right corner (rounded-br-sm).
                            - !isMe: White background, sharp bottom-left corner (rounded-bl-sm).
                        */}
                        <div
                          className={`px-4 py-3 rounded-2xl ${
                            isMe
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-br-sm"
                              : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                          }`}
                        >
                          <p>{message.text}</p>
                        </div>

                        {/* Timestamp 
                            - Aligns text left or right depending on the sender.
                        */}
                        <p className={`text-xs text-gray-400 mt-1 ${isMe ? "text-right" : "text-left"} ml-1`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>


            {/* Message Input Footer 
                - border-t: Creates visual separation from the message list.
                - flex-shrink-0: CRITICAL. Prevents this section from collapsing 
                  when the message list takes up available space.
            */}
            <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="flex gap-3">

                {/* Text Input Area 
                    - Uses a Textarea component (likely from a UI library like shadcn/ui) 
                      to allow for multi-line messages.
                */}
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  rows={1}

                  // Styling:
                  // - resize-none: Prevents user from manually resizing the box.
                  // - min-h/max-h: Sets boundaries for how tall the box can auto-grow.
                  className="flex-1 resize-none min-h-[44px] max-h-[120px]"

                  // Keyboard Event Handler
                  onKeyDown={(e) => {

                    // Logic: If user hits Enter WITHOUT Shift
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault(); // Prevent the default "new line" character
                      handleSendMessage(); // Trigger send
                    }
                  }}
                />

                {/* Send Button */}
                <Button
                  onClick={handleSendMessage}
                  // Validation: Disable button if input is empty or just whitespace
                  disabled={!newMessage.trim()}

                  // Styling:
                  // - self-end: Aligns button to the bottom if textarea grows tall.
                  // - gradient: Matches the project theme.
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* UX Hint: Explains the Enter vs Shift+Enter behavior */}
              <p className="text-xs text-gray-400 mt-2">Press Enter to send, Shift + Enter for new line</p>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}


