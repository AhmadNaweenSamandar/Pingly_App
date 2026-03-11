import { useState } from "react";
import { motion } from "motion/react";
import { MessageCircle, Search } from "lucide-react";
import { ChatPopup } from "./ChatPopup";
import { Input } from "./ui/input";

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

const matchesData: Match[] = [
  {
    id: 1,
    user: {
      name: "Alex Park",
      avatar: "AP",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
    },
    matchedAt: new Date(Date.now() - 1000 * 60 * 30),
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
    matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
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
    matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
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
    matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 0,
    lastMessage: "See you at the library tomorrow!"
  }
];

export function ChatList() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matches, setMatches] = useState(matchesData);
  const [searchQuery, setSearchQuery] = useState("");

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const handleChatOpen = (match: Match) => {
    setSelectedMatch(match);
    setMatches(matches.map(m =>
      m.id === match.id ? { ...m, unreadCount: 0 } : m
    ));
  };

  const filteredMatches = matches.filter(match =>
    match.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <motion.div
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-pink-400 to-rose-500 p-3 rounded-xl">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-800">Messages</h3>
            <p className="text-gray-500">{matches.length} conversations</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Chat List */}
        <div className="space-y-3">
          {filteredMatches.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No conversations found</p>
            </div>
          ) : (
            filteredMatches.map((match, index) => (
              <motion.button
                key={match.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleChatOpen(match)}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 hover:shadow-md transition-all text-left group"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={match.user.image}
                    alt={match.user.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
                  {match.unreadCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white"
                    >
                      {match.unreadCount}
                    </motion.div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`${match.unreadCount > 0 ? "text-gray-800" : "text-gray-800"}`}>
                      {match.user.name}
                    </h4>
                    <span className="text-gray-400 text-sm">{getTimeAgo(match.matchedAt)}</span>
                  </div>
                  {match.lastMessage && (
                    <p className={`truncate ${match.unreadCount > 0 ? "text-gray-700" : "text-gray-600"}`}>
                      {match.lastMessage}
                    </p>
                  )}
                </div>

                <MessageCircle className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />
              </motion.button>
            ))
          )}
        </div>
      </motion.div>

      {/* Chat Popup */}
      {selectedMatch && (
        <ChatPopup
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </>
  );
}
