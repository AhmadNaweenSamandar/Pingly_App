import { useState } from "react";
import { motion } from "motion/react";
import { MessageSquarePlus, Lightbulb, MessageCircle, Plus } from "lucide-react";
import { PointTable } from "./PointTable";
import { Discussion } from "./Discussion";
import { Projects } from "./Projects";
import { ProjectIdeaCard } from "./ProjectIdeaCard";
import { QuestionCard } from "./QuestionCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";


// Mock data for project ideas
const projectIdeas = [
  {
    id: 1,
    user: { name: "Alex Chen", avatar: "AC" },
    idea: "Building a collaborative note-taking app with real-time synchronization for study groups",
    skills: ["React", "Node.js", "WebSocket"],
    wishes: 24
  },
  {
    id: 2,
    user: { name: "Sarah Johnson", avatar: "SJ" },
    idea: "Creating an AI-powered flashcard generator that uses spaced repetition algorithms",
    skills: ["Python", "TensorFlow", "React"],
    wishes: 18
  },
  {
    id: 3,
    user: { name: "Mike Torres", avatar: "MT" },
    idea: "Developing a peer-to-peer tutoring marketplace for university students",
    skills: ["Vue.js", "Firebase", "Stripe API"],
    wishes: 31
  }
];


// Mock data for questions
const questions = [
  {
    id: 1,
    user: { name: "Emma Davis", avatar: "ED" },
    question: "What's the best approach to implement authentication in a MERN stack application?",
    useful: 15,
    replies: [
      { user: "John Doe", text: "I'd recommend using JWT tokens with httpOnly cookies for security." },
      { user: "Jane Smith", text: "Also consider implementing refresh tokens for better UX." }
    ]
  },
  {
    id: 2,
    user: { name: "Ryan Kim", avatar: "RK" },
    question: "How do I optimize database queries in a large-scale application?",
    useful: 22,
    replies: []
  },
  {
    id: 3,
    user: { name: "Lisa Wang", avatar: "LW" },
    question: "Best practices for responsive design in 2024?",
    useful: 8,
    replies: [
      { user: "Bob Wilson", text: "Use CSS Grid and Flexbox together for maximum flexibility." }
    ]
  }
];


