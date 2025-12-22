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


  /**
   * Updates the state to remove the top card from the stack.
   * Triggered after a successful swipe animation completes.
   * @param {string} action - The type of interaction ("like" or "pass").
   */
  const removeCard = (action: "like" | "pass") => {

    // 1. Update State: Remove index 0 (the top card)
    // using slice(1) to create a new array starting from index 1.
    setCards((prev) => prev.slice(1));

    // 2. Process Action (Mock Logic)
    // TODO: Replace console.log with API calls to backend.
    if (action === "like") {
      console.log("Liked:", cards[0]?.name);

      // e.g., api.post('/like', { userId: cards[0].id })
    } else {
      console.log("Passed:", cards[0]?.name);
    }
  };


  /**
   * Programmatically triggers a swipe action when buttons are clicked.
   * Provides an alternative to gestures for accessibility or preference.
   * @param {string} action - "like" or "pass"
   */
  const handleButtonClick = (action: "like" | "pass") => {

    // 1. Trigger Animation: 
    // Set direction state to force the card to animate off-screen (Right or Left)
    setDragDirection(action === "like" ? "right" : "left");

    // 2. Wait for Animation: 
    // Allow 300ms for the exit transition/motion to visually complete
    setTimeout(() => {

      // 3. Update Data: Remove the card from the stack
      removeCard(action);

      // 4. Reset State: Clear direction so the NEW top card starts neutral
      setDragDirection(null);
    }, 300);
  };

