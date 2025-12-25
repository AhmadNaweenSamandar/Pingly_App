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

