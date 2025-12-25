import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, MessageCircle, MoreVertical, X, Calendar, UserPlus, Search, Eye, Clock, ArrowRight} from "lucide-react";
import { ChatPopup } from "./ChatPopup";


//objects for matching created
interface Match {
  id: number;
  user: {
    name: string;
    avatar: string;
    image: string;
  };
  matchedAt: Date;
  unreadCount: number;
  lastMessage?: string;
}


//mock data created for matching and messages
const matchesData: Match[] = [
  {
    id: 1,
    user: {
      name: "Alex Park",
      avatar: "AP",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
    },
    matchedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    unreadCount: 2,
    lastMessage: "Hey! Ready for that study session?"
  },
  {
    id: 2,
    user: {
      name: "Emma Wilson",
      avatar: "EW",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80"
    },
    matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 0,
    lastMessage: "Thanks for the help earlier!"
  },
  {
    id: 3,
    user: {
      name: "Sofia Martinez",
      avatar: "SM",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80"
    },
    matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    unreadCount: 1,
    lastMessage: "Love your project idea!"
  },
  {
    id: 4,
    user: {
      name: "James Chen",
      avatar: "JC",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80"
    },
    matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unreadCount: 0,
    lastMessage: "See you at the library tomorrow!"
  }

  
];



/**
 * Matches Component
 * * Displays the list of successful connections (matches).
 * * Manages interactions like Chatting, Viewing Profile, and Unmatching.
 */
