import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThumbsUp, MessageSquare, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";


// reusable objects for question card created
interface QuestionCardProps {
  question: {
    id: number;
    user: { name: string; avatar: string };
    question: string;
    useful: number;
    replies: Array<{ user: string; text: string }>;
  };
  delay: number;
}



