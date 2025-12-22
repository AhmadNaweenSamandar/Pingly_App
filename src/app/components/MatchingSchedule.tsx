import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, X, MapPin, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";


//variables for schedule created
interface ScheduleEntry {
  id: number;
  user: { name: string; avatar: string };
  activity: string;
  duration: string;
  description: string;
  location: string;
  time: Date;
}


//Mock data created for schedule representation
const initialSchedules: ScheduleEntry[] = [
  {
    id: 1,
    user: { name: "Sarah Kim", avatar: "SK" },
    activity: "Study Session",
    duration: "2 hours",
    description: "Preparing for final exams - Mathematics",
    location: "Library, 2nd floor",
    time: new Date(Date.now() - 1000 * 60 * 30) // 30 min ago
  },
  {
    id: 2,
    user: { name: "Mike Ross", avatar: "MR" },
    activity: "Coffee Break",
    duration: "1 hour",
    description: "Quick coffee and chat about project ideas",
    location: "Campus Café",
    time: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
  }
];



/**
 * MatchingSchedule Component
 * * A social feed where users broadcast their current activity or study plans.
 * * Allows creating new posts and displaying them in a timeline format.
 */
export function MatchingSchedule() {

  // =========================================
  // State Definitions
  // =========================================

  // List of active schedules/posts. 
  // 'initialSchedules' is likely imported mock data for the prototype.
  const [schedules, setSchedules] = useState<ScheduleEntry[]>(initialSchedules);

  // Toggles the visibility of the "Create Post" form/modal
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  // Controlled Input State for the new schedule form
  const [formData, setFormData] = useState({
    activity: "",       // e.g., "Studying Calc"
    duration: "",       // e.g., "2 hours"
    description: "",    // e.g., "Library 3rd floor"
    location: ""        // e.g., "CRX Building"
  });


  // =========================================
  // Handlers
  // =========================================



  /**
   * Handles the creation of a new schedule post.
   * Validates input, updates the list, and resets the form.
   */
  const handleSubmit = () => {


    // Simple Validation: Ensure required fields are present
    if (formData.activity && formData.duration) {
      const newSchedule: ScheduleEntry = {
        id: Date.now(),  // Generate unique ID
        user: { name: "You", avatar: "YO" },  // Mock user data
        activity: formData.activity,
        duration: formData.duration,
        description: formData.description,
        location: formData.location,
        time: new Date()  // Capture creation time for "Just now" display
      };

      // Update State: Prepend new item to the TOP of the list
      setSchedules([newSchedule, ...schedules]);

      // Cleanup: Reset form and close modal
      setFormData({ activity: "", duration: "", description: "", location: "" });
      setShowScheduleForm(false);
    }
  };



  /**
   * Utility to format timestamps into relative strings.
   * @param {Date} date - The creation time of the post.
   * @returns {string} - "just now", "5m ago", "2h ago", etc.
   */
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

}