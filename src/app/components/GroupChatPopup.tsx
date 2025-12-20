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


