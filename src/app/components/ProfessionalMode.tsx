import { useState } from "react";
import { motion } from "motion/react";
import { MessageSquarePlus, Lightbulb, MessageCircle, Plus } from "lucide-react";
import { PointTable } from "./PointTable";
import { Discussion } from "./Discussion";
import { Projects } from "./Projects";
import { ProjectIdeaCard } from "./ProjectIdeaCard";
import { QuestionCard } from "./QuestionCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";


// Mock data for project ideas
const projectIdeas = [
  {
    id: 1,
    user: { name: "Alex Chen", avatar: "AC" },
    idea: "Building a collaborative note-taking app with real-time synchronization for study groups",
    skills: ["React", "Node.js", "WebSocket"],
    wishes: 24
  },
  {
    id: 2,
    user: { name: "Sarah Johnson", avatar: "SJ" },
    idea: "Creating an AI-powered flashcard generator that uses spaced repetition algorithms",
    skills: ["Python", "TensorFlow", "React"],
    wishes: 18
  },
  {
    id: 3,
    user: { name: "Mike Torres", avatar: "MT" },
    idea: "Developing a peer-to-peer tutoring marketplace for university students",
    skills: ["Vue.js", "Firebase", "Stripe API"],
    wishes: 31
  }
];


// Mock data for questions
const questions = [
  {
    id: 1,
    user: { name: "Emma Davis", avatar: "ED" },
    question: "What's the best approach to implement authentication in a MERN stack application?",
    useful: 15,
    replies: [
      { user: "John Doe", text: "I'd recommend using JWT tokens with httpOnly cookies for security." },
      { user: "Jane Smith", text: "Also consider implementing refresh tokens for better UX." }
    ]
  },
  {
    id: 2,
    user: { name: "Ryan Kim", avatar: "RK" },
    question: "How do I optimize database queries in a large-scale application?",
    useful: 22,
    replies: []
  },
  {
    id: 3,
    user: { name: "Lisa Wang", avatar: "LW" },
    question: "Best practices for responsive design in 2024?",
    useful: 8,
    replies: [
      { user: "Bob Wilson", text: "Use CSS Grid and Flexbox together for maximum flexibility." }
    ]
  }
];


/**
 * ProfessionalMode Component
 * * The main container for the professional networking side of the application.
 * * Manages the top-level state for global actions (creating projects, asking questions and creating discussions)
 * * and renders the main feed views.
 */
export function ProfessionalMode() {

  // =========================================
  // Modal Visibility State
  // =========================================

  // Controls the "Create New Project" popup form
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  // Controls the "Ask a Question" popup form
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  // Controls the "Post an Idea / Discussion" popup form
  const [showDiscussionDialog, setShowDiscussionDialog] = useState(false);


  return (

    /* Main Content Container 
       - max-w-7xl mx-auto: Centers content and constrains width for large screens.
       - pb-24: Adds significant bottom padding on mobile. 
         This is CRITICAL to prevent content from being hidden behind the 
         fixed bottom navigation bar typically found in mobile views.
    */
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 sm:pb-8">{/* Added pb-24 for mobile bottom nav */}
      {/* Action Buttons Wrapper 
          - Uses Framer Motion for entrance animation.
          - flex-wrap: Ensures buttons stack vertically on small screens if they run out of space.
      */}
      <motion.div 
        className="flex flex-wrap gap-4 mb-8"

        // Animation: Slide Up + Fade In
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >

        {/* ACTION 1: Post Project Idea 
            - Triggers the 'Project' modal.
            - Visual Theme: Blue Gradient.
        */}
        <Button
          onClick={() => setShowProjectDialog(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          Post Project Idea
        </Button>
        

        {/* ACTION 2: Ask Question 
            - Triggers the 'Question' modal.
            - Visual Theme: Purple Gradient.
        */}
        <Button
          onClick={() => setShowQuestionDialog(true)}
          className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <MessageSquarePlus className="w-4 h-4 mr-2" />
          Ask Answer
        </Button>
        

        {/* ACTION 3: Create Discussion 
            - Triggers the 'Discussion' modal.
            - Visual Theme: Indigo Gradient.
        */}
        <Button
          onClick={() => setShowDiscussionDialog(true)}
          className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Create Discussion
        </Button>
      </motion.div>


      {/* Top section: Leaderboard & Discussions Grids 
          - Wrapper uses Framer Motion for entrance animations.
      */}
      <motion.div
        // Layout Logic:
        // - grid-cols-1: Stacks vertically on mobile/tablet.
        // - lg:grid-cols-2: Splits into two equal columns on large screens (Desktop).
        // - gap-6: Adds space between the two widgets.
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"

        // Animation: Slide Up + Fade In
        // - delay: 0.3s (Starts slightly after the action buttons above appear)
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Grid 1: Point Table/Leaderboard 
            - Displays user points, rankings, or achievements.
        */}
        <PointTable />

        {/* Grid 2: Discussion 
            - Displays trending topics or general community chat.
        */}
        <Discussion />
      </motion.div>


      
