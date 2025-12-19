import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FolderKanban, MessageCircle, MoreVertical, X, Users, Calendar } from "lucide-react";
import { GroupChatPopup } from "./GroupChatPopup";


// the project interface initializing project parameters
interface Project {
  id: number;
  name: string;
  description: string;
  owner: string;
  members: Array<{ name: string; avatar: string }>;
  unreadMessages: number;
  datePosted: Date;
}

const projectsData: Project[] = [

/**
 * Static list of project data used to mock the dashboard UI.
 * This array simulates the response structure expected from the backend API.
 * * @type {Project[]}
 */
  {
    // Unique identifier for the project used for React keys and routing
    id: 1,

    // Core project details to be displayed in the card header
    name: "AI Study Assistant",
    description: "Building a collaborative note-taking app with real-time synchronization",
    owner: "Alex Chen",

    // Array of team members participating in the project
    // Used to render the avatar stack in the UI
    members: [
      { name: "Alex Chen", avatar: "AC" },
      { name: "Sarah Kim", avatar: "SK" },
      { name: "Mike Torres", avatar: "MT" },
      { name: "Emma Davis", avatar: "ED" }
    ],

    // Notification counter for the user regarding this specific project
    unreadMessages: 3,

    // Timestamp calculation:
    // Subtracts 2 days (in milliseconds) from the current time to simulate a recent post.
    // Calculation: 1000ms * 60s * 60m * 24h * 2 days
    datePosted: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
  },

    //the same logic repeated for id:2
    {
    id: 2,
    name: "Flashcard Generator",
    description: "AI-powered flashcard generator with spaced repetition",
    owner: "Sarah Johnson",
    members: [
      { name: "Sarah Johnson", avatar: "SJ" },
      { name: "Ryan Kim", avatar: "RK" },
      { name: "Lisa Wang", avatar: "LW" }
    ],
    unreadMessages: 0,
    datePosted: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
  },

  //the same logic repeated for id:3
  {
    id: 3,
    name: "Peer Tutoring Marketplace",
    description: "Platform connecting students for peer-to-peer tutoring",
    owner: "Mike Torres",
    members: [
      { name: "Mike Torres", avatar: "MT" },
      { name: "Nina Patel", avatar: "NP" }
    ],
    unreadMessages: 1,
    datePosted: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  }
];
