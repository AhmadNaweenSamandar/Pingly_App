import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FolderKanban, MessageCircle, MoreVertical, X, Users, Calendar } from "lucide-react";
import { GroupChatPopup } from "./GroupChatPopup";


// the project interface initializing project parameters
interface Project {
  id: number;
  name: string;
  description: string;
  owner: string;
  members: Array<{ name: string; avatar: string }>;
  unreadMessages: number;
  datePosted: Date;
}

