import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Upload, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


//variable added to find whether profile is clicked
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* Specific constant keywords added for matching criteria
   this will be used to define matching criteria for user
   they will help users match based on common constants
   */
const technicalSkills = [
  "JavaScript", "Python", "Java", "C++", "React", "Node.js", 
  "TypeScript", "SQL", "MongoDB", "Docker", "AWS", "Git",
  "Machine Learning", "Data Science", "UI/UX Design", "Mobile Development"
];

const hobbies = [
  "Reading", "Gaming", "Sports", "Music", "Art", "Cooking",
  "Photography", "Traveling", "Hiking", "Dancing", "Writing", "Coding"
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
 * ProfileModal Component
 * * Allows users to view and edit their personal profile information.
 * * Handles both text inputs and multi-select tag arrays.
 */
export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {


  // =========================================
  // State: Form Data
  // =========================================
  const [profileData, setProfileData] = useState({
    name: "Alex Chen",
    bio: "Computer Science student passionate about AI and web development",
    university: "MIT",
    discipline: "Computer Science",
    yearOfStudy: "3",
    skills: ["JavaScript", "React", "Python"],
    hobbies: ["Coding", "Gaming", "Music"],
    personalityType: "INTJ",
    lookingFor: ["Study Partner", "Project Collaborator"],
    linkedin: "linkedin.com/in/alexchen",
    github: "github.com/alexchen"
  });


  // =========================================
  // Helper: Multi-Select Logic
  // =========================================
  /**
   * Toggles an item inside an array state.
   * used for Skills, Hobbies, and 'Looking For' tags.
   */
  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {

      // Remove item if it exists
      return array.filter(i => i !== item);
    } else {

      // Add item if it doesn't exist
      return [...array, item];
    }
  };


  // =========================================
  // Handlers
  // =========================================
  const handleSave = () => {
    // TODO: Add API call to save profile updates here
    onClose();
  };

  // Logic: Do not render anything if modal is closed
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <>

        {/* =========================================
            LAYER 1: Backdrop Overlay
            ========================================= */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={onClose}
        />


        {/* =========================================
            LAYER 2: Modal Content Container
            ========================================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}

          // Layout Styling:
          // - fixed top-1/2 left-1/2: Standard centering technique.
          // - max-w-4xl: A wider container to accommodate a 2-column grid layout.
          // - max-h-[90vh]: Limits height to 90% of the viewport.
          // - overflow-y-auto: Enables internal scrolling if the form gets too long.
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto"

          // Stop click propagation so clicking the form doesn't close the modal
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4">

            {/* Close Button (Top Right) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <h2 className="text-gray-800 mb-6">Edit Profile</h2>


            {/* === FORM CONTAINER === 
              - space-y-6: Adds consistent vertical spacing between major sections (Info vs Bio).
          */}
            <div className="space-y-6">
              {/* Basic Info */}
              {/* === SECTION 1: Academic & Basic Info === 
                - grid-cols-1: Stacked on mobile.
                - md:grid-cols-2: Two columns on larger screens.
               */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Field: Name */}
                <div>
                  <label className="block mb-2 text-gray-700">Name</label>
                  <Input
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>

                {/* Field: University */}
                <div>
                  <label className="block mb-2 text-gray-700">University</label>
                  <Input
                    value={profileData.university}
                    onChange={(e) => setProfileData({ ...profileData, university: e.target.value })}
                  />
                </div>

                {/* Field: Discipline (Major) */}
                <div>
                  <label className="block mb-2 text-gray-700">Discipline</label>
                  <Input
                    value={profileData.discipline}
                    onChange={(e) => setProfileData({ ...profileData, discipline: e.target.value })}
                  />
                </div>


                {/* Field: Year of Study (Dropdown) 
                  - Ensures standardized data input.
              */}
                <div>
                  <label className="block mb-2 text-gray-700">Year of Study</label>
                  <Select
                    value={profileData.yearOfStudy}
                    onValueChange={(value) => setProfileData({ ...profileData, yearOfStudy: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                      <SelectItem value="5+">5+ Year</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bio */}
              {/* === SECTION 2: Biography === 
                - Full width text area for longer descriptions.
                */}
              <div>
                <label className="block mb-2 text-gray-700">Bio</label>
                <Textarea
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                />
              </div>


              {/* Skills */}
              {/* === SECTION 3: Technical Skills === 
                - Uses a predefined list of options for consistency.
            */}
              <div>
                <label className="block mb-2 text-gray-700">Technical Skills</label>

                {/* Tag Container 
                  - bg-gray-50: Visually separates the area from the white modal.
                  - max-h-48: Prevents the list from taking up too much vertical space.
                  */}
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">

                  {/* Note: 'technicalSkills' must be defined as a constant array somewhere in your file.
                   Example: const technicalSkills = ["React", "Node.js", "Python", "Java", "C++", "UI/UX", "AWS", "SQL"];
                */}
                  {technicalSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"  // Prevent form submit

                      // Toggle Logic: Add if missing, Remove if present
                      onClick={() => setProfileData({ ...profileData, skills: toggleArrayItem(profileData.skills, skill) })}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        // Conditional Styling
                        profileData.skills.includes(skill)
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:border-blue-400"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>


              {/* Hobbies */}

              {/* === SECTION 4: Hobbies & Interests === 
                - Uses the same interactive tag cloud pattern as Skills.
            */}
              <div>
                <label className="block mb-2 text-gray-700">Hobbies</label>
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
                  {hobbies.map((hobby) => (
                    <button
                      key={hobby}
                      type="button"
                      onClick={() => setProfileData({ ...profileData, hobbies: toggleArrayItem(profileData.hobbies, hobby) })}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${

                        // Theme: Purple/Pink for Personal Interests
                        profileData.hobbies.includes(hobby)
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:border-pink-400"
                      }`}
                    >
                      {hobby}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personality & Looking For */}
              {/* === SECTION 5: Details & Socials === 
                - 2-Column Grid for compact layout.
                */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>

                  {/* Field: Personality Type (Select) */}
                  <label className="block mb-2 text-gray-700">Personality Type</label>
                  <Select
                    value={profileData.personalityType}
                    onValueChange={(value) => setProfileData({ ...profileData, personalityType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Maps over MBTI types (e.g., INTJ, ENFP) */}
                      {personalityTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Field: LinkedIn URL (Text Input) */}
                <div>
                  <label className="block mb-2 text-gray-700">LinkedIn</label>
                  <Input
                    value={profileData.linkedin}
                    onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                  />
                </div>
              </div>


              {/* Looking For */}
              {/* === SECTION 6: Intent / 'Looking For' === 
                - Defines what the user wants from the platform (Study Partner, Dating, etc.)
                - Uses the Pink/Rose theme to align with Social Mode.
            */}
              <div>
                <label className="block mb-2 text-gray-700">Looking For</label>
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                  {lookingFor.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setProfileData({ ...profileData, lookingFor: toggleArrayItem(profileData.lookingFor, item) })}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        // Theme: Rose Gradient for Social Intent
                        profileData.lookingFor.includes(item)
                          ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:border-pink-400"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              {/* === FORM ACTIONS === 
                - Sticky bottom or end of form actions.
                */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
