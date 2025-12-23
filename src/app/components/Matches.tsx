import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, MessageCircle, MoreVertical, X, Calendar } from "lucide-react";
import { ChatPopup } from "./ChatPopup";


//objects for matching created
interface Match {
  id: number;
  user: {
    name: string;
    avatar: string;
    image: string;
  };
  matchedAt: Date;
  unreadCount: number;
  lastMessage?: string;
}


//mock data created for matching and messages
const matchesData: Match[] = [
  {
    id: 1,
    user: {
      name: "Alex Park",
      avatar: "AP",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
    },
    matchedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    unreadCount: 2,
    lastMessage: "Hey! Ready for that study session?"
  },
  {
    id: 2,
    user: {
      name: "Emma Wilson",
      avatar: "EW",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80"
    },
    matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 0,
    lastMessage: "Thanks for the help earlier!"
  },
  {
    id: 3,
    user: {
      name: "Sofia Martinez",
      avatar: "SM",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80"
    },
    matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    unreadCount: 1,
    lastMessage: "Love your project idea!"
  },
  {
    id: 4,
    user: {
      name: "James Chen",
      avatar: "JC",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80"
    },
    matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unreadCount: 0,
    lastMessage: "See you at the library tomorrow!"
  }
];



/**
 * Matches Component
 * * Displays the list of successful connections (matches).
 * * Manages interactions like Chatting, Viewing Profile, and Unmatching.
 */
export function Matches() {

  // =========================================
  // State Definitions
  // =========================================

  // Tracks which user is currently selected for a Chat session.
  // null = showing the list; Object = showing the Chat interface.
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // The list of connections. Initialized with mock 'matchesData'.
  const [matches, setMatches] = useState(matchesData);

  // Tracks the open state of the dropdown menus for each card.
  // Stores the ID of the match whose menu is currently open.
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  // Tracks which user profile is currently being viewed in detail (Modal).
  const [detailsMatch, setDetailsMatch] = useState<Match | null>(null);


  // =========================================
  // Helpers
  // =========================================


  /**
   * Formats a date into a social-media style relative string.
   * e.g., "just now", "5m ago", "2d ago".
   */
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };



  // =========================================
  // Interaction Handlers
  // =========================================

  /**
   * Opens the Chat interface for a specific match.
   * * Also resets the 'unread' indicator for that user.
   */
  const handleChatOpen = (match: Match) => {
    // 1. Set the active user for the Chat component
    setSelectedMatch(match);

    // 2. Clear Notification:
    // Iterate through matches and set unreadCount to 0 for the selected ID.
    setMatches(matches.map(m => 
      m.id === match.id ? { ...m, unreadCount: 0 } : m
    ));
  };


  /**
   * Removes a user from the matches list.
   * * Triggered from the 'Unmatch' dropdown option.
   */
  const handleUnmatch = (matchId: number) => {

    // Filter out the ID to remove it from state
    setMatches(matches.filter(m => m.id !== matchId));

    // Close the dropdown menu if it was open
    setMenuOpenId(null);
  };


  /**
   * Opens the Profile Details modal.
   * * Triggered from the 'View Profile' dropdown option.
   */
  const handleShowDetails = (match: Match) => {
    setDetailsMatch(match);
    setMenuOpenId(null);
  };


  // =========================================
  // Formatters
  // =========================================



  /**
   * Standard date formatter (e.g., "October 24, 2025").
   */
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  /**
   * Mock Age Calculator
   * * Returns a specific age for demo users, or defaults to 21.
   * * TODO: Replace with 'user.age' from backend API.
   */
  const getAge = (name: string) => {
    const ages: { [key: string]: number } = {
      "Alex Park": 22,
      "Emma Wilson": 21,
      "Sofia Martinez": 20,
      "James Chen": 23
    };
    return ages[name] || 21;
  };

}

