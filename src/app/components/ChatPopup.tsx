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