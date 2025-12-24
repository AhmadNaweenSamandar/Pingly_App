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


/**
    * LoginSignup Component
    * * The entry barrier for the application.
    * * Handles authentication state and enforces university email domain restrictions.
    */
export function LoginSignup({ onLogin, onSignup }: LoginSignupProps) {
  
  // =========================================
  // State Definitions
  // =========================================

  // Toggles between "Sign In" (true) and "Create Account" (false) views
  const [isLogin, setIsLogin] = useState(true);

  // Form Input States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Validation Feedback State
  // Used to display issues like "Invalid domain" or "Wrong password"
  const [error, setError] = useState("");


  // =========================================
  // Constants
  // =========================================
  
  // The specific email domain required to access the platform.
  // This ensures the app remains exclusive to University of Ottawa community.
  const ALLOWED_DOMAIN = "@uottawa.ca";


  /**
   * Validates if the email belongs to the allowed uOttawa domain.
   * @param {string} email - The input email address.
   * @returns {boolean} - True if email ends with @university.edu
   */
  const validateEmail = (email: string) => {
    // strict check for the domain suffix
    return email.endsWith(ALLOWED_DOMAIN);
  };

  }
