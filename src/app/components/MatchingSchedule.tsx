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