import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Smile } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";



//objects created for messages
interface Message {
  id: number;
  sender: "me" | "them";
  text: string;
  timestamp: Date;
}


//objects created for ChatPopup
interface ChatPopupProps {
  match: {
    id: number;
    user: {
      name: string;
      avatar: string;
      image: string;
    };
  };
  onClose: () => void;
}


//mock data created for messages
const initialMessages: Message[] = [
  {
    id: 1,
    sender: "them",
    text: "Hey! I saw you're also studying Computer Science. What courses are you taking this semester?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
  },
  {
    id: 2,
    sender: "me",
    text: "Hi! I'm taking Data Structures, Web Development, and AI. How about you?",
    timestamp: new Date(Date.now() - 1000 * 60 * 50) // 50 min ago
  },
  {
    id: 3,
    sender: "them",
    text: "Nice! I'm in Web Dev too! Would you be interested in studying together sometime?",
    timestamp: new Date(Date.now() - 1000 * 60 * 45) // 45 min ago
  },
  {
    id: 4,
    sender: "me",
    text: "That sounds great! I'm free this weekend. Coffee and coding?",
    timestamp: new Date(Date.now() - 1000 * 60 * 40) // 40 min ago
  },
  {
    id: 5,
    sender: "them",
    text: "Perfect! Saturday afternoon at the campus café? Around 2 PM?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 min ago
  }
];


