import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Upload, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


//variable added to find whether profile is clicked
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

