import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Upload, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Plus, Trash2, Camera } from 'lucide-react'; 


interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// =========================================
// ALIGNED CONSTANTS (Exact match to Registration)
// =========================================
const professionalSkills = [
  "JavaScript", "Python", "Java", "C++", "React", "Node.js", 
  "TypeScript", "SQL", "MongoDB", "Docker", "AWS", "Git",
  "Machine Learning", "Data Science", "Mobile Development",
  "UI/UX Design", "Graphic Design", "Video Editing", "Copywriting", "3D Modeling",
  "Project Management", "Financial Modeling", "Marketing", "Sales", "Public Speaking", "Data Analysis"
];

const availableIndustries = [
  "Fintech", "EdTech", "Game Dev", "HealthTech", 
  "E-commerce", "AI/ML", "SaaS", "Cybersecurity"
];

const professionalGoals = [
  "Study Partner", "Project Collaborator", "Startup Co-founder", 
  "Mentor", "Mentee", "Career Networking", "Hackathon Teammate"
];

const socialGoals = [
  "Friendship", "Dating", "Gym Partner", "Coffee Buddy", 
  "Event/Concert Buddy", "Gaming Squad", "Roommate Search"
];

const campusInvolvements = [
  "Intramural Sports", "Student Govt", "Greek Life", 
  "Academic Clubs", "Volunteer Work", "Theater/Arts"
];

const hobbies = [
  "Reading", "PC Gaming", "Console Gaming", "Intramural Sports", "Weightlifting", 
  "Music Production", "Live Gigs", "Cooking", "Baking", "Photography", 
  "Traveling", "Hiking", "Dancing", "Writing", "Thrifting", "Board Games", 
  "Volunteering", "Film/Cinema", "Anime"
];

const personalityTypes = [
  "INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"
];

const lookingFor = [
  "Study Partner", "Project Collaborator", "Mentor", "Friend",
  "Coffee Buddy", "Gym Partner", "Dating", "Networking"
];


