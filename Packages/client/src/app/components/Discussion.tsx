import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, ArrowLeft, Send, Reply, 
  Bold, Italic, Link as LinkIcon, List 
} from "lucide-react";
import ReactMarkdown from "react-markdown"; 
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";

// --- Mock Data Updated for Profile Pictures ---
const discussionsData = [
  {
    id: 1,
    title: "Best frameworks for full-stack development in 2024",
    author: "Alex Rivera",
    // [SCALABILITY WIN]: The backend will selectively include this URL. If it's null, we fall back to initials.
    authorProfilePicture: "https://i.pravatar.cc/150?u=alex", 
    replyCount: 47,
    content: "What are your thoughts on the best frameworks for full-stack development this year? I'm torn between **Next.js** and **Remix**.",
    messages: [
      { id: 101, user: "Jamie Lee", profilePicture: "https://i.pravatar.cc/150?u=jamie", text: "I've been loving Next.js with Supabase for the backend. The DX is `amazing`!", time: "1 hour ago", parentId: null },
      { id: 102, user: "Sam Chen", profilePicture: null, text: "SvelteKit is also worth considering. *Super fast* and the learning curve is gentle.", time: "45 min ago", parentId: null }
    ]
  }
];

export function Discussion() {
  const [selectedDiscussion, setSelectedDiscussion] = useState<typeof discussionsData[0] | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [replyingToId, setReplyingToId] = useState<number | null>(null);

  // [MAINTAINABILITY WIN]: We use a ref to track the textarea so our Markdown toolbar 
  // knows exactly where the user's cursor is when they click "Bold" or "Italic".
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending payload:", { 
        discussionId: selectedDiscussion?.id, 
        text: newMessage,
        parentId: replyingToId 
      });
      setNewMessage("");
      setReplyingToId(null); 
    }
  };

  // [UX WIN]: The Markdown Injector
  // This function grabs highlighted text and wraps it in markdown symbols (e.g., **text**)
  const insertMarkdown = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = newMessage;
    
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);

    // If no text is selected, insert placeholder text
    const insertedText = `${prefix}${selected || 'text'}${suffix}`;
    setNewMessage(before + insertedText + after);

    // UX detail: Keep focus on the textarea after clicking a toolbar button
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  return (
    <div className="relative w-full h-[700px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
      <AnimatePresence initial={false} mode="popLayout">
        
        {/* ==========================================
            VIEW 1: THE FEED (Master)
            ========================================== */}
        {!selectedDiscussion ? (
          <motion.div
            key="feed-view"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-30%", opacity: 0 }} 
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="absolute inset-0 flex flex-col w-full h-full p-6"
          >
            <div className="flex items-center gap-3 mb-6 flex-shrink-0">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-800 font-bold">Hot Discussions</h3>
                <p className="text-gray-500 text-sm">Most active conversations</p>
              </div>
            </div>

            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-3">
                {discussionsData.map((discussion, index) => (
                  <motion.div
                    key={discussion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 cursor-pointer transition-all group border border-transparent hover:border-indigo-200"
                    onClick={() => setSelectedDiscussion(discussion)}
                  >
                    {/* [UX WIN]: Added Ranking Number Badge */}
                    <div className="flex-shrink-0 w-8 h-8 mt-1 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-800 font-semibold group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
                        {discussion.title}
                      </h4>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          {/* Rendering the Author's Profile Picture */}
                          {discussion.authorProfilePicture ? (
                            <img src={discussion.authorProfilePicture} alt={discussion.author} className="w-5 h-5 rounded-full object-cover" />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">
                              {discussion.author.charAt(0)}
                            </div>
                          )}
                          <span><span className="font-medium text-gray-700">{discussion.author}</span></span>
                        </div>
                        <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md shadow-sm">
                          <MessageCircle className="w-3.5 h-3.5 text-indigo-500" />
                          {discussion.replyCount}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>

        ) : (

        /* ==========================================
           VIEW 2: THE DETAIL (Slider)
           ========================================== */
          <motion.div
            key="detail-view"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="absolute inset-0 flex flex-col w-full h-full bg-white z-10"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-4 flex-shrink-0 bg-white/80 backdrop-blur-md">
              <button
                onClick={() => {
                  setSelectedDiscussion(null);
                  setReplyingToId(null); 
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-800" />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-800 font-bold truncate">{selectedDiscussion.title}</h3>
              </div>
            </div>

            {/* Content: Scrollable */}
            <ScrollArea className="flex-1 p-6">
              
              {/* Original Post */}
              <div className="mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  {selectedDiscussion.authorProfilePicture ? (
                    <img src={selectedDiscussion.authorProfilePicture} alt={selectedDiscussion.author} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {selectedDiscussion.author.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedDiscussion.author}</h4>
                    <p className="text-xs text-gray-500">Original Poster</p>
                  </div>
                </div>
                <div className="prose prose-sm md:prose-base prose-indigo max-w-none text-gray-700">
                  <ReactMarkdown>{selectedDiscussion.content}</ReactMarkdown>
                </div>
              </div>

              {/* The Replies */}
              <div className="space-y-6">
                {selectedDiscussion.messages.map((message) => (
                  <div key={message.id} className="flex gap-4 group">
                    {/* Level 1 Reply Avatar */}
                    {message.profilePicture ? (
                      <img src={message.profilePicture} alt={message.user} className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1 shadow-sm" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium flex-shrink-0 mt-1">
                        {message.user.charAt(0)}
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 text-sm">{message.user}</span>
                          <span className="text-xs text-gray-400">{message.time}</span>
                        </div>
                        
                        {/* [UX WIN]: Mobile Hover Fix.
                            'opacity-100 md:opacity-0' -> Always visible on phone screens, hidden on desktop until hovered. */}
                        <button 
                          onClick={() => setReplyingToId(message.id)}
                          className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                        >
                          <Reply className="w-3 h-3" /> Reply
                        </button>
                      </div>
                      
                      <div className="prose prose-sm max-w-none text-gray-600">
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Footer */}
            <div className="p-4 border-t border-gray-100 flex-shrink-0 bg-gray-50 flex flex-col gap-2">
              
              {replyingToId && (
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                    <Reply className="w-3 h-3" /> Replying to user...
                  </span>
                  <button onClick={() => setReplyingToId(null)} className="text-xs text-gray-400 hover:text-gray-600">
                    Cancel
                  </button>
                </div>
              )}

              {/* [UX WIN]: The Markdown Toolbar (No images included!) */}
              <div className="flex items-center gap-1 px-2 pb-1">
                <button onClick={() => insertMarkdown('**', '**')} className="p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded transition-colors" title="Bold">
                  <Bold className="w-4 h-4" />
                </button>
                <button onClick={() => insertMarkdown('*', '*')} className="p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded transition-colors" title="Italic">
                  <Italic className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-gray-300 mx-1" /> {/* Divider */}
                <button onClick={() => insertMarkdown('[', '](https://)')} className="p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded transition-colors" title="Link">
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button onClick={() => insertMarkdown('- ')} className="p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded transition-colors" title="Bullet List">
                  <List className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-3">
                <Textarea
                  ref={textareaRef} // Attach ref for toolbar targeting
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={replyingToId ? "Write a reply..." : "Contribute to the main discussion..."}
                  rows={2}
                  className="flex-1 resize-none bg-white focus-visible:ring-indigo-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-indigo-600 hover:bg-indigo-700 self-end h-10 px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}