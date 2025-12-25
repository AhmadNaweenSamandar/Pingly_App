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
    yearOfStudy: "",           // e.g., "2nd Year"


    // --- STEP 2: Professional Profile (Work Mode) ---
    profilePicture: null as File | null,       // Main avatar (Type: File object)
    skills: [] as string[],                    // Array of tech tags (e.g. ["React", "Java"])
    linkedin: "",
    github: "",


    // --- STEP 3: Social Profile (Social Mode) ---
    socialPictures: [] as File[],              // Carousel photos for the dating/social sid
    bio: "",                                   // Short biography
    hobbies: [] as string[],                   // Array of interest tags
    personalityType: "",                       // e.g., "INTJ"
    lookingFor: [] as string[]                 // e.g., ["Study Buddy", "Friendship"]
  });

}