export function Matches() {

  // =========================================
  // State Definitions
  // =========================================

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRequests, setShowRequests] = useState(false);

  // Tracks which user is currently selected for a Chat session.
  // null = showing the list; Object = showing the Chat interface.
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // The list of connections. Initialized with mock 'matchesData'.
  const [matches, setMatches] = useState(matchesData);

  // Tracks the open state of the dropdown menus for each card.
  // Stores the ID of the match whose menu is currently open.
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  // Tracks which user profile is currently being viewed in detail (Modal).
  const [detailsMatch, setDetailsMatch] = useState<Match | null>(null);


  // Mock Request Data (For Visual Layout)
  const pendingRequests = [
    { id: 1, name: "Sarah J.", time: "5 min ago", avatar: "https://i.pravatar.cc/150?u=sarah" },
    { id: 2, name: "Mike R.", time: "2 hrs ago", avatar: "https://i.pravatar.cc/150?u=mike" }
  ];

  // =========================================
  // Helpers
  // =========================================


  /**
   * Formats a date into a social-media style relative string.
   * e.g., "just now", "5m ago", "2d ago".
   */
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };



  // =========================================
  // Interaction Handlers
  // =========================================

  /**
   * Opens the Chat interface for a specific match.
   * * Also resets the 'unread' indicator for that user.
   */
  const handleChatOpen = (match: Match) => {
    // 1. Set the active user for the Chat component
    setSelectedMatch(match);

    // 2. Clear Notification:
    // Iterate through matches and set unreadCount to 0 for the selected ID.
    setMatches(matches.map(m => 
      m.id === match.id ? { ...m, unreadCount: 0 } : m
    ));
  };


  /**
   * Removes a user from the matches list.
   * * Triggered from the 'Unmatch' dropdown option.
   */
  const handleUnmatch = (matchId: number) => {

    // Filter out the ID to remove it from state
    setMatches(matches.filter(m => m.id !== matchId));

    // Close the dropdown menu if it was open
    setMenuOpenId(null);
  };


  /**
   * Opens the Profile Details modal.
   * * Triggered from the 'View Profile' dropdown option.
   */
  const handleShowDetails = (match: Match) => {
    setDetailsMatch(match);
    setMenuOpenId(null);
  };


  // =========================================
  // Formatters
  // =========================================



  /**
   * Standard date formatter (e.g., "October 24, 2025").
   */
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  /**
   * Mock Age Calculator
   * * Returns a specific age for demo users, or defaults to 21.
   * * TODO: Replace with 'user.age' from backend API.
   */
  const getAge = (name: string) => {
    const ages: { [key: string]: number } = {
      "Alex Park": 22,
      "Emma Wilson": 21,
      "Sofia Martinez": 20,
      "James Chen": 23
    };
    return ages[name] || 21;


  };


  // =========================================
  // MAIN RENDER
  // =========================================

  return (
    <>

      {/* Matches Widget Container 
          - h-fit: Grows with content (preventing huge empty whitespace).
          - p-6: Consistent padding with other dashboard widgets.
      */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-fit relative group/widget"
        // Interaction: Lift the card visually on hover
        whileHover={{ boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      >

        {/* =========================================
            WIDGET HEADER & CONTROLS
            - flex justify-between: Pushes Logo to left, Icons to right.
            - items-center: Vertically centers everything.
            ========================================= */}
        <div className="flex items-center justify-between mb-6 h-12">
          {/* --- LEFT SIDE: LOGO OR SEARCH BAR --- */}
          <div className="flex items-center gap-3 flex-1">

            {isSearchOpen ? (
              // SEARCH MODE: Input Field
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-pink-100 focus-within:border-pink-300 transition-colors mr-2"
              >
                <Search className="w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search connections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="bg-transparent border-none focus:ring-0 text-sm text-gray-700 w-full outline-none placeholder:text-gray-400"
                />
                <button 
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                  className="p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>

              ) : (
              // DEFAULT MODE: Logo & Title
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >

                {/* Pink Theme Icon */}
                <div className="bg-gradient-to-br from-pink-400 to-rose-500 p-3 rounded-xl shadow-sm">
                  <Heart className="w-6 h-6 text-white fill-current" />
                </div>

                {/* Title & Meta */}
                <div>
                  <h3 className="text-gray-800">Your Matches</h3>
                  <p className="text-xs text-gray-500">{matches.length} connections</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* --- RIGHT SIDE: ACTION ICONS --- 
              - Aligns with the right edge of the scroll area.
          */}
          <div className="flex items-center gap-1 pl-2">

            {/* 1. Search Toggle (Hidden if search is open) */}
            {!isSearchOpen && (
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-xl text-gray-500 hover:text-pink-600 transition-colors"
                title="Search Matches"
              >
                <Search className="w-5 h-5" />
              </motion.button>
            )}

            {/* 2. Match Requests Toggle */}
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRequests(true)}
              className="relative p-2.5 rounded-xl text-gray-500 hover:text-pink-600 transition-colors"
              title="Match Requests"
            >
              <UserPlus className="w-5 h-5" />
              
              {/* Notification Badge (Mock Logic) */}
              {pendingRequests.length > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              )}
            </motion.button>
          </div>
        </div>




        {/* Matches List */}
        {/* Scrollable List Container 
            - max-h-[400px]: Limits height to keep widget aligned with others.
            - overflow-y-auto: Enables scrolling within the widget.
        */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">

          {/* --- EMPTY STATE CHECK --- */}
          {matches
            // Simple Search Filter Logic
            .filter(m => m.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No matches yet. Start swiping!</p>
            </div>
          ) : (
            // --- MATCH ROW RENDERING ---
            matches
            .filter(m => m.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((match, index) => (
              <motion.div
                key={match.id}

                // Animation: Slide in from Left
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}


                // Styling:
                // - Pink gradient background (Match Theme).
                // - group: Allows child elements (like buttons) to react when the row is hovered.
                // - relative: Needed for positioning the dropdown menu later.
                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 hover:shadow-md transition-all group relative"
              >
                {/* 1. Avatar Column */}
                <div className="relative flex-shrink-0">
                  <img
                    src={match.user.image}
                    alt={match.user.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                  />

                  {/* Online Status Dot (Bottom Right) */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
                </div>


                {/* 2. Text Info Column 
                    - min-w-0: Critical flexbox hack to allow text truncation to work.
                */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-gray-800">{match.user.name}</h4>
                    <span className="text-gray-400">{getTimeAgo(match.matchedAt)}</span>
                  </div>

                  {/* Last Message Preview */}
                  {match.lastMessage && (
                    <p className="text-gray-600 truncate">{match.lastMessage}</p>
                  )}
                </div>


                {/* 3. Actions Column 
                    - flex-col: Stacks the "Menu" and "Chat" buttons vertically.
                    - items-end: Aligns them to the right.
                */}
                <div className="flex flex-col gap-2 items-end flex-shrink-0">
                  
                  {/* --- THREE DOTS MENU WRAPPER --- */}
                  <div className="relative">
                    <button
                      
                      onClick={() => setMenuOpenId(menuOpenId === match.id ? null : match.id)}
                      className="p-1 hover:bg-white/50 rounded-full transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>

                    {/* Menu Dropdown */}
                    {/* =========================================
                        MODAL: Match Profile Details
                        - Shows full bio/interests when "Details" is clicked in the menu.
                        ========================================= */}
                    <AnimatePresence>
                      {menuOpenId === match.id && (
                        /* Backdrop */
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-10"
                        >
                          <button
                            onClick={() => handleShowDetails(match)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-700"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleUnmatch(match.id)}
                            className="w-full px-4 py-2 text-left hover:bg-red-50 transition-colors text-red-600"
                          >
                            Unmatch
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>


                  {/* Chat Button */}
                  {/* Primary Action: Chat Button 
                      - Uses motion.button for touch feedback (scale down on click).
                  */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleChatOpen(match)}
                    className="relative w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <MessageCircle className="w-5 h-5" />


                    {/* Unread Message Badge 
                        - Only renders if there are new messages.
                    */}
                    {match.unreadCount > 0 && (
                      <motion.div
                        // Animation: Pop in from zero size
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        // Positioning: Floating on top-right corner of the button
                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white"
                      >
                        {match.unreadCount}
                      </motion.div>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>


      {/* =========================================
          MODAL: MATCH REQUESTS
          - Triggered by the UserPlus icon in header.
          ========================================= */}
      <AnimatePresence>
        {showRequests && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={() => setShowRequests(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-3xl shadow-2xl p-6 overflow-hidden">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-100 p-2 rounded-lg">
                       <UserPlus className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Match Requests</h3>
                      <p className="text-sm text-gray-500">People who want to connect</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowRequests(false)}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Requests List */}
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {pendingRequests.map((req, i) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all bg-white group"
                    >
                      {/* Left: User Info */}
                      <div className="flex items-center gap-4">
                        <img 
                          src={req.avatar} 
                          alt={req.name} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-pink-100" 
                        />
                        <div>
                          <h4 className="font-bold text-gray-800">{req.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <span className="text-pink-600 font-medium">Requested a match</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {req.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Gaze Button */}
                      <button
                        // TODO: Connect this to MatchingFlipCards logic later
                        onClick={() => console.log("Gaze Clicked - Open Flip Card Preview")}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold shadow-md hover:shadow-xl transform hover:scale-105 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        Gaze
                      </button>
                    </motion.div>
                  ))}

                  {pendingRequests.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <p>No pending requests.</p>
                    </div>
                  )}
                </div>
                
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Chat Popup */}
      {/* =========================================
          Chat Interface Overlay
          - Conditionally renders when a user is selected.
          - onClose: Resets state to return to the list view.
          ========================================= */}
      {selectedMatch && (
        <ChatPopup
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}



      {/* =========================================
          MODAL: Match Details Popup
          - Wrapped in AnimatePresence for smooth entry/exit.
          - Only renders if 'detailsMatch' state is populated.
          ========================================= */}
      <AnimatePresence>
        {detailsMatch && (
          <>

            {/* 1. Backdrop Overlay 
                - bg-black/50: Darkens the background.
                - backdrop-blur-sm: Adds a glass-like blur effect.
                - onClick: Closes the modal.
            */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={() => setDetailsMatch(null)}
            />

            {/* 2. Modal Content Card 
                - Centered via fixed positioning + translate.
                - z-50: Ensures it floats above everything else.
            */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"

              // Prevent closing when clicking inside the card
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4">

                {/* Close Button (Top Right X) */}
                <button
                  onClick={() => setDetailsMatch(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Profile Header */}
                <div className="text-center">

                  {/* Large Avatar */}
                  <img
                    src={detailsMatch.user.image}
                    alt={detailsMatch.user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-pink-200 shadow-lg mx-auto mb-4"
                  />

                  <h3 className="text-gray-800 mb-6">Match Details</h3>

                  {/* Info Stack */}
                  <div className="space-y-4 text-left">

                    {/* Field: Name */}
                    <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl">
                      <label className="text-gray-500 mb-1 block">Name</label>
                      <p className="text-gray-800">{detailsMatch.user.name}</p>
                    </div>


                    {/* Field: Age 
                        - Uses the 'getAge' helper defined in the component. 
                    */}
                    <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl">
                      <label className="text-gray-500 mb-1 block">Age</label>
                      <p className="text-gray-800">{getAge(detailsMatch.user.name)} years</p>
                    </div>


                    {/* Field: Date Matched */}
                    <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl">
                      <label className="text-gray-500 mb-1 block">Matched On</label>
                      <div className="flex items-center gap-2 text-gray-800">
                        <Calendar className="w-4 h-4" />
                        {formatDate(detailsMatch.matchedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

