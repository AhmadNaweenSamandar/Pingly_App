import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ArrowLeft, Send, Reply, Image as ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; 
import DOMPurify from "dompurify";

// Define the shape of the props this component expects
interface DiscussionProps {
  feedData: any[]; // Ideally, type this strictly based on our data shape!
}

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ 'list': 'bullet' }, { 'list': 'ordered' }],
    ['link'],
    ['clean'] 
  ],
};

// Accept feedData as a prop from ProfessionalMode
export function Discussion({ feedData }: DiscussionProps) {
  
  // Notice: The state for the whole array is gone! We only track the selected one.
  const [selectedDiscussion, setSelectedDiscussion] = useState<any | null>(null);
  
  const [newMessage, setNewMessage] = useState(""); 
  const [replyTarget, setReplyTarget] = useState<{ parentId: number, name: string } | null>(null);

  // Define your backend URL (Ideally move this to an environment variable later)
  const BACKEND_URL = "http://localhost:3000";

  // =======================================================================
  // 4. GET SINGLE DISCUSSION (Triggered on Click)
  // =======================================================================
  const handleDiscussionClick = async (discussionId: number) => {
    try {
      const token = localStorage.getItem("access_token"); // Adjust if your token key is different
      
      const response = await fetch(`${BACKEND_URL}/discussions/${discussionId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch discussion details");
      }

      const dbDetail = await response.json();

      // Helper function to safely format image URLs
      const formatImageUrl = (path: string | null) => {
        if (!path) return null;
        // If it's an external link (like a Pravatar mock), leave it. Otherwise, prepend backend URL.
        return path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
      };

      // Helper function to format dates nicely (e.g., "10/24/2024, 2:30 PM")
      const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleString([], { 
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        });
      };

      // 3. Map the heavily nested Prisma data to our Frontend UI Shape
      const formattedDetail = {
        id: dbDetail.id,
        title: dbDetail.title,
        content: dbDetail.content,
        author: dbDetail.author.name || "Unknown User",
        authorProfilePicture: formatImageUrl(dbDetail.author.profilePicture),
        
        // Grab the first attached image if it exists
        imageUrl: dbDetail.images && dbDetail.images.length > 0 
          ? formatImageUrl(dbDetail.images[0]) 
          : null,
        
        // Map the Level 1 Replies
        messages: dbDetail.replies.map((level1Msg: any) => ({
          id: level1Msg.id,
          user: level1Msg.author.name || "Unknown User",
          profilePicture: formatImageUrl(level1Msg.author.profilePicture),
          text: level1Msg.content,
          time: formatTime(level1Msg.createdAt),
          
          // Map the Level 2 Replies (Children)
          children: level1Msg.children ? level1Msg.children.map((level2Msg: any) => ({
            id: level2Msg.id,
            user: level2Msg.author.name || "Unknown User",
            profilePicture: formatImageUrl(level2Msg.author.profilePicture),
            text: level2Msg.content,
            time: formatTime(level2Msg.createdAt),
            parentId: level2Msg.parentId
          })) : []
        }))
      };

      // 4. Update the state to switch the view from Feed to Detail!
      setSelectedDiscussion(formattedDetail);

    } catch (error) {
      console.error("Error fetching discussion details:", error);
      alert("Could not load discussion details. Please try again.");
    }
  };

  const handleSendReply = () => {
    const plainText = newMessage.replace(/(<([^>]+)>)/gi, "").trim();
    if (plainText && selectedDiscussion) {
      console.log("Sending reply payload:", { 
        discussionId: selectedDiscussion.id, 
        htmlContent: newMessage, 
        parentId: replyTarget?.parentId
      });
      setNewMessage("");
      setReplyTarget(null); 
    }
  };

  const createSafeHTML = (html: string) => ({ __html: DOMPurify.sanitize(html) });

  const MessageBlock = ({ message, isLevel2 = false, level1ParentId }: { message: any, isLevel2?: boolean, level1ParentId: number }) => (
    <div className={`flex gap-3 md:gap-4 group ${isLevel2 ? "mt-4 relative" : ""}`}>
      {isLevel2 && <div className="absolute -left-5 md:-left-8 top-0 bottom-0 w-px bg-gray-200" />}

      {message.profilePicture ? (
        <img src={message.profilePicture} alt={message.user} className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1 shadow-sm" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium flex-shrink-0 mt-1 text-sm">{message.user.charAt(0)}</div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 text-sm truncate">{message.user}</span>
            <span className="text-xs text-gray-400 flex-shrink-0">{message.time}</span>
          </div>
          {!isLevel2 && (
            <button onClick={() => setReplyTarget({ parentId: level1ParentId, name: message.user })} className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 bg-indigo-50 md:bg-transparent px-2 py-1 md:p-0 rounded-md md:rounded-none">
              <Reply className="w-3 h-3" /> Reply
            </button>
          )}
        </div>
        <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={createSafeHTML(message.text)} />
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-[700px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
      <style>{`
        .ql-toolbar.ql-snow { border: none; border-bottom: 1px solid #f3f4f6; background: #f9fafb; padding: 8px; border-radius: 8px 8px 0 0; }
        .ql-container.ql-snow { border: none; font-family: inherit; font-size: 0.875rem; }
        .ql-editor { min-height: 80px; max-height: 200px; overflow-y: auto; padding: 12px; }
      `}</style>

      <AnimatePresence initial={false} mode="popLayout">
        
        {/* ==========================================
            VIEW 1: THE FEED
            ========================================== */}
        {!selectedDiscussion ? (
          <motion.div key="feed-view" initial={{ x: "-100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "-30%", opacity: 0 }} transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="absolute inset-0 flex flex-col w-full h-full p-6">
            
            {/* The header is removed! The parent handles it now. */}
            
            {/* We map over feedData instead of local state! */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="space-y-3">
                {feedData.map((discussion, index) => (
                  <motion.div
                    key={discussion.id}
                    className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 cursor-pointer border border-transparent hover:border-indigo-200"
                    onClick={() => handleDiscussionClick(discussion.id)}
                  >
                    <div className="flex-shrink-0 w-8 h-8 mt-1 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">{index + 1}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-800 font-semibold mb-2 line-clamp-2">{discussion.title}</h4>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{discussion.author}</span>
                        <div className="flex items-center gap-2">
                          {discussion.hasImage && <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-gray-500"><ImageIcon className="w-3.5 h-3.5" /></span>}
                          <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md shadow-sm"><MessageCircle className="w-3.5 h-3.5 text-indigo-500" />{discussion.replyCount}</span>
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
           VIEW 2: THE DETAIL (Replies)
           ========================================== */
          <motion.div key="detail-view" initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }} transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="absolute inset-0 flex flex-col w-full h-full bg-white z-10">
            {/* The entire detail view remains exactly the same as Step 4! */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-4 flex-shrink-0 bg-white/80 backdrop-blur-md z-20">
              <button onClick={() => { setSelectedDiscussion(null); setReplyTarget(null); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-800" />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-800 font-bold truncate">{selectedDiscussion.title}</h3>
              </div>
            </div>

            <ScrollArea className="flex-1 min-h-0 p-4 md:p-6">
              <div className="mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  {selectedDiscussion.authorProfilePicture ? (
                    <img src={selectedDiscussion.authorProfilePicture} alt={selectedDiscussion.author} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">{selectedDiscussion.author.charAt(0)}</div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedDiscussion.author}</h4>
                    <p className="text-xs text-gray-500">Original Poster</p>
                  </div>
                </div>
                
                {selectedDiscussion.imageUrl && (
                  <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-900">
                    <img src={selectedDiscussion.imageUrl} alt="Attachment" className="w-full max-h-80 object-cover" />
                  </div>
                )}
                
                <div className="prose prose-sm md:prose-base prose-indigo max-w-none text-gray-700" dangerouslySetInnerHTML={createSafeHTML(selectedDiscussion.content)} />
              </div>

              <div className="space-y-8">
                {selectedDiscussion.messages.map((level1Msg: any) => (
                  <div key={level1Msg.id} className="flex flex-col">
                    <MessageBlock message={level1Msg} level1ParentId={level1Msg.id} />
                    {level1Msg.children && level1Msg.children.length > 0 && (
                      <div className="mt-4 ml-8 md:ml-12 pl-2 flex flex-col gap-4">
                        {level1Msg.children.map((level2Msg: any) => (
                          <MessageBlock key={level2Msg.id} message={level2Msg} isLevel2={true} level1ParentId={level1Msg.id} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-100 flex-shrink-0 bg-white">
              {replyTarget && (
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-xs text-indigo-600 font-medium flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-md">
                    <Reply className="w-3 h-3" /> Replying to <span className="font-bold">{replyTarget.name}</span>
                  </span>
                  <button onClick={() => setReplyTarget(null)} className="text-xs text-gray-400 hover:text-gray-700 font-medium">Cancel</button>
                </div>
              )}

              <div className="flex gap-2 md:gap-3 items-end">
                <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-shadow bg-white z-20">
                  <ReactQuill theme="snow" value={newMessage} onChange={setNewMessage} modules={quillModules} placeholder={replyTarget ? "Write a reply..." : "Join the discussion..."} />
                </div>
                <Button onClick={handleSendReply} className="bg-indigo-600 hover:bg-indigo-700 flex-shrink-0 mb-[2px] h-[42px] px-3 md:px-4 rounded-xl shadow-sm">
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