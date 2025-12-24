import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";



//variable for feedback modal created
interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