export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {

  // =========================================
  // State: Form Data (1:1 Match with Registration)
  // =========================================
  const [profileData, setProfileData] = useState({
    // --- General Identity ---
    name: "",
    dob: "",
    university: "",
    discipline: "",
    expectedGraduationYear: "",
    
    // --- Matching Preferences ---
    matchWithDisciplines: [] as string[],
    matchWithYears: [] as string[],

    // --- Professional Profile ---
    // Note: We will handle fetching actual image URLs later. 
    profilePicture: null as File | null | string, 
    skills: [] as string[],
    industriesOfInterest: [] as string[],
    professionalGoals: [] as string[],
    linkedin: "",
    github: "",
    portfolioWebsite: "",

    // --- Social Profile ---
    socialPictures: [] as (File | string)[], 
    bio: "",
    hobbies: [] as string[],
    personalityType: "",
    lookingFor: [] as string[],
    socialGoals: [] as string[],
    campusInvolvement: [] as string[]
  });

  const [isLoading, setIsLoading] = useState(false);

  // New error state for date validation
  const [dobError, setDobError] = useState("");

  // --- IMAGE PREVIEW STATES ---
  // These hold temporary URLs so the user can see what they just uploaded/deleted
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    typeof profileData?.profilePicture === 'string' ? profileData.profilePicture : null
  );
  const [socialPicPreviews, setSocialPicPreviews] = useState<(string | null)[]>([
    typeof profileData?.socialPictures?.[0] === 'string' ? profileData.socialPictures[0] : null,
    typeof profileData?.socialPictures?.[1] === 'string' ? profileData.socialPictures[1] : null,
    typeof profileData?.socialPictures?.[2] === 'string' ? profileData.socialPictures[2] : null,
  ]);

  // Track explicit picture deletions in frontend state so we can inform the backend which images to remove from the database and filesystem
  const [deleteProfilePic, setDeleteProfilePic] = useState(false);
  const [deletedSocialPicIndices, setDeletedSocialPicIndices] = useState<number[]>([]);

  // --- RAW FILE STATES (For uploading to backend) ---
  const [newProfilePicFile, setNewProfilePicFile] = useState<File | null>(null);
  const [newSocialPicFiles, setNewSocialPicFiles] = useState<(File | null)[]>([null, null, null]);

  // / --- IMAGE HANDLERS ---

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]; 
      if (file) {
        setNewProfilePicFile(file); // <-- SAVE THE RAW FILE
        setProfilePicPreview(URL.createObjectURL(file));
        setDeleteProfilePic(false); // If they upload a new one, cancel any previous deletion
      }
    };

  const handleSocialPicChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // <-- SAVE THE RAW FILE into the array
      const updatedFiles = [...newSocialPicFiles];
      updatedFiles[index] = file;
      setNewSocialPicFiles(updatedFiles);
      
      const newPreviews = [...socialPicPreviews];
      newPreviews[index] = URL.createObjectURL(file);
      setSocialPicPreviews(newPreviews);

      // If they are replacing a deleted image, remove it from the graveyard
      setDeletedSocialPicIndices(prev => prev.filter(i => i !== index));
    }
  };

  const removeProfilePic = () => {
    setProfilePicPreview(null);
    setNewProfilePicFile(null); // <-- Clear the raw file if it exists
    setDeleteProfilePic(true); 
  };

  const removeSocialPic = (index: number) => {
    const newPreviews = [...socialPicPreviews];
    newPreviews[index] = null;
    setSocialPicPreviews(newPreviews);

    // <-- Clear the raw file from the array if it exists
    const updatedFiles = [...newSocialPicFiles];
    updatedFiles[index] = null;
    setNewSocialPicFiles(updatedFiles);

    if (!deletedSocialPicIndices.includes(index)) {
      setDeletedSocialPicIndices([...deletedSocialPicIndices, index]);
    }
  };

  const handleProfileDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 1. Update the profileData state
    setProfileData((prevData) => ({
      ...prevData,
      dob: value,
    }));

    // 2. Run instant 18+ validation
    if (!value) {
      setDobError(""); // Clear error if they delete the date
      return;
    }

    const birthDate = new Date(value);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Set the error instantly
    if (age < 18) {
      setDobError("You must be at least 18 years old to use Pingly.");
    } else {
      setDobError(""); 
    }
  };


  // =========================================
  // Effect: Fetch Data on Mount/Open
  // =========================================
  useEffect(() => {
    // If the modal is closed, don't bother fetching
    if (!isOpen) return;

    const fetchProfileData = async () => {
      setIsLoading(true);
      
      // 1. Grab the VIP pass
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.error("No token found");
        setIsLoading(false);
        return;
      }

      // to this backend url the uploads will be added at the end to get the image from the backend server
      const BACKEND_URL = 'http://localhost:3000';

      try {
        // 2. Call the NestJS GET route
        const response = await fetch('http://localhost:3000/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        // 3. Parse the database response
        const dbUser = await response.json();

        // Set the preview states using the exact paths from the database
        setProfilePicPreview(dbUser.profilePicture ? `${BACKEND_URL}/${dbUser.profilePicture}` : null);
        
        setSocialPicPreviews([
          dbUser.socialPictures?.[0] ? `${BACKEND_URL}/${dbUser.socialPictures[0]}` : null,
          dbUser.socialPictures?.[1] ? `${BACKEND_URL}/${dbUser.socialPictures[1]}` : null,
          dbUser.socialPictures?.[2] ? `${BACKEND_URL}/${dbUser.socialPictures[2]}` : null,
        ]);
        
        // 4. Update the local state with the database info
        // We use the spread operator (...) to fall back to our default empty arrays 
        // just in case the database returns null for fields the user skipped.
        setProfileData(prevData => ({
          ...prevData,
          name: dbUser.name || "",
          dob: dbUser.dob ? dbUser.dob.split('T')[0] : "", // Convert ISO to "YYYY-MM-DD" for input
          university: dbUser.university || "",
          discipline: dbUser.discipline || "",
          expectedGraduationYear: dbUser.expectedGraduationYear || "",
          
          matchWithDisciplines: dbUser.matchWithDisciplines || [],
          matchWithYears: dbUser.matchWithYears || [],
          
          skills: dbUser.skills || [],
          industriesOfInterest: dbUser.industriesOfInterest || [],
          professionalGoals: dbUser.professionalGoals || [],
          linkedin: dbUser.linkedin || "",
          github: dbUser.github || "",
          portfolioWebsite: dbUser.portfolioWebsite || "",
          
          bio: dbUser.bio || "",
          hobbies: dbUser.hobbies || [],
          personalityType: dbUser.personalityType || "",
          lookingFor: dbUser.lookingFor || [],
          socialGoals: dbUser.socialGoals || [],
          campusInvolvement: dbUser.campusInvolvement || []
          
          // Note: profilePicture and socialPictures are omitted here for now 
          // because handling image URLs vs File objects requires a bit of special logic we'll do later.
        }));

      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [isOpen]); // Re-run this effect whenever the modal opens


  // =========================================
  // Helper: Multi-Select Logic
  // =========================================
  /**
   * Toggles an item inside an array state.
   * Used for Skills, Hobbies, 'Looking For' tags, etc.
   */
  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      // Remove item if it exists
      return array.filter((i) => i !== item);
    } else {
      // Add item if it doesn't exist
      return [...array, item];
    }
  };

  // =========================================
  // API Integration: Save Changes
  // =========================================
  /**
   * Finalizes the profile edits by sending data to NestJS.
   * Closes the modal on success.
   */
  const handleSave = async () => {
    // 1. Retrieve the JWT from localStorage
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error("Authentication error: No token found.");
      alert("Session expired. Please log in again.");
      return;
    }
    

    // 2. Separate File objects from standard JSON data
    // Just like the registration form, we exclude file objects until Multer is set up.
    const { profilePicture, socialPictures, ...jsonPayload } = profileData;

    try {
      // 3. Construct and await the fetch request (PATCH to update)
      const response = await fetch('http://localhost:3000/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(jsonPayload) 
      });

      // 4. Handle Backend Errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      // 5. Success Flow
      const updatedUser = await response.json();
      console.log("Success! Profile updated from Modal:", updatedUser);
      
      // Close the modal once the backend confirms the save
      onClose();

    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to save your profile. Check the console for details.");
    }
  };


  return (
    <AnimatePresence>
      {/* Wrap the whole modal in the isOpen check, solve the edit profile not closing bug */}
      {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        
        {/* === LAYER 1: Backdrop Overlay === */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* === LAYER 2: Modal Content Container === */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 rounded-2xl">
              <div className="text-lg font-semibold text-blue-600 animate-pulse">Loading Profile...</div>
            </div>
          )}

          <div className="p-8">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Edit Profile</h2>

            <div className="space-y-12">
              
              {/* ==========================================
                  SECTION 1: Basic Information
                  ========================================== */}
              <section>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Date of Birth</label>
                    <Input
                      type="date"
                      value={profileData.dob}
                      onChange={handleProfileDobChange}
                      className={dobError ? 'border-red-500' : 'border-gray-300'}
                    />
                    
                    {dobError && <p className="text-red-500 text-sm mt-1">{dobError}</p>}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">University</label>
                    <Input
                      value={profileData.university}
                      onChange={(e) => setProfileData({ ...profileData, university: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Discipline/Major</label>
                    <Input
                      value={profileData.discipline}
                      onChange={(e) => setProfileData({ ...profileData, discipline: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Expected Graduation Year</label>
                    <Select
                      value={profileData.expectedGraduationYear}
                      onValueChange={(value) => setProfileData({ ...profileData, expectedGraduationYear: value })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">2027</SelectItem>
                        <SelectItem value="2">2028</SelectItem>
                        <SelectItem value="3">2029</SelectItem>
                        <SelectItem value="4">2030</SelectItem>
                        <SelectItem value="5+">2031</SelectItem>
                        <SelectItem value="graduate">Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              {/* ==========================================
                  SECTION 2: Professional Profile Picture
                  ========================================== */}
              <section>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-purple-100 text-purple-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                  Professional Headshot
                </h3>
                
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    {profilePicPreview ? (
                      // HAS PICTURE: Show image and delete button
                      <div className="relative w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden">
                        <img 
                          src={typeof profilePicPreview === 'string' ? profilePicPreview : ''} 
                          alt="Professional Headshot" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button"
                            onClick={removeProfilePic}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      // EMPTY STATE: Dashed border with gradient icon
                      <label className="flex flex-col items-center justify-center w-40 h-40 rounded-full border-2 border-dashed border-purple-600 bg-purple-100 cursor-pointer hover:bg-blue-100 hover:border-purple-600 transition-all duration-300">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mb-2">
                          <Camera className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-blue-800">Add Photo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleProfilePicChange} 
                          className="hidden" 
                        />
                      </label>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    <p className="font-medium text-gray-700">Make a great first impression.</p>
                    <p>Upload a clear, well-lit headshot for your academic and professional connections.</p>
                  </div>
                </div>
              </section>

              {/* ==========================================
                  SECTION 3: Social Mode Pictures
                  ========================================== */}
              <section>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-pink-100 text-pink-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                  Social Gallery (Max 3)
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="relative aspect-[3/4] group">
                      {socialPicPreviews[index] ? (
                        // HAS PICTURE
                        <div className="w-full h-full rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
                          <img 
                            src={socialPicPreviews[index]} 
                            alt={`Social picture ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              type="button"
                              onClick={() => removeSocialPic(index)}
                              className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                            >
                              <Trash2 className="w-6 h-6" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        // EMPTY STATE: Pink dashed border
                        <label className="flex flex-col items-center justify-center w-full h-full rounded-2xl border-2 border-dashed border-pink-300 bg-pink-50 cursor-pointer hover:bg-pink-100 transition-colors duration-300">
                          <div className="w-12 h-12 rounded-full bg-pink-200 flex items-center justify-center mb-3">
                            <Plus className="w-6 h-6 text-pink-600" />
                          </div>
                          <span className="text-sm font-medium text-pink-600">Add Social Photo</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleSocialPicChange(index, e)} 
                            className="hidden" 
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* ==========================================
                  SECTION 4: Professional Profile
                  ========================================== */}
              <section>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-purple-100 text-purple-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">4</span>
                  Professional Profile
                </h3>
                <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                  
                  {/* Links Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">LinkedIn</label>
                      <Input value={profileData.linkedin} onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })} />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">GitHub</label>
                      <Input value={profileData.github} onChange={(e) => setProfileData({ ...profileData, github: e.target.value })} />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Portfolio</label>
                      <Input value={profileData.portfolioWebsite} onChange={(e) => setProfileData({ ...profileData, portfolioWebsite: e.target.value })} />
                    </div>
                  </div>

                  {/* Skills Array */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Technical Skills</label>
                    <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                      {professionalSkills.map((skill) => (
                        <button
                          key={skill} type="button"
                          onClick={() => setProfileData({ ...profileData, skills: toggleArrayItem(profileData.skills, skill) })}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            profileData.skills.includes(skill) ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:border-blue-400 border border-transparent"
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Industries Array */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Industries of Interest</label>
                    <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                      {availableIndustries.map((industry) => (
                        <button
                          key={industry} type="button"
                          onClick={() => setProfileData({ ...profileData, industriesOfInterest: toggleArrayItem(profileData.industriesOfInterest, industry) })}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            profileData.industriesOfInterest.includes(industry) ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:border-blue-400 border border-transparent"
                          }`}
                        >
                          {industry}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Professional Goals Array */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Professional Goals</label>
                    <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                      {professionalGoals.map((goal) => (
                        <button
                          key={goal} type="button"
                          onClick={() => setProfileData({ ...profileData, professionalGoals: toggleArrayItem(profileData.professionalGoals, goal) })}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            profileData.professionalGoals.includes(goal) ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:border-blue-400 border border-transparent"
                          }`}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ==========================================
                  SECTION 3: Social Profile
                  ========================================== */}
              <section>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-pink-100 text-pink-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">5</span>
                  Social Profile
                </h3>
                <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                  
                  {/* Bio & Personality */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-700">Bio</label>
                      <Textarea
                        rows={4}
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Personality Type</label>
                      <Select
                        value={profileData.personalityType}
                        onValueChange={(value) => setProfileData({ ...profileData, personalityType: value })}
                      >
                        <SelectTrigger className="bg-white"><SelectValue placeholder="Select MBTI" /></SelectTrigger>
                        <SelectContent>
                          {personalityTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Hobbies Array */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Hobbies</label>
                    <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                      {hobbies.map((hobby) => (
                        <button
                          key={hobby} type="button"
                          onClick={() => setProfileData({ ...profileData, hobbies: toggleArrayItem(profileData.hobbies, hobby) })}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            profileData.hobbies.includes(hobby) ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "bg-gray-100 text-gray-700 hover:border-pink-400 border border-transparent"
                          }`}
                        >
                          {hobby}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Campus Involvement Array */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Campus Involvement</label>
                    <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                      {campusInvolvements.map((activity) => (
                        <button
                          key={activity} type="button"
                          onClick={() => setProfileData({ ...profileData, campusInvolvement: toggleArrayItem(profileData.campusInvolvement, activity) })}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            profileData.campusInvolvement.includes(activity) ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:border-purple-400 border border-transparent"
                          }`}
                        >
                          {activity}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Looking For & Social Goals Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Looking For</label>
                      <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg border border-gray-200">
                        {lookingFor.map((item) => (
                          <button
                            key={item} type="button"
                            onClick={() => setProfileData({ ...profileData, lookingFor: toggleArrayItem(profileData.lookingFor, item) })}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                              profileData.lookingFor.includes(item) ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white" : "bg-gray-100 text-gray-700 hover:border-pink-400 border border-transparent"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Social Goals</label>
                      <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg border border-gray-200">
                        {socialGoals.map((goal) => (
                          <button
                            key={goal} type="button"
                            onClick={() => setProfileData({ ...profileData, socialGoals: toggleArrayItem(profileData.socialGoals, goal) })}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                              profileData.socialGoals.includes(goal) ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:border-rose-400 border border-transparent"
                            }`}
                          >
                            {goal}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </section>

              {/* ==========================================
                  FORM ACTIONS
                  ========================================== */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 sticky bottom-0 bg-white pb-2">
                <Button variant="outline" onClick={onClose} className="px-6">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 shadow-lg shadow-blue-200">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
