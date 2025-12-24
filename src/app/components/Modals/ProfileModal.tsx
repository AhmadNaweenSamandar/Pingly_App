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