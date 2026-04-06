import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ArrowLeft, Send, Reply, Image as ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

// --- NEW IMPORTS: The maintained WYSIWYG & Security ---
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; 
import DOMPurify from "dompurify";

// --- Mock Data Updated for HTML & Images ---
const discussionsData = [
  {
    id: 1,
    title: "Best frameworks for full-stack development in 2024",
    author: "Alex Rivera",
    authorProfilePicture: "https://i.pravatar.cc/150?u=alex",
    replyCount: 47,
    
    // [EFFICIENCY WIN]: A simple boolean so the feed knows there is an image without parsing HTML.
    hasImage: true, 
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    
    // [SECURITY WIN]: This is now raw HTML from the WYSIWYG editor
    content: "<p>What are your thoughts on the best frameworks for full-stack development this year? I'm torn between <strong>Next.js</strong> and <strong>Remix</strong>.</p>",
    messages: [
      { id: 101, user: "Jamie Lee", profilePicture: "https://i.pravatar.cc/150?u=jamie", text: "<p>I've been loving Next.js with Supabase for the backend. The DX is <em>amazing</em>!</p>", time: "1 hour ago", parentId: null },
      { id: 102, user: "Sam Chen", profilePicture: null, text: "<p>SvelteKit is also worth considering. <strong>Super fast</strong> and the learning curve is gentle.</p>", time: "45 min ago", parentId: null }
    ]
  }
];

// [MAINTAINABILITY WIN]: Define toolbar settings OUTSIDE the component so it doesn't cause re-renders.
const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ 'list': 'bullet' }, { 'list': 'ordered' }],
    ['link'],
    ['clean'] 
  ],
};

export function Discussion() {
  const [selectedDiscussion, setSelectedDiscussion] = useState<typeof discussionsData[0] | null>(null);
  const [newMessage, setNewMessage] = useState(""); 
  const [replyingToId, setReplyingToId] = useState<number | null>(null);

  const handleSendMessage = () => {
    // Strip empty HTML tags to ensure the user actually typed something
    const plainText = newMessage.replace(/(<([^>]+)>)/gi, "").trim();
    
    if (plainText) {
      console.log("Sending HTML payload:", { 
        discussionId: selectedDiscussion?.id, 
        htmlContent: newMessage, 
        parentId: replyingToId 
      });
      setNewMessage("");
      setReplyingToId(null); 
    }
  };

  // [SECURITY WIN]: Always sanitize HTML before rendering it
  const createSafeHTML = (html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  return (
    <div className="relative w-full h-[700px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
      <style>{`
        .ql-toolbar.ql-snow { border: none; border-bottom: 1px solid #f3f4f6; background: #f9fafb; padding: 8px; border-radius: 8px 8px 0 0; }
        .ql-container.ql-snow { border: none; font-family: inherit; font-size: 0.875rem; }
        .ql-editor { min-height: 80px; max-height: 150px; overflow-y: auto; padding: 12px; }
      `}</style>

      <AnimatePresence initial={false} mode="popLayout">
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
                    <div className="flex-shrink-0 w-8 h-8 mt-1 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      #{index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-800 font-semibold group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
                        {discussion.title}
                      </h4>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          {discussion.authorProfilePicture ? (
                            <img src={discussion.authorProfilePicture} alt={discussion.author} className="w-5 h-5 rounded-full object-cover" />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">
                              {discussion.author.charAt(0)}
                            </div>
                          )}
                          <span><span className="font-medium text-gray-700">{discussion.author}</span></span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {/* The elegant visual clue for attached images */}
                          {discussion.hasImage && (
                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-gray-500">
                              <ImageIcon className="w-3.5 h-3.5" />
                            </span>
                          )}
                          <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md shadow-sm">
                            <MessageCircle className="w-3.5 h-3.5 text-indigo-500" />
                            {discussion.replyCount}
                          </span>
                        </div>
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
            {/* Header: Always Pinned Top */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-4 flex-shrink-0 bg-white/80 backdrop-blur-md">
              <button
                onClick={() => { setSelectedDiscussion(null); setReplyingToId(null); }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-800" />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-800 font-bold truncate">{selectedDiscussion.title}</h3>
              </div>
            </div>

            {/* Content: Scrollable */}
            {/* [SCALABILITY WIN]: Added 'min-h-0'. This mathematically forces the flex-1 container 
                to never push the footer off-screen, guaranteeing the scrollbar appears. */}
            <ScrollArea className="flex-1 min-h-0 p-6">
              
              <div className="mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  {selectedDiscussion.authorProfilePicture ? (
                    <img src={selectedDiscussion.authorProfilePicture} alt={selectedDiscussion.author} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {selectedDiscussion.author.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedDiscussion.author}</h4>
                    <p className="text-xs text-gray-500">Original Poster</p>
                  </div>
                </div>

                {/* [UX WIN]: Industry Standard Image Constraint */}
                {/* Changed to max-h-80 (320px) with object-cover. Removed the hover effect that causes layout jumping. */}
                {selectedDiscussion.imageUrl && (
                  <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-900">
                    <img 
                      src={selectedDiscussion.imageUrl} 
                      alt="Attachment" 
                      className="w-full max-h-80 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => {
                        // Phase 2: Add logic here to open a full-screen Lightbox modal!
                        console.log("Open full-screen image");
                      }}
                    />
                  </div>
                )}

                {/* Rendering Safe HTML */}
                <div 
                  className="prose prose-sm md:prose-base prose-indigo max-w-none text-gray-700" 
                  dangerouslySetInnerHTML={createSafeHTML(selectedDiscussion.content)} 
                />
              </div>

              {/* Replies */}
              <div className="space-y-6">
                {selectedDiscussion.messages.map((message) => (
                  <div key={message.id} className="flex gap-4 group">
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
                        <button 
                          onClick={() => setReplyingToId(message.id)}
                          className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                        >
                          <Reply className="w-3 h-3" /> Reply
                        </button>
                      </div>
                      
                      <div 
                        className="prose prose-sm max-w-none text-gray-600"
                        dangerouslySetInnerHTML={createSafeHTML(message.text)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Footer: Always Pinned Bottom */}
            {/* [MAINTAINABILITY WIN]: flex-shrink-0 ensures this footer never gets compressed by the content above it. */}
            <div className="p-4 border-t border-gray-100 flex-shrink-0 bg-white">
              {replyingToId && (
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-xs text-indigo-600 font-medium flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-md">
                    <Reply className="w-3 h-3" /> Replying to user...
                  </span>
                  <button onClick={() => setReplyingToId(null)} className="text-xs text-gray-400 hover:text-gray-700 font-medium">
                    Cancel
                  </button>
                </div>
              )}

              <div className="flex gap-3 items-end">
                <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-shadow bg-white z-20">
                  <ReactQuill 
                    theme="snow"
                    value={newMessage} 
                    onChange={setNewMessage} 
                    modules={quillModules}
                    placeholder={replyingToId ? "Write a reply..." : "Join the discussion..."}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  className="bg-indigo-600 hover:bg-indigo-700 flex-shrink-0 mb-[2px] h-10 px-4 rounded-xl shadow-sm"
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