import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, Upload, X, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


//this interface help us to identify whether the registration form is complete
interface RegistrationFormProps {
  onComplete: () => void;
}

//constant created for selection while filling the reg form
//these forms will be used in matching algorithm
//user will be recommended based on these constants
const professionalSkills = [
  // Tech
  "JavaScript", "Python", "Java", "C++", "React", "Node.js", 
  "TypeScript", "SQL", "MongoDB", "Docker", "AWS", "Git",
  "Machine Learning", "Data Science", "Mobile Development",
  // Design & Creative
  "UI/UX Design", "Graphic Design", "Video Editing", "Copywriting", "3D Modeling",
  // Business & Management
  "Project Management", "Financial Modeling", "Marketing", "Sales", "Public Speaking", "Data Analysis"
];

// Split the "Looking For" array into two distinct intents
const professionalGoals = [
  "Study Partner", "Project Collaborator", "Startup Co-founder", 
  "Mentor", "Mentee", "Career Networking", "Hackathon Teammate"
];

const socialGoals = [
  "Friendship", "Dating", "Gym Partner", "Coffee Buddy", 
  "Event/Concert Buddy", "Gaming Squad", "Roommate Search"
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


/**
 * RegistrationForm Component
 * * A multi-step wizard to complete the user's profile.
 * * Collects General, Professional, and Social data in sequence.
 */
export function RegistrationForm({ onComplete }: RegistrationFormProps) {

  // =========================================
  // State: Navigation
  // =========================================
  // Tracks which part of the wizard is currently active (1, 2, or 3)
  const [step, setStep] = useState(1);

  // =========================================
  // State: Data Collection
  // =========================================
  // A single object to aggregate data across all wizard steps.
  const [formData, setFormData] = useState({
    // --- STEP 1: The Basics (General Identity) ---
    name: "",
    dob: "",                   // Date of Birth
    university: "",            // e.g., "uOttawa"
    discipline: "",            // e.g., "Software Engineering"
    expectedGraduationYear: "",           // e.g., "2nd Year"

    // MATCHING PREFERENCES (The Missing Link)
    matchWithDisciplines: [] as string[], // e.g., ["Computer Science", "Business", "Any"]
    matchWithYears: [] as string[],       // e.g., ["Same Year", "Upperclassmen", "Any"]


    // --- STEP 2: Professional Profile (Work Mode) ---
    profilePicture: null as File | null,       // Main avatar (Type: File object)
    skills: [] as string[],                    // Array of tech tags (e.g. ["React", "Java"])
    industriesOfInterest: [] as string[],      // e.g., ["Fintech", "EdTech", "Game Dev"]
    professionalGoals: [] as string[],         // e.g., ["Co-founder", "Study Partner"]
    linkedin: "",
    github: "",
    portfolioWebsite: "",                      // Crucial for design/art/business students


    // --- STEP 3: Social Profile (Social Mode) ---
    socialPictures: [] as File[],              // Carousel photos for the dating/social sid
    bio: "",                                   // Short biography
    hobbies: [] as string[],                   // Array of interest tags
    personalityType: "",                       // e.g., "INTJ"
    lookingFor: [] as string[],                 // e.g., ["Study Buddy", "Friendship"]
    socialGoals: [] as string[],                // e.g., ["Friendship", "Dating", "Gym Partner"
    campusInvolvement: [] as string[]         // e.g., ["Intramural Sports", "Student Govt"]
  });




  /**
   * Handles file input changes for both Profile and Social pictures.
   * - Profile: Single image replacement.
   * - Social: Appends images up to a max of 3.
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "profilePicture" | "socialPictures") => {
    const files = e.target.files;
    if (!files) return;

    if (field === "profilePicture") {

      // === SCENARIO 1: Professional Headshot ===
      // Just take the first file selected. Replaces previous selection.
      setFormData({ ...formData, profilePicture: files[0] });
    } else {

      // === SCENARIO 2: Social Gallery (Max 3) ===

      // 1. Convert FileList to Array and limit valid new inputs to 3
      const newFiles = Array.from(files).slice(0, 3);

      // 2. Combine with existing photos
      // 3. Enforce strict limit of 3 photos total
      setFormData({ ...formData, socialPictures: [...formData.socialPictures, ...newFiles].slice(0, 3) });
    }
  };



  /**
   * Toggles the presence of a string item within an array.
   * Used for multi-select fields like Skills, Hobbies, and 'Looking For'.
   * * @param {string[]} array - The current list of selected items.
   * @param {string} item - The specific item to add or remove.
   * @returns {string[]} - A new array with the item added or removed.
   */
  const toggleArrayItem = (array: string[], item: string) => {

    // Check if the item is already selected
    if (array.includes(item)) {

      // REMOVE: Filter out the specific item, keeping all others
      return array.filter(i => i !== item);
    } else {

      // ADD: Return a new array with existing items + the new item
      return [...array, item];
    }
  };

  // --- MATCHING PREFERENCES LOGIC ---

  const handleAddDiscipline = (value: string) => {
    const trimmedVal = value.trim();
    if (trimmedVal && !formData.matchWithDisciplines.includes(trimmedVal)) {
      setFormData({
        ...formData,
        matchWithDisciplines: [...formData.matchWithDisciplines, trimmedVal],
      });
    }
  };

  const handleRemoveDiscipline = (indexToRemove: number) => {
    setFormData({
      ...formData,
      matchWithDisciplines: formData.matchWithDisciplines.filter((_, i) => i !== indexToRemove),
    });
  };

  const handleDisciplineKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddDiscipline(e.currentTarget.value);
      e.currentTarget.value = ''; // Clear input after adding
    }
  };

  const handleDisciplineButtonClick = () => {
    const input = document.getElementById('disciplineInput') as HTMLInputElement;
    handleAddDiscipline(input.value);
    input.value = ''; // Clear input after adding
  };

  const handleToggleYear = (yearOption: string) => {
    const isSelected = formData.matchWithYears.includes(yearOption);

    if (isSelected) {
      // Remove if already selected
      setFormData({
        ...formData,
        matchWithYears: formData.matchWithYears.filter((y) => y !== yearOption),
      });
    } else {
      // Mutual exclusivity logic for "Any"
      if (yearOption === "Any") {
        setFormData({ ...formData, matchWithYears: ["Any"] });
      } else {
        const filteredYears = formData.matchWithYears.filter((y) => y !== "Any");
        setFormData({ ...formData, matchWithYears: [...filteredYears, yearOption] });
      }
    }
  };


  /**
   * Advances the wizard to the next step.
   * * Includes validation logic for Step 1.
   *  Do not strictly require the 2nd and 3rd step to be filled
   */
  const handleNext = () => {
    // === VALIDATION GATE: STEP 1 ===
    if (step === 1) {

      // Ensure all Core Identity fields are present before proceeding
      if (!formData.name || !formData.dob || !formData.university || !formData.discipline || !formData.expectedGraduationYear) {
        alert("Please fill all required fields"); // Simple user feedback if miss any field in first step
        return;  // Stop execution (prevent step increment)
      }
    }

    // Move to next page
    setStep(step + 1);
  };



  /**
   * Returns to the previous step.
   * Does not clear data, so users can edit previous entries.
   */
  const handleBack = () => {
    setStep(step - 1);
  };


  /**
   * Allows bypassing optional steps (Social Profile).
   */
  const handleSkip = () => {
    setStep(step + 1);
  };


  /**
   * Finalizes the registration process.
   * Triggers the transition to the Main Dashboard.
   */
  const handleSubmit = () => {
    onComplete();
  };

  return (

    // === PAGE CONTAINER ===
    // - min-h-screen: Covers full viewport.
    // - bg-gradient...: Maintains app branding (Blue/Purple/Pink).
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* === ANIMATED CARD WRAPPER === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"      // Wider container for the multi-column form
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          

          {/* === PROGRESS STEPPER === 
              - Visualizes how far the user is in the process.
          */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div

                    /* --- STEP NODE (Circle) --- */
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${

                      // Condition: Is this step active or completed?
                      step >= s
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >

                    {/* Content: Checkmark if done, Number if current/pending */}
                    {step > s ? <Check className="w-5 h-5" /> : s}
                  </div>

                  {/* --- CONNECTING LINE --- 
                      - Only render between nodes (not after the last one).
                  */}
                  {s < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-all ${

                        // Condition: Has the user passed this step?
                        step > s ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* --- DYNAMIC HEADER --- 
                - Changes title based on the current step state.
            */}
            <p className="text-center text-gray-600">
              Step {step} of 3: {step === 1 ? "Basic Information" : step === 2 ? "Professional Profile" : "Social Profile"}
            </p>
          </div>




          {/* =========================================
            WIZARD CONTENT AREA
            - Uses AnimatePresence to transition between steps.
            ========================================= */}
          <AnimatePresence mode="wait">
            {/* === STEP 1: Basic Information === */}
            {step === 1 && (
              <motion.div
                key="step1"     // Unique key for Framer Motion
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="text-gray-800 mb-6">Basic Information</h2>


                {/* Field: Full Name */}
                <div>
                  <label className="block mb-2 text-gray-700">Full Name *</label>
                  <Input
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>



                {/* Field: Date of Birth (Native Date Picker) */}
                <div>
                  <label className="block mb-2 text-gray-700">Date of Birth *</label>
                  <Input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    required
                  />
                </div>


                {/* Field: University */}
                <div>
                  <label className="block mb-2 text-gray-700">University *</label>
                  <Input
                    placeholder="Your university name"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    required
                  />
                </div>


                {/* Field: Discipline (Major) */}
                <div>
                  <label className="block mb-2 text-gray-700">Discipline/Major *</label>
                  <Input
                    placeholder="e.g., Computer Science"
                    value={formData.discipline}
                    onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                    required
                  />
                </div>


                {/* Field: Year of Study (Dropdown) */}
                <div>
                  <label className="block mb-2 text-gray-700">Year of Study *</label>
                  <Select
                    value={formData.expectedGraduationYear}
                    onValueChange={(value) => setFormData({ ...formData, expectedGraduationYear: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
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



                {/* === MATCHING PREFERENCES SECTION === */}
                <div className="pt-4 mt-6 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Matching Preferences
                  </h3>

                  {/* Field: Match with Disciplines (Tag Input UI) */}
                  <div className="mb-6">
                    <label className="block mb-2 text-gray-700">Preferred Disciplines/Majors *</label>
                    <p className="text-xs text-gray-500 mb-2">Type a major and press Enter, or type 'Any'</p>
                    
                    {/* Render Selected Pills */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.matchWithDisciplines.map((disc, index) => (
                        <span 
                          key={index} 
                          className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm flex items-center shadow-sm"
                        >
                          {disc}
                          <button
                            type="button"
                            onClick={() => handleRemoveDiscipline(index)}
                            className="ml-2 text-blue-400 hover:text-blue-700 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Input to add new disciplines */}
                    <div className="flex gap-2">
                      <Input
                        id="disciplineInput"
                        placeholder="e.g., Business, Computer Science, Any"
                        onKeyDown={handleDisciplineKeyDown}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleDisciplineButtonClick}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Field: Match with Years (Selectable Pill Toggles) */}
                  <div>
                    <label className="block mb-3 text-gray-700">Preferred Class Years *</label>
                    <div className="flex flex-wrap gap-2">
                      {["Same Year", "Underclassmen", "Upperclassmen", "Graduate", "Any"].map((yearOption) => {
                        const isSelected = formData.matchWithYears.includes(yearOption);
                        return (
                          <button
                            key={yearOption}
                            type="button"
                            onClick={() => handleToggleYear(yearOption)}
                            className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
                              isSelected
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md"
                                : "bg-white text-gray-600 border-gray-300 hover:border-purple-400 hover:text-purple-600"
                            }`}
                          >
                            {yearOption}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                

                {/* Navigation: NEXT Button */}
                <div className="flex justify-end pt-4">
                  <Button onClick={handleNext} className="bg-gradient-to-r from-blue-600 to-purple-600">
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}



            
            {/* === STEP 2: Professional Profile === 
              - Focuses on "Work Mode" attributes (Headshot, Skills, Links).
              */}
            {step === 2 && (
              <motion.div
                key="step2"   // Unique key ensures Framer Motion treats this as a new 'page'
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >

                {/* Header with Optional Tag */}
                <h2 className="text-gray-800 mb-2">How should peers see you professionally?</h2>
                <p className="text-gray-600 mb-6">Optional - You can skip this step</p>


                {/* === INPUT: Profile Picture === 
                  - Handles both Upload State and Preview State.
                  */}
                <div>
                  <label className="block mb-2 text-gray-700">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    {formData.profilePicture ? (

                      // STATE A: Image Selected (Show Preview)
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(formData.profilePicture)}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                        />

                        {/* Delete Button (Appears on Hover/Always visible) */}
                        <button
                          onClick={() => setFormData({ ...formData, profilePicture: null })}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (

                      // STATE B: No Image (Show Upload Box)
                      <label className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <input
                          type="file"
                          accept="image/*"        // Restrict to images only
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "profilePicture")}
                        />
                      </label>
                    )}
                  </div>
                </div>


                {/* === INPUT: Technical Skills === 
                  - Reuses the Tag Cloud pattern.
                  */}
                <div>
                  <label className="block mb-2 text-gray-700">Professional Skills</label>
                  <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
                    {professionalSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => setFormData({ ...formData, skills: toggleArrayItem(formData.skills, skill) })}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          formData.skills.includes(skill)
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:border-blue-400"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>


                {/* === INPUT: Professional Links === */}
                <div>
                  <label className="block mb-2 text-gray-700">LinkedIn Profile</label>
                  <Input
                    placeholder="linkedin.com/in/yourprofile"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">GitHub Profile</label>
                  <Input
                    placeholder="github.com/yourusername"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  />
                </div>


                {/* === NAVIGATION ACTIONS === 
                  - Back: Go to Step 1.
                  - Skip: Go to Step 3 without validating.
                  - Next: Go to Step 3.
              */}
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSkip}>
                      Skip
                    </Button>
                    <Button onClick={handleNext} className="bg-gradient-to-r from-blue-600 to-purple-600">
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}



            
            {/* === STEP 3: Social Profile === 
              - Focuses on "Social Mode" attributes (Gallery, Bio, Interests).
              */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="text-gray-800 mb-2">Who are you outside the class?</h2>
                <p className="text-gray-600 mb-6">Help others get to know the real you</p>


                {/* === INPUT: Social Photo Gallery (Max 3) === */}
                <div>
                  <label className="block mb-2 text-gray-700">Social Pictures (up to 3)</label>
                  <div className="flex gap-4">

                    {/* Render Existing Photos */}
                    {formData.socialPictures.map((file, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={URL.createObjectURL(file)}   // Create temp preview URL
                          alt={`Social ${idx + 1}`}
                          className="w-24 h-24 rounded-lg object-cover border-2 border-pink-200"
                        />

                        {/* Remove Button */}
                        <button
                          onClick={() => {

                            // Filter out the image at this specific index
                            const newPics = formData.socialPictures.filter((_, i) => i !== idx);
                            setFormData({ ...formData, socialPictures: newPics });
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}


                    {/* Add New Photo Button 
                      - Only renders if count is less than 3 
                      */}
                    {formData.socialPictures.length < 3 && (
                      <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-pink-500 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <input
                          type="file"
                          accept="image/*"
                          multiple   // Allows selecting multiple at once
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "socialPictures")}
                        />
                      </label>
                    )}
                  </div>
                </div>


                {/* === INPUT: Biography === */}
                <div>
                  <label className="block mb-2 text-gray-700">Bio</label>
                  <Textarea
                    placeholder="Tell us about yourself..."
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>


                {/* === INPUT: Hobbies (Purple Theme) === */}
                <div>
                  <label className="block mb-2 text-gray-700">Hobbies</label>
                  <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
                    {hobbies.map((hobby) => (
                      <button
                        key={hobby}
                        type="button"
                        onClick={() => setFormData({ ...formData, hobbies: toggleArrayItem(formData.hobbies, hobby) })}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          formData.hobbies.includes(hobby)
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:border-pink-400"
                        }`}
                      >
                        {hobby}
                      </button>
                    ))}
                  </div>
                </div>
                

                {/* === INPUT: Details & Looking For === */}
                <div>
                  <label className="block mb-2 text-gray-700">Personality Type</label>
                  <Select
                    value={formData.personalityType}
                    onValueChange={(value) => setFormData({ ...formData, personalityType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select personality type (MBTI)" />
                    </SelectTrigger>
                    <SelectContent>
                      {personalityTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>


                {/* Looking For (Pink Theme) */}
                <div>
                  <label className="block mb-2 text-gray-700">Looking For</label>
                  <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                    {lookingFor.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setFormData({ ...formData, lookingFor: toggleArrayItem(formData.lookingFor, item) })}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          formData.lookingFor.includes(item)
                            ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:border-pink-400"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>


                {/* === FINAL ACTIONS === */}
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  {/* Submit Button: Triggers onComplete */}
                  <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-600 to-pink-600">
                    Complete Registration
                    <Check className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}


