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

}