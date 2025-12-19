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


/**
 * Projects Component
 * * Manages the main dashboard view for user projects.
 * Handles state for project lists, interaction modals (chat/details), 
 * and data formatting for display.
 */
export function Projects() {

  // =========================================
  // State Definitions
  // =========================================

  // Main data source for the project list
  const [projects, setProjects] = useState(projectsData);

  // Track specific projects selected for different interactions
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showGroupChat, setShowGroupChat] = useState(false);

  // UI visibility toggles
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [detailsProject, setDetailsProject] = useState<Project | null>(null);

  // =========================================
  // Event Handlers
  // =========================================

  /**
   * Removes a project from the user's list and closes any open menus.
   * Simulates the user "leaving" a collaborative team.
   * @param {number} projectId - The ID of the project to remove
   */

  const handleLeaveProject = (projectId: number) => {
    setProjects(projects.filter(p => p.id !== projectId));
    setMenuOpenId(null);
  };

  /**
   * Opens the detailed view modal for a specific project.
   * @param {Project} project - The project object to display
   */


  const handleShowDetails = (project: Project) => {
    setDetailsProject(project);
    setMenuOpenId(null);
  };

    /**
   * Opens the chat interface for a project and resets notification logic.
   * NOTE: This updates the local state to set unreadMessages to 0.
   * @param {Project} project - The project to enter chat for
   */
  const handleChatOpen = (project: Project) => {
    setSelectedProject(project);
    setShowGroupChat(true);

    // Map through projects to find the matching ID and reset unread count
    setProjects(projects.map(p => 
      p.id === project.id ? { ...p, unreadMessages: 0 } : p
    ));
  };


  // =========================================
  // Helper Functions & Derived State
  // =========================================

  /**
   * Converts a Date object into a relative time string.
   * Returns: "Today", "Yesterday", "{n} days ago", or local date string.
   */
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // Convert milliseconds difference to days
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  // Create a sorted copy of the projects array based on team size (Largest to Smallest).
  // Uses spread syntax [...projects] to avoid mutating the original state directly.

  const sortedProjects = [...projects].sort((a, b) => b.members.length - a.members.length);

}