//empty state rendring
// Check if the stack is empty. 
// If so, return the "All Caught Up" view immediately
  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl border-2 border-dashed border-pink-200">
        <div className="text-center">

          {/* Icon: Large centered heart to keep the theme friendly */}
          <Heart className="w-16 h-16 mx-auto mb-4 text-pink-400" />
          {/* Feedback Message */}
          <h3 className="text-gray-700 mb-2">No more profiles</h3>
          <p className="text-gray-500">Check back later for new matches!</p>
        </div>
      </div>
    );
  }


  return (
    /* Main Card Container 
        - relative: Establishes context for absolute positioning of cards.
        - h-[600px]: Fixed height ensures consistent swipe area.
    */
    <div className="relative h-[600px] flex items-center justify-center px-4 sm:px-0">

      {/* AnimatePresence: Required to animate cards LEAVING the DOM (Exit animation) */}
      <AnimatePresence>

        {/* Render only the top 3 cards for performance */}
        {cards.slice(0, 3).map((profile, index) => {
          const isTop = index === 0;
          return (
            <motion.div
              key={profile.id}

              // Positioning: Stack cards on top of each other
              className="absolute w-full max-w-md"
              style={{

                // Z-Index: Ensure the first card (index 0) is always physically on top
                zIndex: cards.length - index,
              }}

              // --- INITIAL STATE ---
              initial={{
                scale: 1 - index * 0.05,  // 100%, 95%, 90%
                y: index * -10,           // 0px, -10px, -20px
                opacity: 1,
              }}

              // --- ACTIVE STATE ---
              animate={{

                // Maintain stack visuals
                scale: 1 - index * 0.05,
                y: index * -10,
                opacity: 1 - index * 0.2,

                // Programmatic Animation (Button Clicks):
                // If buttons were clicked, rotate and move the card automatically.
                rotateZ: isTop && dragDirection === "right" ? 10 : isTop && dragDirection === "left" ? -10 : 0,
                x: isTop && dragDirection === "right" ? 300 : isTop && dragDirection === "left" ? -300 : 0,
              }}

              // --- EXIT STATE (Swipe Complete) ---
              // Flies the card off-screen when removed from the arra
              exit={{
                x: dragDirection === "right" ? 500 : -500,
                opacity: 0,
                transition: { duration: 0.3 },
              }}

              // --- DRAG INTERACTION ---
              drag={isTop ? "x" : false}  // Only allow horizontal drag on top card
              dragConstraints={{ left: 0, right: 0 }} // Snap back to center if released early

              // Live Drag Feedback
              onDrag={(event, info) => {
                if (isTop) {

                  // Set direction state to trigger visual overlays (Like/Nope badges)
                  if (info.offset.x > 50) setDragDirection("right");
                  else if (info.offset.x < -50) setDragDirection("left");
                  else setDragDirection(null);
                }
              }}

              // Drag Completion
              onDragEnd={(event, info) => isTop && handleDragEnd(event, info, info.offset.x > 0 ? "like" : "pass")}
              className={`bg-white rounded-3xl shadow-2xl overflow-hidden ${
                isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
              } ${index > 0 ? "hidden sm:block" : ""}`}
            >


              {/* Profile Image Container
                  - relative: Establishes context for the gradient overlay.
                  - h-96: Fixed height for the image area.
                  - overflow-hidden: Ensures the image zooms/moves without breaking rounded corners.
              */}
              <div className="relative h-96 overflow-hidden">

                {/* User Photo 
                    - object-cover: Ensures the image fills the space without distortion 
                      (crucial for user-uploaded content of varying aspect ratios).
                */}
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />


                {/* Contrast Gradient Overlay 
                    - absolute inset-0: Covers the entire image area.
                    - bg-gradient-to-t: Fades from dark at the bottom to transparent at the top.
                    - PURPOSE: Makes white text (Name, Age) readable against any photo background.
                */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />


                {/* Like/Pass Indicators */}
                {/* LIKE / PASS Stamps 
                    - Only visible on the Top Card (isTop).
                    - Only visible when the user is dragging (dragDirection is not null).
                */}
                {isTop && dragDirection && (
                  <motion.div
                    // Animation: "Pop" in effect (Scale up + Fade in)
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}

                    // Positioning:
                    // - If dragging Right (Like) -> Place stamp on the Right side.
                    // - If dragging Left (Pass) -> Place stamp on the Left side.
                    className={`absolute top-8 ${
                      dragDirection === "right" ? "right-8" : "left-8"
                    }`}
                  >

                    {/* Stamp Content */}
                    <div
                      className={`px-6 py-3 rounded-full text-white font-bold text-xl border-4 ${

                        // Visual Styling:
                        // - Right = Green (Positive)
                        // - Left = Red (Negative/Neutral)
                        dragDirection === "right"
                          ? "bg-green-500 border-green-300"
                          : "bg-red-500 border-red-300"
                      }`}
                    >

                      {/* Text Label */}
                      {dragDirection === "right" ? "LIKE" : "PASS"}
                    </div>
                  </motion.div>
                )}




                {/* Profile Info Overlay */}
                {/* Profile Info Overlay 
                    - absolute bottom-0: Anchors content to the bottom of the image container.
                    - text-white: White text to contrast against the dark gradient overlay.
                */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">

                  {/* Name & Age Header */}
                  <h2 className="mb-1">
                    {profile.name}, {profile.age}
                  </h2>

                  {/* Major / Education Line 
                      - flex items-center: Aligns the icon and text horizontally.
                  */}
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>{profile.major}</span>
                  </div>

                  {/* Bio Text 
                      - text-white/90: Slightly transparent to reduce visual weight compared to the name.
                  */}
                  <p className="text-white/90 mb-3">{profile.bio}</p>

                  {/* Interests Tags 
                      - flex-wrap: Allows tags to wrap to the next line if they run out of space.
                  */}
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        // Glassmorphism Style:
                        // - bg-white/20: 20% opacity white background.
                        // - backdrop-blur-sm: Blurs the image behind the tag.
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>



              {/* Action Buttons */}
              {/* Action Buttons Container 
                    - Only visible if this is the Top Card (isTop).
                    - p-6: Padding inside the card to space buttons from the text.
                */}
              {isTop && (
                <div className="p-6 flex justify-center gap-6">

                  {/* PASS Button (Red 'X') */}
                  <motion.button
                    // Micro-interactions for tactile feel
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}

                    // Trigger Programmatic Swipe Left
                    onClick={() => handleButtonClick("pass")}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <X className="w-8 h-8" />
                  </motion.button>

                  {/* LIKE Button (Pink 'Heart') 
                        - Designed to be visually dominant (larger size, richer gradient).
                    */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    // Trigger Programmatic Swipe Right
                    onClick={() => handleButtonClick("like")}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 via-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
                  >

                    {/* fill-current: Makes the heart solid white */}
                    <Heart className="w-10 h-10 fill-current" />
                  </motion.button>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );

}