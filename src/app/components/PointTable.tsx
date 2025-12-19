import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Award, Medal, Crown, X } from "lucide-react";
import { Badge } from "./ui/badge";


/* Mock data to populate the Leaderboard UI.
 * Each object represents a user's ranking, score (XP), and includes
 * specific Tailwind CSS gradient classes ('color') to style their badge. */
const leaderboardData = [
  { rank: 1, name: "Sarah Mitchell", xp: 2450, badge: "Master", color: "from-yellow-400 to-amber-500" },
  { rank: 2, name: "Kevin Zhang", xp: 2180, badge: "Expert", color: "from-slate-300 to-slate-400" },
  { rank: 3, name: "Maria Garcia", xp: 1950, badge: "Pro", color: "from-orange-400 to-amber-600" },
  { rank: 4, name: "James Wilson", xp: 1720, badge: "Advanced", color: "from-blue-400 to-blue-500" },
  { rank: 5, name: "Nina Patel", xp: 1580, badge: "Skilled", color: "from-purple-400 to-purple-500" },
  { rank: 6, name: "Tom Anderson", xp: 1340, badge: "Rising", color: "from-green-400 to-green-500" },
];

export function PointTable() {

    /*            --- STATE MANAGEMENT ---
     * Tracks which user is currently clicked/selected.
     * Initially 'null' because no one is selected when the page loads.
     * The type '<typeof...>' ensures we only store valid user data here.*/
  const [selectedUser, setSelectedUser] = useState<typeof leaderboardData[0] | null>(null);


  /*              --- HELPER FUNCTION ---
   * A utility function to decide which icon to show next to a name.
   * Input: The user's rank (1, 2, 3, etc.)
   * Output: The correct Icon component with the correct color. */
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        // Gold Crown for 1st Place
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        // Silver Medal for 2nd Place
        return <Medal className="w-5 h-5 text-slate-400" />;
      case 3:
        // Bronze Award for 3rd Place
        return <Award className="w-5 h-5 text-orange-500" />;
      default:
        // Generic Gray Trophy for everyone else (Rank 4+)
        return <Trophy className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    // <> is a React Fragment. It lets us group things without adding an extra div to the HTML.
    <>
    {/* --- MAIN CARD CONTAINER --- */}
    {/* motion.div: An animated div. styling creates a white card with shadow. */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-fit"
        // INTERACTIVITY:
        // When hovered, the shadow becomes much larger (creating a "lifting" 3D effect).
        whileHover={{ boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      >
        {/* --- HEADER SECTION --- */}
        {/* Flex container to align the Icon (left) and Text (right) horizontally. */}
        <div className="flex items-center gap-3 mb-6">
            {/* 1. THE ICON BOX */}
            {/* A square box with a Gold/Orange gradient background. */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-xl">
            {/* The actual SVG Trophy icon (white color). */}
            <Trophy className="w-6 h-6 text-white" />
          </div>
          {/* 2. THE TEXT LABELS */}
          <div>
            {/* Main Title */}
            <h3 className="text-gray-800">Leaderboard</h3>
            {/* Subtitle / Description */}
            <p className="text-gray-500">Top performers this month</p>
          </div>
        </div>

        <div className="space-y-3">
            {/* --- THE LOOP --- */}
            {/* Iterate through the 'leaderboardData' array. */}
          {leaderboardData.map((user, index) => (
            // --- ANIMATED ROW CONTAINER ---
            <motion.div
            // React needs a unique 'key' to track list items efficiently.
              key={user.rank}
              // ANIMATION SETTINGS:
                // Start invisible and shifted left.
              initial={{ opacity: 0, x: -20 }}
              // End visible and centered.
              animate={{ opacity: 1, x: 0 }}
              // STAGGER EFFECT: Multiply index by 0.1s so they load one after another.
              transition={{ delay: index * 0.1 }}
                // STYLING:
                // 'hover:bg-gradient...': Adds a subtle blue/purple glow when you mouse over.
                // 'group': Allows child elements (like the name) to react when the PARENT is hovered.
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all group"
              // INTERACTION: Set this user as 'selectedUser' when clicked.
              onClick={() => setSelectedUser(user)}
            >
            {/* --- LEFT SIDE: RANK, AVATAR, NAME --- */}
              <div className="flex items-center gap-3 flex-1">
                {/* 1. RANK ICON (Crown, Medal, etc.) */}
                <div className="flex items-center justify-center w-8">
                {/* Calls the helper function we wrote earlier to get the right icon */}
                  {getRankIcon(user.rank)}
                </div>

                {/* 2. AVATAR CIRCLE */}
                {/* A round gradient circle containing the user's initials */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                {/* LOGIC: "Sarah Mitchell" -> "SM" */}
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                {/* 3. NAME AND XP */}
                <div className="flex-1 min-w-0">
                {/* Name turns blue when the parent row (group) is hovered */}
                  <p className="text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                    {user.name}
                  </p>
                  <p className="text-gray-500">{user.xp} XP</p>
                </div>
              </div>

            {/* --- RIGHT SIDE: SKILL BADGE --- */}
            {/* The 'Badge' component form UI folder. */}
            {/* We inject the dynamic 'user.color' variable into the class string here. */}
              <Badge className={`bg-gradient-to-r ${user.color} text-white border-0 shadow-md`}>
                {user.badge}
              </Badge>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* User Detail Popup */}
      {/* --- ANIMATION WRAPPER --- */}
        {/* AnimatePresence allows user detail pop up in point table to animate OUT when they are closed.*/}
      <AnimatePresence>
        {selectedUser && (
          <>
        {/* --- 1. THE BACKDROP (Dark Overlay) --- */}
            <motion.div
            // Animation: Fade in from 0 to 1 opacity. Fade out to 0 on exit.
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}

              // Styling: Fixed position covers entire screen (inset-0).
            // 'bg-black/50' creates the dark tint.
            // 'backdrop-blur-sm' blurs the content BEHIND the popup (frosted glass effect).
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              // INTERACTION: Clicking the dark background closes the popup.
              onClick={() => setSelectedUser(null)}
            />

            {/* --- 2. THE POPUP CARD --- */}
            <motion.div
            // Animation: Starts slightly small (scale 0.9) and lower down (y: 20).
            // Snaps to full size (scale 1) and center position (y: 0).
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              // Styling: Perfectly centered on screen using top-50% / left-50% technique.
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4">
                {/* CLOSE BUTTON (X Icon) */}
                <button
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* CONTENT: Avatar, Name, Stats */}
                <div className="text-center">
                {/* BIG AVATAR (Initials) */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                    <span className="text-3xl">
                      {selectedUser.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>

                  <h3 className="text-gray-800 mb-2">{selectedUser.name}</h3>
                  
                {/* STATS ROW (XP and Rank) */}
                  <div className="flex items-center justify-center gap-6 mb-6">
                    <div className="text-center">
                      <p className="text-gray-500 mb-1">XP Points</p>
                      <p className="text-blue-600">{selectedUser.xp}</p>
                    </div>
                    {/* Vertical Divider Line */}
                    <div className="w-px h-12 bg-gray-200" />
                    <div className="text-center">
                      <p className="text-gray-500 mb-1">Rank</p>
                      <p className="text-purple-600">#{selectedUser.rank}</p>
                    </div>
                  </div>

                {/* BADGE PILL */}
                  <Badge className={`bg-gradient-to-r ${selectedUser.color} text-white border-0 shadow-lg px-6 py-2`}>
                    {selectedUser.badge}
                  </Badge>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
