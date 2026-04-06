import { useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  MessageSquarePlus,
  Lightbulb,
  MessageCircle,
  Plus,
  ImagePlus,
  X
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

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { ScrollArea } from "./ui/scroll-area";


// (Keep our existing quillModules definition here)
const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ 'list': 'bullet' }, { 'list': 'ordered' }],
    ['link'],
    ['clean'] 
  ],
};

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

// 2. THE MISSING DATA: mock data for discussions!
const initialDiscussionsData = [
  {
    id: 1,
    title: "Best frameworks for full-stack development in 2024",
    author: "Alex Rivera",
    authorProfilePicture: "https://i.pravatar.cc/150?u=alex",
    replyCount: 47,
    hasImage: true, 
    imageUrl: "https://i.pravatar.cc/150?u=jamie",
    content: "<p>What are your thoughts on the best frameworks for full-stack development this year?</p>",
    messages: [
      { 
        id: 101, 
        user: "Jamie Lee", 
        profilePicture: "https://i.pravatar.cc/150?u=jamie", 
        text: "<p>I've been loving Next.js with Supabase for the backend. The DX is <em>amazing</em>!</p>", 
        time: "1 hour ago",
        children: [
          {
            id: 201, user: "Taylor Smith", profilePicture: null, text: "<p>Agreed! The new app router makes data fetching so much cleaner.</p>", time: "30 min ago", parentId: 101
          }
        ]
      }
    ]
  }
];

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

  // 1. The Global Feed State (Lifted up from Discussion.tsx)
  const [discussionsData, setDiscussionsData] = useState(initialDiscussionsData); // Use our mock array

  // Controls the "Create New Project" popup form
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  // Controls the "Ask a Question" popup form
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  // Controls the "Post an Idea / Discussion" popup form
  const [showDiscussionDialog, setShowDiscussionDialog] = useState(false);

  // 3. The Form State
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Image Handlers ---
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    
    if (selectedImages.length + newFiles.length > 3) {
      alert("You can only attach a maximum of 3 images per post.");
      return;
    }
    const updatedFiles = [...selectedImages, ...newFiles];
    setSelectedImages(updatedFiles);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (indexToRemove: number) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    setSelectedImages(prev => prev.filter((_, i) => i !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  // --- Submission Handler ---
  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.replace(/(<([^>]+)>)/gi, "").trim()) {
      alert("Please provide both a title and content.");
      return;
    }

    const newDiscussion = {
      id: Date.now(),
      title: newPostTitle,
      author: "Current User",
      authorProfilePicture: "https://i.pravatar.cc/150?u=current",
      replyCount: 0,
      hasImage: selectedImages.length > 0,
      imageUrl: null,
      content: newPostContent,
      messages: []
    };

    // Add to the feed state!
    setDiscussionsData([newDiscussion, ...discussionsData]);
    
    // Reset and Close
    setNewPostTitle("");
    setNewPostContent("");
    setSelectedImages([]);
    setImagePreviews([]);
    setShowDiscussionDialog(false);
  };

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
          {/* [UX WIN]: Mobile-Responsive Header 
              'flex-col' stacks them on phones. 
              'sm:flex-row' puts them side-by-side on tablets/desktops. 
              'gap-4' adds perfect spacing between them when stacked. */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Hot Discussions</h2>
              <p className="text-gray-600">Join trending conversations ranked by engagement</p>
            </div>
            
            {/* 'w-full sm:w-auto' makes the button full-width on phones for an easy tap target, 
                and shrinks it to its normal size on desktop. */}
            <Button
              onClick={() => setShowDiscussionDialog(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all h-10 px-4 rounded-xl w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Create Discussion
            </Button>
          </div>

          {/* WE PASS THE DATA DOWN TO THE CHILD */}
          <Discussion feedData={discussionsData} />
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

{/* THE UPGRADED DIALOG MODAL */}
      <Dialog open={showDiscussionDialog} onOpenChange={setShowDiscussionDialog}>
        {/* [UX WIN]: w-[calc(100%-2rem)] physically forces the modal to be 100% of the screen width MINUS 1rem on each side. 
            'sm:max-w-2xl' ensures it doesn't get too wide on giant desktop monitors. */}
        <DialogContent className="w-[calc(100%-2rem)] bg-white sm:w-full sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-2xl">
          <DialogHeader className="p-6 pb-4 border-b border-gray-100 flex-shrink-0">
            <DialogTitle className="text-xl font-bold">Create a Discussion</DialogTitle>
          </DialogHeader>
          
          {/* Using ScrollArea so the modal doesn't break the screen height on small laptops */}
          <ScrollArea className="flex-1 p-6 min-h-0">
            <div className="space-y-5 ">
              
              {/* Advanced Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discussion Topic</label>
                <input 
                  type="text" 
                  placeholder="What do you want to discuss?"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow text-gray-800 font-medium placeholder:font-normal"
                />
              </div>

              {/* Advanced WYSIWYG Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Message</label>
                <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-shadow">
                  <ReactQuill 
                    theme="snow" 
                    value={newPostContent} 
                    onChange={setNewPostContent} 
                    modules={quillModules} 
                    placeholder="Share your thoughts, ask questions, or provide context..." 
                  />
                </div>
              </div>

              {/* Advanced Image Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (Max 3)</label>
                
                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-3">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                        <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                        <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-black/60 opacity-0 group-hover:opacity-100 hover:bg-red-500 text-white rounded-full p-1 transition-all">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input type="file" ref={fileInputRef} onChange={handleImageSelect} multiple accept="image/*" className="hidden" />
                
                {selectedImages.length < 3 && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors font-medium text-sm"
                  >
                    <ImagePlus className="w-4 h-4" /> Add Images
                  </button>
                )}
              </div>

            </div>
          </ScrollArea>

          <div className="p-6 pt-4 border-t border-gray-100 flex gap-3 justify-end flex-shrink-0 bg-gray-50">
            <Button variant="outline" onClick={() => setShowDiscussionDialog(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleCreatePost} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md">
              Create Discussion
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
