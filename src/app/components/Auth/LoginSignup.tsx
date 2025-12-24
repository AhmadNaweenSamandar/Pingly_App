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


export function LoginSignup({ onLogin, onSignup }: LoginSignupProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const ALLOWED_DOMAIN = "@university.edu"; // School email domain

  }
