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

      {/* Projects Dashboard Section 
          - Wraps the main Projects widget (which contains the active collaboration list).
      */}
      <motion.div

        // Animation: Continues the "waterfall" effect
        // Starts 0.05s after the Points/Discussion grid appears
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}

        // Styling:
        // - mb-8: Adds consistent vertical spacing before the next section.
        className="mb-8"
      >

        {/* The complex Projects component (with Chat/Details modals) built earlier and included in components folder */}
        <Projects />
      </motion.div>

      {/* Project Ideas Feed Section 
          - Displays the list of user-submitted pitches.
      */}
      <motion.div

        // Animation: Container enters 0.05s after the Projects section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >

        {/* Section Header */}
        <h2 className="mb-4 text-gray-700 flex items-center gap-2">

          {/* Icon matches the blue theme of the 'Post Idea' button */}
          <Lightbulb className="w-5 h-5 text-blue-600" />
          Project Ideas
        </h2>

        {/* Cards List Container 
            - space-y-4: Adds vertical spacing between each card in the stack.
        */}
        <div className="space-y-4">
          {projectIdeas.map((project, index) => (
            // Staggered Animation Logic:
            // - 0.5: Base start time (wait for container to load).
            // - index * 0.1: Adds 100ms delay per item, creating a "ripple" effect.
            <ProjectIdeaCard key={project.id} project={project} delay={0.5 + index * 0.1} />
          ))}
        </div>
      </motion.div>


      {/* Questions Feed Section 
          - The final block of content in the main view.
      */}
      <motion.div

        // Animation: Enters last (0.7s delay) to complete the cascading load effect.
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >

        {/* Section Header */}
        <h2 className="mb-4 text-gray-700 flex items-center gap-2">

          {/* Icon matches the Purple theme of the "Ask Answer" button */}
          <MessageSquarePlus className="w-5 h-5 text-purple-600" />
          Questions
        </h2>

        {/* Questions Stack 
            - space-y-4: Consistent vertical rhythm with the rest of the app.
        */}
        <div className="space-y-4">
          {questions.map((question, index) => (

            // Staggered Animation:
              // - 0.8: Base start time (wait for container to load).
              // - index * 0.1: Ripple delay per card.
            <QuestionCard key={question.id} question={question} delay={0.8 + index * 0.1} />
          ))}
        </div>
      </motion.div>

      {/* =========================================
          MODAL: Post Project Idea
          Triggered by the Blue "Post Project Idea" button.
          ========================================= */}
      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>

        {/* Modal Content Container 
            - max-w-2xl: Makes the form wider than a standard alert, 
              giving space for the description.
        */}
        <DialogContent className="max-w-2xl">

          {/* Header */}
          <DialogHeader>
            <DialogTitle>Post a Project Idea</DialogTitle>
          </DialogHeader>

          {/* Form Body 
              - space-y-4: Adds vertical spacing between input groups.
              - mt-4: Separates form from the header.
          */}
          <div className="space-y-4 mt-4">

            {/* Input: Title */}
            <div>
              <label className="block mb-2">Project Title</label>
              <Input placeholder="Enter your project idea title..." />
            </div>

            {/* Input: Description 
                - Uses Textarea with rows={6} to encourage detailed pitches.
            */}
            <div>
              <label className="block mb-2">Description</label>
              <Textarea 
                placeholder="Describe your project idea in detail..."
                rows={6}
              />
            </div>

            {/* Input: Skills 
                - Simple text input instructing user to use commas.
                - In a V2, this could be a multi-select dropdown.
            */}
            <div>
              <label className="block mb-2">Required Skills (comma separated)</label>
              <Input placeholder="e.g., React, Node.js, MongoDB" />
            </div>

            {/* Footer / Actions 
                - justify-end: Aligns buttons to the right.
            */}
            <div className="flex gap-3 justify-end">

              {/* Cancel Action */}
              <Button variant="outline" onClick={() => setShowProjectDialog(false)}>
                Cancel
              </Button>

              {/* Submit Action 
                  - Styled Blue to match the "Post Project" theme.
              */}
              <Button className="bg-blue-600 hover:bg-blue-700">
                Post Idea
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* =========================================
          MODAL: Ask a Question
          Triggered by the Purple "Ask Answer" button.
          ========================================= */}
      <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>

        {/* Modal Container */}
        <DialogContent className="max-w-2xl">

          {/* Header */}
          <DialogHeader>
            <DialogTitle>Ask a Question</DialogTitle>
          </DialogHeader>

          {/* Form Body */}
          <div className="space-y-4 mt-4">

            {/* Question Input 
                - Uses Textarea exclusively since questions are usually longer than a single line.
            */}
            <div>
              <label className="block mb-2">Your Question</label>
              <Textarea 
                placeholder="What would you like to know?"
                rows={6}
              />
            </div>

            {/* Footer / Actions */}
            <div className="flex gap-3 justify-end">

              {/* Cancel Action */}
              <Button variant="outline" onClick={() => setShowQuestionDialog(false)}>
                Cancel
              </Button>

              {/* Submit Action 
                  - Styled Purple to match the Q&A theme.
              */}
              <Button className="bg-purple-600 hover:bg-purple-700">
                Post Question
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      {/* =========================================
          MODAL: Create Discussion
          Triggered by the Indigo "Create Discussion" button.
          ========================================= */}
      <Dialog open={showDiscussionDialog} onOpenChange={setShowDiscussionDialog}>

        {/* Modal Container */}
        <DialogContent className="max-w-2xl">

          {/* Header */}
          <DialogHeader>
            <DialogTitle>Create a Discussion</DialogTitle>
          </DialogHeader>

          {/* Form Body */}
          <div className="space-y-4 mt-4">

            {/* Topic Title Input */}
            <div>
              <label className="block mb-2">Discussion Topic</label>
              <Input placeholder="Enter discussion topic..." />
            </div>

            {/* Message Body Input */}
            <div>
              <label className="block mb-2">Initial Message</label>
              <Textarea 
                placeholder="Start the conversation..."
                rows={6}
              />
            </div>

            {/* Footer / Actions */}
            <div className="flex gap-3 justify-end">

              {/* Cancel Action */}
              <Button variant="outline" onClick={() => setShowDiscussionDialog(false)}>
                Cancel
              </Button>

              {/* Submit Action 
                  - Styled Indigo to match the Discussion theme.
              */}
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Create Discussion
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}




      
