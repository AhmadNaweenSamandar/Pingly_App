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