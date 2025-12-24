import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Bell, Lock, Eye, Globe } from "lucide-react";
import { Button } from "../ui/button";


//interface created to control setting visibility
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

