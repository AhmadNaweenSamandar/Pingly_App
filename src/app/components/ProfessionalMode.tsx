import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  MessageSquarePlus,
  Lightbulb,
  MessageCircle,
  Plus,
} from "lucide-react";
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
    wishes: 24,
  },
  {
    id: 2,
    user: { name: "Sarah Johnson", avatar: "SJ" },
    idea: "Creating an AI-powered flashcard generator that uses spaced repetition algorithms",
    skills: ["Python", "TensorFlow", "React"],
    wishes: 18,
  },
  {
    id: 3,
    user: { name: "Mike Torres", avatar: "MT" },
    idea: "Developing a peer-to-peer tutoring marketplace for university students",
    skills: ["Vue.js", "Firebase", "Stripe API"],
    wishes: 31,
  },
];

// Mock data for questions
const questions = [
  {
    id: 1,
    user: { name: "Emma Davis", avatar: "ED" },
    question:
      "What's the best approach to implement authentication in a MERN stack application?",
    useful: 15,
    replies: [
      {
        user: "John Doe",
        text: "I'd recommend using JWT tokens with httpOnly cookies for security.",
      },
      {
        user: "Jane Smith",
        text: "Also consider implementing refresh tokens for better UX.",
      },
    ],
  },
  {
    id: 2,
    user: { name: "Ryan Kim", avatar: "RK" },
    question:
      "How do I optimize database queries in a large-scale application?",
    useful: 22,
    replies: [],
  },
  {
    id: 3,
    user: { name: "Lisa Wang", avatar: "LW" },
    question: "Best practices for responsive design in 2024?",
    useful: 8,
    replies: [
      {
        user: "Bob Wilson",
        text: "Use CSS Grid and Flexbox together for maximum flexibility.",
      },
    ],
  },
];

//props interface for the ProfessionalMode component, defining the expected structure of props passed to it.
interface ProfessionalModeProps {
  currentSection:
    | "leaderboard"
    | "discussions"
    | "projects"
    | "ideas"
    | "questions";
}

/**
 * ProfessionalMode Component
 * * The main container for the professional networking side of the application.
 * * Manages the top-level state for global actions (creating projects, asking questions and creating discussions)
 * * and renders the main feed views.
 */
export function ProfessionalMode({ currentSection }: ProfessionalModeProps) {
  // =========================================
  // Modal Visibility State
  // =========================================

  // Controls the "Create New Project" popup form
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  // Controls the "Ask a Question" popup form
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  // Controls the "Post an Idea / Discussion" popup form
  const [showDiscussionDialog, setShowDiscussionDialog] = useState(false);

  const renderSection = () => {
    switch (currentSection) {
      // leaderboar section shows the top students ranked by XP and achievements, using the PointTable component to display the data in a table format.
      case "leaderboard":
        return (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Leaderboard
              </h2>
              <p className="text-gray-600">
                Top students ranked by XP and achievements
              </p>
            </div>
            <PointTable />
          </motion.div>
        );
      //discussions section shows the hot discussions ranked by engagement, using the Discussion component to display the data in a discussion format. It also includes a button to create a new discussion, which opens a dialog form when clicked.
      case "discussions":
        return (
          <motion.div
            key="discussions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Hot Discussions
              </h2>
              <p className="text-gray-600 mb-4">
                Join trending conversations ranked by engagement
              </p>
              <Button
                onClick={() => setShowDiscussionDialog(true)}
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Create Discussion
              </Button>
            </div>
            <Discussion />
          </motion.div>
        );
      //projects section shows the user's active projects, using the Projects component to display the data in a project management format. It also includes a button to create a new project, which opens a dialog form when clicked.
      case "projects":
        return (
          <motion.div
            key="projects"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-6 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Your Projects
              </h2>
              <p className="text-gray-600">
                Manage and collaborate on your active projects
              </p>
            </div>
            <Projects />
          </motion.div>
        );
      //ideas section shows the project ideas feed, using the ProjectIdeaCard component to display each idea in a card format. It also includes a button to post a new project idea, which opens a dialog form when clicked.
      case "ideas":
        return (
          <motion.div
            key="ideas"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Project Ideas
              </h2>
              <p className="text-gray-600 mb-4">
                Discover and share innovative project concepts
              </p>
              <Button
                onClick={() => setShowProjectDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Post Project Idea
              </Button>
            </div>
            <div className="space-y-4">
              {projectIdeas.map((project, index) => (
                <ProjectIdeaCard
                  key={project.id}
                  project={project}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </motion.div>
        );
      //questions section shows the Q&A feed, using the QuestionCard component to display each question in a card format. It also includes a button to ask a new question, which opens a dialog form when clicked.
      case "questions":
        return (
          <motion.div
            key="questions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Questions & Answers
              </h2>
              <p className="text-gray-600 mb-4">
                Get help from the community or share your knowledge
              </p>
              <Button
                onClick={() => setShowQuestionDialog(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <MessageSquarePlus className="w-4 h-4 mr-2" />
                Ask Question
              </Button>
            </div>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
      <AnimatePresence mode="wait">{renderSection()}</AnimatePresence>

      {/* Dialogs */}
      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Post a Project Idea</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block mb-2">Project Title</label>
              <Input placeholder="Enter your project idea title..." />
            </div>
            <div>
              <label className="block mb-2">Description</label>
              <Textarea
                placeholder="Describe your project idea in detail..."
                rows={6}
              />
            </div>
            <div>
              <label className="block mb-2">
                Required Skills (comma separated)
              </label>
              <Input placeholder="e.g., React, Node.js, MongoDB" />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowProjectDialog(false)}
              >
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Post Idea
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ask a Question</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block mb-2">Your Question</label>
              <Textarea placeholder="What would you like to know?" rows={6} />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowQuestionDialog(false)}
              >
                Cancel
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Post Question
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showDiscussionDialog}
        onOpenChange={setShowDiscussionDialog}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create a Discussion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block mb-2">Discussion Topic</label>
              <Input placeholder="Enter discussion topic..." />
            </div>
            <div>
              <label className="block mb-2">Initial Message</label>
              <Textarea placeholder="Start the conversation..." rows={6} />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDiscussionDialog(false)}
              >
                Cancel
              </Button>
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
