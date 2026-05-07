import React, { useState, useRef, useEffect } from "react";
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
import { projectIdeasApi } from "./API Calls/services/projectIdeas.api";
import { ProjectIdeasTab } from "./ProjectIdeasTab";
import { useMutation, useQueryClient } from '@tanstack/react-query';


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

// skills list for the project idea form (can be used for a dropdown)
const professionalSkills = [
  "JavaScript", "Python", "Java", "C++", "React", "Node.js", 
  "TypeScript", "SQL", "MongoDB", "Docker", "AWS", "Git",
  "Machine Learning", "Data Science", "Mobile Development",
  "UI/UX Design", "Graphic Design", "Video Editing", "Copywriting", "3D Modeling",
  "Project Management", "Financial Modeling", "Marketing", "Sales", "Public Speaking", "Data Analysis"
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

  // 1. The Global Feed State
  // Change from: const [discussionsData, setDiscussionsData] = useState(initialDiscussionsData);
  const [discussionsData, setDiscussionsData] = useState<any[]>([]);
  

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

  

  



// ------------------------------------
// POST PROJECT IDEA LOGIC - start
// ------------------------------------

  // 0. state variable to hold the filter value for latest or forYou
  const [activeTab, setActiveTab] = React.useState<"latest" | "forYou">("latest");


  // 1. Post project idea states: Maintainability: Local state to track the array of selected skills from professinalSkills for the project idea form. 
  // This will allow us to easily send the selected skills to the backend when posting a new project idea.
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // 2. POST request states for implementing the POST request to the backend when creating a new project idea. 
  // isSubmitting can be used to disable the form and show a loading state while the request is in progress, improving the user experience and preventing duplicate submissions.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // 3. state variable to track the max members needed for the project idea, which is a new field we added to the form. This will allow us to send this information to the backend and display it in the project idea feed.
  const [maxMembers, setMaxMembers] = useState(5); // Default to 5 members needed

  // 3. Add skill handler
  const handleAddSkill = (skill: string) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // 4. Remove skill handler
  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

// --------------------------------------------------------------------------
// useMutation
// useMutation from React Query to fetch the posted idea instantly to feed
// --------------------------------------------------------------------------

  // 1. Initialize the query client to access the cache
  const queryClient = useQueryClient();

  // 2. Set up the React Query Mutation
  const createIdeaMutation = useMutation({
    mutationFn: projectIdeasApi.createIdea,
    onSuccess: (newProjectData) => {
      // 1. Reset our form states
      setTitle('');
      setDescription('');
      setSelectedSkills([]);
      setShowProjectDialog(false);

      // 2. The Magic: Inject the new idea directly into the 'latest' feed cache
      queryClient.setQueryData(['projectIdeas', 'latest'], (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData;

        // We map over the pages of the infinite query cache
        return {
          ...oldData,
          pages: oldData.pages.map((page: any, index: number) => {
            // We only want to inject the new idea into the very first page
            if (index === 0) {
              return {
                ...page,
                // Prepend the new project to the front of the data array
                // Note: our backend POST response returns the fully constructed project object
                data: [newProjectData.data, ...page.data], 
              };
            }
            return page;
          }),
        };
      });

      // Optional but recommended: Also invalidate the query in the background 
      // just to ensure everything stays perfectly synced with the database
      queryClient.invalidateQueries({ queryKey: ['projectIdeas', 'latest'] });
    },
    onError: (error) => {
      console.error("Failed to post idea:", error);
      alert("Something went wrong. Please try again.");
    }
  });

  // The submit handler
  const handlePostIdea = async () => {
    if (!title || !description || selectedSkills.length === 0) {
      alert("Please fill out all fields and select at least one skill.");
      return;
    }

    // Trigger the mutation. 
    // React Query handles the loading state (createIdeaMutation.isPending) automatically.
    createIdeaMutation.mutate({
      title,
      description,
      skills: selectedSkills,
    });
  };




// ------------------------------------
// POST PROJECT IDEA LOGIC - end
// ------------------------------------



// ------------------------------------
// DISCUSSION FETCH LOGIC - start
// ------------------------------------

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

  // --- Submission Handler (Wired to Backend) ---
  const handleCreatePost = async () => {
    // 1. Validation
    if (!newPostTitle.trim() || !newPostContent.replace(/(<([^>]+)>)/gi, "").trim()) {
      alert("Please provide both a title and content.");
      return;
    }

    try {
      // 2. Pack the data into FormData (Required for sending files)
      const formData = new FormData();
      formData.append("title", newPostTitle);
      formData.append("content", newPostContent);
      
      // Append each image file to the "images" key so NestJS FilesInterceptor catches them
      selectedImages.forEach((file) => {
        formData.append("images", file);
      });

      // 3. Get the JWT Token from localStorage with the name as access_token (This is the token we stored when the user logged in)
      const token = localStorage.getItem("access_token"); 

      // 4. Send to NestJS Backend
      const response = await fetch("http://localhost:3000/discussions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          // [Important]: Do NOT manually set 'Content-Type': 'multipart/form-data' here!
          // When we pass a FormData object to fetch(), the browser automatically sets the 
          // correct multipart header along with a crucial, randomly generated 'boundary' string.
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create discussion");
      }

      // 5. Parse the returned database record
      const savedDiscussion = await response.json();

      // Helper function to safely format the URLs 
      const BACKEND_URL = "http://localhost:3000";
      const formatImageUrl = (path: string | null) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        return path.startsWith("/") ? `${BACKEND_URL}${path}` : `${BACKEND_URL}/${path}`;
      };

      // 6. Map the backend Prisma object to our Frontend UI State shape
      const newFrontendDiscussion = {
        id: savedDiscussion.id,
        title: savedDiscussion.title,
        // Map the author relation returned by Prisma
        author: savedDiscussion.author.name || "Unknown User", 
        authorProfilePicture: savedDiscussion.author.profilePicture,
        replyCount: 0, 
        // Check if the backend returned any uploaded image URLs
        hasImage: savedDiscussion.images && savedDiscussion.images.length > 0,
        // --- connected the image array itself  ---
        // Instead of imageUrl grabbing [0], we map the whole array with our formatter
        images: savedDiscussion.images && savedDiscussion.images.length > 0
          ? savedDiscussion.images.map((img: string) => formatImageUrl(img))
          : [],
        content: savedDiscussion.content,
        messages: [], // Empty initially
      };

      // 7. Optimistic UI Update: Push it to the top of the feed instantly
      setDiscussionsData([newFrontendDiscussion, ...discussionsData]);
      
      // 8. Clean up and close modal
      setNewPostTitle("");
      setNewPostContent("");
      setSelectedImages([]);
      setImagePreviews([]);
      setShowDiscussionDialog(false);

    } catch (error) {
      console.error("Error creating post:", error);
      alert("There was an error creating your discussion. Please try again.");
    }
  };

  // =========================================
  // Data Fetching with Get (Read) - Fetch the discussions feed from the backend when the component loads
  // It does not load the pictures or replies for each discussion yet, just the main feed data. We will fetch messages only when the user clicks a specific discussion.
  // =========================================
  useEffect(() => {

    // 1. Define the URL and our formatter helper right at the top
    const BACKEND_URL = "http://localhost:3000";
    
    const formatImageUrl = (path: string | null) => {
      if (!path) return null;
      
      // If it's already a full web URL, return it as-is
      if (path.startsWith("http")) return path;

      // If the path already starts with a slash, just append it
      // If it doesn't, add the slash manually in the middle
      return path.startsWith("/") 
        ? `${BACKEND_URL}${path}` 
        : `${BACKEND_URL}/${path}`;
    };


    const fetchFeed = async () => {
      try {
        // 1. Grab the JWT token
        const token = localStorage.getItem("access_token"); // This is the token we stored when the user logged in

        // 2. Fetch from the backend (defaults to 'trending' sort based on our controller)
        const response = await fetch("http://localhost:3000/discussions", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch discussions feed");
        }

        const dbDiscussions = await response.json();

        // 3. Map the backend Prisma objects to our Frontend UI State shape
        const formattedFeed = dbDiscussions.map((doc: any) => ({
          id: doc.id,
          title: doc.title,
          author: doc.author.name || "Unknown User",

          // [FIX APPLIED HERE]: Wrapping the profile picture
          authorProfilePicture: formatImageUrl(doc.author.profilePicture),

          replyCount: doc.replyCount,
          hasImage: doc.images && doc.images.length > 0,

          // [FIX APPLIED HERE]: Wrapping the discussion attachment
          imageUrl: doc.images?.[0] ? formatImageUrl(doc.images[0]) : null,

          content: doc.content,
          // We leave messages empty here because the feed view doesn't need to load 
          // 10,000 comments just to display the list! 
          // We will fetch messages only when the user clicks a specific discussion.
          messages: [] 
        }));

        // 4. Update the state to render the real data
        setDiscussionsData(formattedFeed);

      } catch (error) {
        console.error("Error loading feed:", error);
        // Optional: set some error state here to show a UI alert
      }
    };
// ------------------------------------
// DISCUSSION FETCH LOGIC - end\
// ------------------------------------





    fetchFeed();
  }, []); // Empty dependency array means this runs ONCE when the component loads

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


      // the actual project idea tab is implemented in its own component (ProjectIdeasTab) because it has a lot of complex logic related to fetching and posting project ideas, 
      // as well as the tab toggle between "Latest" and "For You". This keeps our ProfessionalMode component cleaner and more focused on just routing between sections, 
      // while the ProjectIdeasTab can handle all the specific logic for that feed.
      case "ideas":
        return <ProjectIdeasTab setShowProjectDialog={setShowProjectDialog} />;

        
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
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Post a Project Idea</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block mb-2">Project Title</label>
              <Input 
                placeholder="Enter your project idea title..."
                value={title} //Bind to state
                onChange={(e) => setTitle(e.target.value)} /> {/* Update state on typing */}
            </div>
            <div>
              <label className="block mb-2">Description</label>
              <Textarea
                placeholder="Describe your project idea in detail..."
                rows={6}
                value={description} //Bind to state
                onChange={(e) => setDescription(e.target.value)} //Update state on typing
              />
            </div>

            {/* --- NEW: Max Members Section --- */}
            <div>
              <label htmlFor="maxMembers" className="block mb-2 text-sm font-medium">Max Members Needed</label>
              <select
                id="maxMembers"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={maxMembers}
                onChange={(e) => setMaxMembers(Number(e.target.value))}
              >
                <option value="" disabled>Select maximum team size...</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Member' : 'Members'}
                  </option>
                ))}
              </select>
            </div>
            {/* --- End of Max Members Section --- */}

            {/* New updates to skills input: drop down menu to select the skills */}

            <div>
              <label className="block mb-2 text-sm font-medium">Required Skills</label>
              
              {/* Display selected skills as removable badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedSkills.length === 0 && (
                  <span className="text-sm text-gray-500 italic">No skills selected yet.</span>
                )}
                {selectedSkills.map(skill => (
                  <span 
                    key={skill} 
                    className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 border border-blue-200"
                  >
                    {skill}
                    <button 
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-600 transition-colors focus:outline-none"
                      aria-label={`Remove ${skill}`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Dropdown to add new skill */}
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onChange={(e) => {
                  handleAddSkill(e.target.value);
                  e.target.value = ""; // Reset the select dropdown back to default after choosing
                }}
                defaultValue=""
              >
                <option value="" disabled>Select a skill to add...</option>
                {professionalSkills
                  .filter(skill => !selectedSkills.includes(skill)) // Efficiency: Hide skills they already selected
                  .sort() // Maintainability: Alphabetical sorting makes it easier for users to scan
                  .map(skill => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))
                }
              </select>
            </div>
            {/* --- End of new updates --- */}

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => { setShowProjectDialog(false);
                  setSelectedSkills([]); // Clear selected skills when closing the modal
                }}
              >
                Cancel
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                onClick={handlePostIdea}
                disabled={createIdeaMutation.isPending || selectedSkills.length === 0} // Optional: Prevent submission without skills
              >
                {createIdeaMutation.isPending ? "Posting..." : "Post Idea"}
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
