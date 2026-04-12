import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ArrowLeft, Send, Reply, Image as ImageIcon, ChevronLeft, X, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; 
import DOMPurify from "dompurify";
import { is } from "date-fns/locale";

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

  // state to track which image is currently active in the lightbox and user clicked on it 
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // state to handle text expansion in individual discussion (for long content) - optional enhancement
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  // Add a loading state to prevent double-submissions
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Our backend URL (Ideally move this to an environment variable later)
  const BACKEND_URL = "http://localhost:3000";

  // =======================================================================
  // 4. GET SINGLE DISCUSSION (Triggered on Click)
  // =======================================================================
  const handleDiscussionClick = async (discussionId: number) => {
    try {
      const token = localStorage.getItem("access_token");
      
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
        // If it's already a full web URL, return it as-is
        if (path.startsWith("http")) return path;

        // If the path already starts with a slash, just append it
        // If it doesn't, add the slash manually in the middle
        return path.startsWith("/") 
          ? `${BACKEND_URL}${path}` 
          : `${BACKEND_URL}/${path}`;
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
        
        // Grab the full array of the images 
        images: dbDetail.images && dbDetail.images.length > 0 
          ? dbDetail.images.map((img: string) => formatImageUrl(img)) 
          : [],
        
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

      // --- ADD THESE TWO LINES ---
      console.log("1. Raw Backend JSON:", dbDetail.author.profilePicture);
      console.log("2. Mapped Frontend State:", formattedDetail.authorProfilePicture);
      // ---------------------------

      // 4. Update the state to switch the view from Feed to Detail!
      setSelectedDiscussion(formattedDetail);

    } catch (error) {
      console.error("Error fetching discussion details:", error);
      alert("Could not load discussion details. Please try again.");
    }
  };

  // api/discussions.js (or wherever you keep your API utilities)

  const createDiscussionReply = async (discussionId: number, payload: any) => {
    // 1. Retrieve the token safely
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('User is not authenticated');
    }

    // 2. Execute the fetch request
    const response = await fetch(`http://localhost:3000/discussions/${discussionId}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    // 3. Handle standard HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to post reply');
    }

    // 4. Return the newly created record (which includes the populated author)
    return response.json();
  };

  const handleSendReply = async () => {
    const plainText = newMessage.replace(/(<([^>]+)>)/gi, "").trim();

    // Guard clause: Don't fire if empty, missing discussion, or already submitting
    if (!plainText || !selectedDiscussion || isSubmitting) return;

    setIsSubmitting(true); // Lock the UI

    try {
      // 1. Prepare the payload for NestJS
      const payload = {
        content: newMessage, // NestJS DOMPurify will sanitize this
        parentId: replyTarget?.parentId || null
      };

      // 2. Fire the request
      const newBackendReply = await createDiscussionReply(selectedDiscussion.id, payload);

      // DEBUG 1: Did we get the right data from NestJS?
      console.log("1. Backend Data Received:", newBackendReply);

      // Helper function to format dates nicely (e.g., "10/24/2024, 2:30 PM")
      const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleString([], { 
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        });
      };

      // 3. Map Backend schema -> Frontend component props
      // We must format the NestJS return object into what <MessageBlock /> expects
      const formattedReply = {
        id: newBackendReply.id,
        user: newBackendReply.author.name,
        profilePicture: newBackendReply.author.profilePicture,
        time: formatTime(new Date().toISOString()), // Or format newBackendReply.createdAt using date-fns/dayjs
        text: newBackendReply.content, 
        children: [] // Initialize empty array in case someone replies to this later
      };

      // DEBUG 2: Is the mapping correct?
      console.log("2. Formatted for Frontend:", formattedReply);



      // 4. The Pessimistic State Update (Option A)
      setSelectedDiscussion(prevDiscussion => {

        // DEBUG 3: What is the current state?
        console.log("3. Previous Discussion State:", prevDiscussion);

        if (!prevDiscussion) return prevDiscussion;

        // Handle the case where messages might be undefined on a brand new discussion
        const updatedMessages = prevDiscussion.messages ? [...prevDiscussion.messages] : [];

        if (!payload.parentId) {
          // LEVEL 1: Append directly to the main discussion thread
          updatedMessages.push(formattedReply);
          // DEBUG 4: Check the new messages array after pushing a Level 1 reply
          console.log("4. Pushed Level 1 Reply. New array:", updatedMessages);
        } else {
          // LEVEL 2: Find the parent Level 1 message and append to its children
          const parentIndex = updatedMessages.findIndex(msg => msg.id === payload.parentId);
          
          if (parentIndex !== -1) {
            const parentMsg = updatedMessages[parentIndex];
            updatedMessages[parentIndex] = {
              ...parentMsg,
              children: [...(parentMsg.children || []), formattedReply]
            };
          }
        }
        //Debug 4.5: Check the final updated messages array before returning the new state
        console.log("Total messages React is trying to render:", selectedDiscussion?.messages?.length);

        // Return the entirely new discussion object to trigger the re-render
        return { ...prevDiscussion, messages: updatedMessages };
      });

      // 5. Clean up the UI
      setNewMessage("");
      setReplyTarget(null);

    } catch (error) {
      // DEBUG 5: checking if there's an error
      console.error("Failed to post reply:", error);
      // TODO: Trigger a toast notification here (e.g., toast.error(error.message))
    } finally {
      setIsSubmitting(false); // Unlock the UI
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
      {/* THE FIX: Added .quill-content-override to crush ReactQuill's inline styles */}
      <style>{`
        .ql-toolbar.ql-snow { border: none; border-bottom: 1px solid #f3f4f6; background: #f9fafb; padding: 8px; border-radius: 8px 8px 0 0; }
        .ql-container.ql-snow { border: none; font-family: inherit; font-size: 0.875rem; }
        .ql-editor { min-height: 80px; max-height: 200px; overflow-y: auto; padding: 12px; }
        
        .quill-content-override * {
          white-space: normal !important;
          word-wrap: break-word !important;
          overflow-wrap: anywhere !important;
          max-width: 100% !important;
        }
      `}</style>

      <AnimatePresence initial={false} mode="popLayout">
        
        {/* ==========================================
            VIEW 1: THE FEED
            ========================================== */}
        {!selectedDiscussion ? (
          <motion.div key="feed-view" initial={{ x: "-100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "-30%", opacity: 0 }} transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="absolute inset-0 flex flex-col w-full h-full p-6">
            <div className="flex-1 min-h-0 overflow-y-auto pr-2">
              <div className="space-y-3">
                {feedData.map((discussion: any, index: number) => (
                  <motion.div
                    key={discussion.id}
                    className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 cursor-pointer border border-transparent hover:border-indigo-200"
                    onClick={() => {
                      setIsTextExpanded(false); // Reset text state
                      setActiveImageIndex(null); // Reset image state
                      handleDiscussionClick(discussion.id);
                    }}
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
            </div>
          </motion.div>
        ) : (

        /* ==========================================
           VIEW 2: THE DETAIL (Replies)
           ========================================== */
          <motion.div key="detail-view" initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }} transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="absolute inset-0 flex flex-col w-full h-full bg-white z-10">
            
            <div className="p-4 border-b border-gray-100 flex items-center gap-4 flex-shrink-0 bg-white/80 backdrop-blur-md z-20">
              <button onClick={() => { setSelectedDiscussion(null); setReplyTarget(null); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-800" />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-800 font-bold truncate">{selectedDiscussion.title}</h3>
              </div>
            </div>

            <div className="flex-1 min-h-0 p-4 md:p-6 overflow-y-auto">
              <div className="mb-8 pb-8 border-b border-gray-100 flex flex-col w-full min-w-0">
                
                {/* 1. OP INFO */}
                <div className="flex items-center gap-3 mb-4 w-full">
                  {selectedDiscussion.authorProfilePicture ? (
                    <img src={selectedDiscussion.authorProfilePicture} alt={selectedDiscussion.author} className="w-10 h-10 rounded-full object-cover shadow-sm flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">{selectedDiscussion.author.charAt(0)}</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 truncate">{selectedDiscussion.author}</h4>
                    <p className="text-xs text-gray-500">Original Poster</p>
                  </div>
                </div> 

                {/* 2. TEXT CONTENT (Safely Wrapped & Restrained) */}
                <div className="mb-6 w-full min-w-0 flex flex-col">
                  {(() => {
                    const rawTextLength = selectedDiscussion.content ? selectedDiscussion.content.replace(/<[^>]*>?/gm, '').trim().length : 0;
                    const isLongText = rawTextLength > 150;

                    return (
                      <>
                        <div className="relative w-full min-w-0">
                          <div 
                            className={`prose prose-sm md:prose-base prose-indigo w-full max-w-full min-w-0 overflow-hidden transition-all duration-500 ease-in-out quill-content-override ${
                              !isTextExpanded && isLongText ? 'max-h-24' : 'max-h-[5000px]'
                            }`}
                          >
                            <div dangerouslySetInnerHTML={createSafeHTML(selectedDiscussion.content)} />
                          </div>

                          {/* The White Fade-Out Gradient (Inside relative container) */}
                          {!isTextExpanded && isLongText && (
                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                          )}
                        </div>

                        {/* The Toggle Button (Moved outside relative container to prevent clipping) */}
                        {isLongText && (
                          <button 
                            onClick={() => setIsTextExpanded(!isTextExpanded)}
                            className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold mt-2 focus:outline-none self-start bg-transparent border-none p-0 cursor-pointer"
                          >
                            {isTextExpanded ? "See less" : "See more..."}
                          </button>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* 3. IMAGE GRID */}
                {selectedDiscussion.images && selectedDiscussion.images.length > 0 && (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-900 w-full mt-2 flex-shrink-0">
                    <AnimatePresence mode="wait">
                      
                      {activeImageIndex === null ? (
                        <motion.div key="grid-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="w-full block">
                          {selectedDiscussion.images.length === 1 && (
                            <img src={selectedDiscussion.images[0]} alt="Attachment" className="w-full h-auto max-h-[500px] object-contain cursor-pointer hover:opacity-90 transition-opacity bg-black" onClick={() => setActiveImageIndex(0)} />
                          )}

                          {selectedDiscussion.images.length === 2 && (
                            <div className="grid grid-cols-2 gap-1 h-[300px] w-full bg-black">
                              {selectedDiscussion.images.map((img: string, i: number) => (
                                <img key={i} src={img} alt={`Attachment ${i+1}`} className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setActiveImageIndex(i)} />
                              ))}
                            </div>
                          )}

                          {selectedDiscussion.images.length >= 3 && (
                            <div className="grid grid-cols-5 gap-1 h-[400px] w-full bg-black">
                              <div className="col-span-3 h-full w-full">
                                <img src={selectedDiscussion.images[0]} alt="Attachment 1" className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setActiveImageIndex(0)} />
                              </div>
                              <div className="col-span-2 grid grid-rows-2 gap-1 h-full w-full">
                                <img src={selectedDiscussion.images[1]} alt="Attachment 2" className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setActiveImageIndex(1)} />
                                <img src={selectedDiscussion.images[2]} alt="Attachment 3" className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setActiveImageIndex(2)} />
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        
                        <motion.div key="gallery-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="relative w-full h-[500px] flex items-center justify-center bg-gray-950 group">
                          <button onClick={() => setActiveImageIndex(null)} className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-black/80 text-white rounded-full z-10 transition-colors"><X className="w-5 h-5" /></button>
                          {selectedDiscussion.images.length > 1 && (
                            <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex((prev) => prev === 0 ? selectedDiscussion.images.length - 1 : prev! - 1); }} className="absolute left-3 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full z-10 transition-colors opacity-0 group-hover:opacity-100"><ChevronLeft className="w-5 h-5" /></button>
                          )}
                          <img src={selectedDiscussion.images[activeImageIndex]} alt={`Gallery`} className="max-w-full max-h-full object-contain" />
                          {selectedDiscussion.images.length > 1 && (
                            <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex((prev) => prev === selectedDiscussion.images.length - 1 ? 0 : prev! + 1); }} className="absolute right-3 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full z-10 transition-colors opacity-0 group-hover:opacity-100"><ChevronRight className="w-5 h-5" /></button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* MESSAGES / REPLIES BLOCK */}
              <div className="space-y-8">
                {selectedDiscussion.messages?.map((level1Msg: any) => (
                  <div key={level1Msg.id} className="flex flex-col">
                    {/* Assuming MessageBlock exists in your scope */}
                    <MessageBlock message={level1Msg} level1ParentId={level1Msg.id} />
                    {level1Msg.children && level1Msg.children.length > 0 && (
                      <div className="mt-4 ml-8 md:ml-12 pl-2 flex flex-col gap-4">
                        {level1Msg.children.map((level2Msg: any) => (
                          {/* <MessageBlock key={level2Msg.id} message={level2Msg} isLevel2={true} level1ParentId={level1Msg.id} /> */}
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

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
                <button 
                  onClick={handleSendReply} 
                  disabled={isSubmitting || !newMessage.trim()}
                  className={`flex items-center justify-center flex-shrink-0 mb-[2px] h-[42px] px-3 md:px-4 rounded-xl shadow-sm transition-colors
                    ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} 
                    text-white`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}