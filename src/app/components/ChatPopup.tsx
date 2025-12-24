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

}


