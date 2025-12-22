import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { Heart, X, MapPin, GraduationCap, Book } from "lucide-react";



//Mock profile data for testing
const profiles = [
  {
    id: 1,
    name: "Emma Wilson",
    age: 21,
    major: "Computer Science",
    interests: ["Web Dev", "AI", "Gaming"],
    bio: "Love coding and looking for study partners for my ML course!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80"
  },
  {
    id: 2,
    name: "Alex Park",
    age: 22,
    major: "Data Science",
    interests: ["Python", "Statistics", "Coffee"],
    bio: "Coffee-fueled data enthusiast. Let's crack some algorithms together!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
  },
  {
    id: 3,
    name: "Sofia Martinez",
    age: 20,
    major: "Design & Tech",
    interests: ["UI/UX", "Art", "Music"],
    bio: "Designer who codes. Looking for creative project collaborators!",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80"
  },
  {
    id: 4,
    name: "James Chen",
    age: 23,
    major: "Software Engineering",
    interests: ["React", "Node.js", "Hiking"],
    bio: "Full-stack dev and outdoor enthusiast. Study sessions followed by adventures!",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80"
  },
  {
    id: 5,
    name: "Maya Patel",
    age: 21,
    major: "Cybersecurity",
    interests: ["Security", "Crypto", "Chess"],
    bio: "Ethical hacker in training. Let's solve CTF challenges together!",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80"
  }
];



/**
 * MatchingFlipCards Component
 * * Implements a swipeable card stack interface (Tinder-style).
 * * Users can swipe right to "Like" (Match) or left to "Pass".
 */
export function MatchingFlipCards() {

  // =========================================
  // State Definitions
  // =========================================


  // The stack of profiles to be swiped. 
  // Typically fetched from an API, initialized here with mock data.
  const [cards, setCards] = useState(profiles);

  // Tracks the active drag state to show visual indicators (e.g., green/red overlays).
  // null = not dragging, "left" = dragging towards pass, "right" = dragging towards like.
  const [dragDirection, setDragDirection] = useState<"left" | "right" | null>(null);


  // =========================================
  // Interaction Handlers
  // =========================================




  /**
   * Handles the completion of a drag gesture.
   * Determines if the user swiped far enough or fast enough to commit the action.
   * * @param event - The raw pointer event.
   * @param info - Framer Motion pan info (contains offset, velocity, etc.).
   * @param action - The intended action ("like" or "pass") based on direction.
   */
  const handleDragEnd = (event: any, info: PanInfo, action: "like" | "pass") => {

    // Distance (pixels) required to trigger a swipe
    const swipeThreshold = 100;

    // Speed (pixels/sec) required to trigger a swipe via "flick"
    const swipeVelocityThreshold = 500;


    // Logic: Check if the drag exceeded either the distance OR velocity threshold.
    if (
      Math.abs(info.offset.x) > swipeThreshold ||
      Math.abs(info.velocity.x) > swipeVelocityThreshold
    ) {

      // Valid swipe detected -> Remove card and trigger action logic
      removeCard(action);
    }


    // Reset visual indicators regardless of outcome (card snaps back if invalid)
    setDragDirection(null);
  };

}