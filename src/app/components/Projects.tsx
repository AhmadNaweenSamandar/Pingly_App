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

return (
    <>

    {/* Main Card Container 
        - Uses Framer Motion's 'motion.div' for animation capabilities.
        - 'whileHover': Enhances depth by increasing shadow intensity on mouseover.
      */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        whileHover={{ boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      >

        {/* Card Header Section 
          - Uses flexbox to align the Icon and Text horizontally 
        */}
        <div className="flex items-center gap-3 mb-6">
        {/* Icon Container: Green gradient background with rounded corners */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
            {/* Project/Kanban Icon */}
            <FolderKanban className="w-6 h-6 text-white" />
          </div>

          {/* Text Container: Title and Subtitle */}
          <div>
            <h3 className="text-gray-800">Projects</h3>
            <p className="text-gray-500">Your active collaborations</p>
          </div>
        </div>

        {/* Projects Grid */}

        {/* Projects Grid Container 
            - 'space-y-4': Adds vertical spacing between child elements 
        */}
        <div className="space-y-4">

        {/* Conditional Rendering: Check if the project list is empty */}
          {sortedProjects.length === 0 ? (

            /* Empty State: Displayed when no projects exist */
            <div className="text-center py-12 text-gray-400">
              <FolderKanban className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No projects yet. Join or create one!</p>
            </div>
          ) : (

            /* List Rendering: Map through sorted projects if data exists */
            sortedProjects.map((project, index) => (

            /* Individual Project Card 
                 - Uses Framer Motion for entrance animations.
                 - key: Unique identifier required for React lists.
            */
              <motion.div
                key={project.id}
                // Animation States:
                // Start slightly smaller and invisible
                initial={{ opacity: 0, scale: 0.95 }}
                // Animate to full size and visible
                animate={{ opacity: 1, scale: 1 }}
                // Stagger effect: Delays each card based on its position in the list (0.1s, 0.2s, etc.)
                transition={{ delay: index * 0.1 }}
                // Card Styling:
                // Relative positioning for absolute children (like badges).
                // Green gradient background and borders to match the section theme.
                className="relative p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 hover:shadow-lg transition-all"
              ></motion.div>
                {/* Three Dots Menu */}
                {/* Three Dots (Kebab) Menu Trigger Container
                    - Positioned absolutely in the top-right corner of the card.
                    - Parent container must have 'relative' class for this to work.
                */}
                <div className="absolute top-3 right-3">
                {/* Menu Toggle Button */}
                  <button
                /* Toggle Logic:
                       Checks if this specific project's menu is currently open (menuOpenId === project.id).
                       - If YES: Close it (set to null).
                       - If NO: Open it (set to project.id).
                    */
                    onClick={() => setMenuOpenId(menuOpenId === project.id ? null : project.id)}
                    /* Styling:
                       - p-1.5: Padding for touch target size.
                       - hover:bg-white/50: Subtle semi-transparent hover effect.
                       - rounded-full: Circular button shape.
                    */
                    className="p-1.5 hover:bg-white/50 rounded-full transition-colors"
                  >
                    {/* The Icon Component (Vertical dots) */}
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>

                {/* Menu Dropdown */}
                {/* Menu Dropdown Container 
                      - AnimatePresence is required here to enable the 'exit' animation 
                        when the component unmounts (i.e., when the menu closes).
                  */}
                  <AnimatePresence>
                    {/* Conditional Rendering: Only render if this specific project matches the open ID */}
                    {menuOpenId === project.id && (
                      <motion.div
                      // Animation States:
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}

                        // Dropdown Styling:
                        // - absolute right-0 top-full: Anchors menu below the trigger button, right-aligned.
                        // - z-10: Ensures menu floats above other UI elements (like the card below it).
                        // - overflow-hidden: Ensures hover effects on buttons don't spill outside rounded corners.
                        className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-10"
                      >

                        {/* Option 1: View Details */}
                        <button
                          onClick={() => handleShowDetails(project)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-700"
                        >
                          Details
                        </button>

                        {/* Option 2: Leave Project (Destructive Action)
                            - Styled with red text and red hover background to indicate a destructive/negative action.
                        */}
                        <button
                          onClick={() => handleLeaveProject(project.id)}
                          className="w-full px-4 py-2 text-left hover:bg-red-50 transition-colors text-red-600"
                        >
                          Leave Project
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Rank Badge */}
                <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white flex items-center justify-center shadow-md">
                  {index + 1}
                </div>
                {/* Project Content */}
                {/* Project Content Body 
                    - mt-8: Adds significant top margin to clear the absolute positioned elements 
                      (like the menu button and unread badges) located at the top of the card.
                */}
                <div className="mt-8 mb-4">
                {/* Project Title */}
                  <h4 className="text-gray-800 mb-2">{project.name}</h4>
                  {/* Project Description 
                      - text-gray-600: Lighter text color for hierarchy.
                      - line-clamp-2: CSS utility that truncates text after 2 lines and adds "..."
                        This is critical for maintaining consistent card heights in the grid.
                  */}
                  <p className="text-gray-600 line-clamp-2 mb-3">{project.description}</p>
