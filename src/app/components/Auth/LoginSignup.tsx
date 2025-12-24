import { useState } from "react";
import { motion } from "motion/react";
import { GraduationCap, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";


//this part differentiate among login and sign up page
interface LoginSignupProps {
  onLogin: () => void;
  onSignup: () => void;
}

