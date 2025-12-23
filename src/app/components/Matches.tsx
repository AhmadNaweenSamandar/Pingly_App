import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, MessageCircle, MoreVertical, X, Calendar } from "lucide-react";
import { ChatPopup } from "./ChatPopup";


//objects for matching created
interface Match {
  id: number;
  user: {
    name: string;
    avatar: string;
    image: string;
  };
  matchedAt: Date;
  unreadCount: number;
  lastMessage?: string;
}


