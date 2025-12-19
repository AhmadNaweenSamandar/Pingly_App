import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, ArrowUp } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";

//Static dicussion instances for checking discussion.
const discussionsData = [
  {
    rank: 1,
    title: "Best frameworks for full-stack development in 2024",
    author: "Alex Rivera",
    replies: 47,
    messages: [
      { user: "Alex Rivera", text: "What are your thoughts on the best frameworks for full-stack development this year?", time: "2 hours ago" },
      { user: "Jamie Lee", text: "I've been loving Next.js with Supabase for the backend. The DX is amazing!", time: "1 hour ago" },
      { user: "Sam Chen", text: "SvelteKit is also worth considering. Super fast and the learning curve is gentle.", time: "45 min ago" }
    ]
  },
  {
    rank: 2,
    title: "How to prepare for technical interviews?",
    author: "Jordan Kim",
    replies: 34,
    messages: [
      { user: "Jordan Kim", text: "Any tips for acing technical interviews at top tech companies?", time: "4 hours ago" },
      { user: "Taylor Smith", text: "Practice on LeetCode daily and do mock interviews with peers.", time: "3 hours ago" }
    ]
  },
  {
    rank: 3,
    title: "Understanding async/await in JavaScript",
    author: "Casey Johnson",
    replies: 28,
    messages: [
      { user: "Casey Johnson", text: "Can someone explain async/await in simple terms?", time: "5 hours ago" },
      { user: "Morgan Davis", text: "Think of it as a way to write asynchronous code that looks synchronous!", time: "4 hours ago" }
    ]
  },
  {
    rank: 4,
    title: "Best practices for Git workflow",
    author: "River Thompson",
    replies: 22,
    messages: [
      { user: "River Thompson", text: "What Git workflow do you use in your team?", time: "6 hours ago" }
    ]
  },
  {
    rank: 5,
    title: "Docker vs VM: When to use what?",
    author: "Quinn Martinez",
    replies: 19,
    messages: [
      { user: "Quinn Martinez", text: "I'm confused about when to use Docker vs traditional VMs.", time: "8 hours ago" }
    ]
  }
];

export function Discussion() {


//State Management

  /*
   * 1. Selected Discussion State
   * Purpose: Tracks which specific chat thread the user is currently viewing.
   * Type Definition: 
   * - `typeof discussionsData[0]`: Infers the shape of the state from mock data.
   * - `| null`: Allows the state to be empty (e.g., on initial load).
   * Initial Value: null (No discussion open by default).
   */
  const [selectedDiscussion, setSelectedDiscussion] = useState<typeof discussionsData[0] | null>(null);

  /**
   * 2. Message Input State
   * Purpose: Controls the value of the text input field (Controlled Component).
   * Initial Value: Empty string.
   */
  const [newMessage, setNewMessage] = useState("");


  //Handler

  /**
   * handleSendMessage
   * Purpose: Validates input and triggers the "send" logic.
   * Triggered by: Form submission or "Send" button click.
   */
  const handleSendMessage = () => {
    // Validation: .trim() removes whitespace from both ends.
    // If the string is empty after trimming, it evaluates to false (falsy), skipping the block.
    if (newMessage.trim()) {
      // TODO: Connect to Backend
      // In a production environment, I would call an API endpoint here.
      // Example: await api.post('/messages', { chatId: selectedDiscussion.id, text: newMessage });
      console.log("Sending message:", newMessage);

      // UX Pattern: Clear the input field immediately after sending
      // to allow the user to type their next message.
      setNewMessage("");
    }
  };

  return (
    <>
      <motion.div
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-fit"
        whileHover={{ boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-gray-800">Hot Discussions</h3>
            <p className="text-gray-500">Most active conversations</p>
          </div>
        </div>

        <div className="space-y-3">
        {/* ITERATION
          * We map through the 'discussionsData' array. 
          * 'index' is used to calculate the animation delay.
            */}
          {discussionsData.map((discussion, index) => (
            // MOTION WRAPPER
            // Uses Framer Motion to animate the entry of each list item.
            <motion.div
            // KEY: React needs a unique key for list items. 
            // Ideally, use a unique ID (discussion.id) rather than rank if possible.
              key={discussion.rank}
              // ANIMATION PROPS
            // Initial: Starts invisible (opacity 0) and slightly shifted left (x: -20)
              initial={{ opacity: 0, x: -20 }}
              // Animate: Fades in to 100% and moves to natural position (x: 0)
              animate={{ opacity: 1, x: 0 }}
              // Transition: Creates a "Staggered" effect. 
                // Item 0 waits 0s, Item 1 waits 0.1s, Item 2 waits 0.2s, etc.
              transition={{ delay: index * 0.1 }}
              // STYLING (Tailwind)
            // 'group': Marks this container as a parent group. 
            // Child elements can change style when this parent is hovered (see group-hover below).
              className="p-4 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 cursor-pointer transition-all group border border-transparent hover:border-indigo-200"
              // INTERACTION
            // Updates the state variable 'selectedDiscussion' defined in const code.
              onClick={() => setSelectedDiscussion(discussion)}
            >
              <div className="flex items-start gap-3">
                {/* RANK BADGE / AVATAR */}
                {/* 'flex-shrink-0': Prevents the circle from squishing if the text is too long */}
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex-shrink-0">
                  {discussion.rank}
                </div>
                
                {/* CONTENT CONTAINER */}
                {/* 'min-w-0': Crucial Flexbox hack. Allows text truncation (line-clamp) to work inside a flex child. */}
                <div className="flex-1 min-w-0">
                {/* TITLE */}
                {/* 'group-hover:text-indigo-600': When the PARENT (motion.div) is hovered, this TEXT turns indigo. */}
                {/* 'line-clamp-2': Cuts off text after 2 lines and adds '...' */}
                  <h4 className="text-gray-800 group-hover:text-indigo-600 transition-colors mb-1 line-clamp-2">
                    {discussion.title}
                  </h4>

                  {/* METADATA (Author & Replies) */}
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>{discussion.author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {discussion.replies} replies
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Discussion Detail Popup: it will pop up discussion detail where user can send and receive new discussion */}
      <AnimatePresence>
        {/* CONDITIONAL RENDERING
          * The modal only exists in the DOM if 'selectedDiscussion' is not null. 
          */}
        {selectedDiscussion && (
          <>
          {/* ------------------------------------------------------------------
            * LAYER 1: THE BACKDROP (Overlay)
            * This is the dark background behind the popup.
            * ------------------------------------------------------------------ */}
            <motion.div
            // ANIMATION: Simple fade in/out
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              // STYLING:
            // 'fixed inset-0': Pins the div to all 4 corners of the screen.
            // 'z-50': Ensures this sits on top of everything else on the page.
            // 'backdrop-blur-sm': Applies a frosted glass effect to the content BEHIND the overlay.
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            // INTERACTION:
            // Clicking strictly on the background sets the state to null, closing the modal.
              onClick={() => setSelectedDiscussion(null)}
            />

            {/* ------------------------------------------------------------------
              * LAYER 2: THE MODAL CONTAINER
              * This is the actual floating window.
              * ------------------------------------------------------------------ */}
            <motion.div
            // ANIMATION: "Pop" effect.
            // Starts slightly smaller (scale 0.9) and lower (y: 20), then grows and rises into place.
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}

            // STYLING (Centering Hack):
            // 'fixed top-1/2 left-1/2': Puts the top-left corner of the div in the exact center of screen.
            // '-translate-x-1/2 -translate-y-1/2': Shifts the div back by 50% of its own width/height 
            // to achieve perfect centering.
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl max-h-[80vh] flex flex-col"

            // CRITICAL INTERACTION: Event Bubbling Prevention
            // Without this, clicking INSIDE the white box would "bubble up" to the backdrop 
            // and trigger the close action. This forces the click to stop here.
              onClick={(e) => e.stopPropagation()}
            >

                {/* HEADER CONTAINER 
                    - 'flex-shrink-0': This is CRITICAL. In a flex-column layout (the modal), 
                    if the content below (messages) gets very long, CSS might try to "squish" the header 
                    to make room. This forces the header to stay its full size no matter what.
                    - 'border-b': Adds a subtle line to separate the header from the scrollable chat area.
                */}

              <div className="bg-white rounded-2xl shadow-2xl mx-4 flex flex-col max-h-full">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex-shrink-0">

                {/* CLOSE BUTTON
                    - 'absolute top-4 right-4': Removes the button from the normal flow and pins it 
                    to the top-right corner of the parent container.
                    - 'z-10': Ensures the button stays clickable even if other elements overlap it.
                */}
                  <button
                    onClick={() => setSelectedDiscussion(null)}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>

                {/* CONTENT WRAPPER 
                    - 'pr-10': (Padding Right 40px). This adds empty space on the right side of the text.
                    - WHY? Because we have an 'absolute' close button on the right. Without this padding, 
                    a long title would run underneath the X button and become unreadable.
                */}
                  <div className="flex items-start gap-3 pr-10">

                    {/* AVATAR CIRCLE 
                    - 'flex-shrink-0': Prevents the circle from becoming an oval if the title text is long.
                    */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                    {/* INITIALS GENERATOR LOGIC
                        1. selectedDiscussion.author ('John Doe')
                        2. .split(' ')  -> ['John', 'Doe']
                        3. .map(n => n[0]) -> ['J', 'D']
                        4. .join('')    -> 'JD'
                    */}
                      {selectedDiscussion.author.split(' ').map(n => n[0]).join('')}
                    </div>

                    {/* TEXT CONTAINER 
                    - 'min-w-0': The standard Flexbox hack to allow text truncation inside a flex child.
                    */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-800 mb-2">{selectedDiscussion.title}</h3>
                      <div className="flex items-center gap-2 text-gray-500">
                        <span>by {selectedDiscussion.author}</span>
                        <span>•</span>
                        <span>{selectedDiscussion.replies} replies</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}

                {/* SCROLLABLE CONTAINER
                - 'ScrollArea': This is likely a custom component (or from a library like Shadcn/Radix).
                If you don't have this component, you can replace it with:
                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
      
                - 'flex-1': This is the MOST IMPORTANT class here.
                It tells this container: "Take up all available height that isn't used by the Header or the Footer."
                This pushes the Footer to the bottom and ensures the scrollbar only appears inside this middle section.
                */}
                <ScrollArea className="flex-1 p-6">

                {/* MESSAGE STACK
                - 'space-y-4': Adds distinct vertical spacing between each message block.
                */}
                  <div className="space-y-4">
                    {selectedDiscussion.messages.map((message, index) => (

                    // ANIMATED MESSAGE CARD
                      <motion.div
                        key={index} // Ideally use message.id if available, but index works for static data

                        // ANIMATION: "Slide Up & Fade In"
                        // Starts slightly transparent and lower (y: 10)
                        initial={{ opacity: 0, y: 10 }}
                        // Moves to natural position (y: 0) and full opacity
                        animate={{ opacity: 1, y: 0 }}
                        // STAGGER EFFECT:
                        // Message 1 waits 0.1s, Message 2 waits 0.2s, etc.
                        // This creates a pleasing "waterfall" effect as the chat loads.
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-3"
                      >

                        {/* AVATAR
                        - 'flex-shrink-0': Ensures the avatar stays circular (8x8) 
                        even if the message text is huge.
                        */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                          {message.user.split(' ').map(n => n[0]).join('')}
                        </div>

                        {/* MESSAGE CONTENT */}
                        <div className="flex-1">

                        {/* METADATA LINE (User Name & Time) */}
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-gray-800">{message.user}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">{message.time}</span>
                          </div>

                        {/* TEXT BODY 
                            - 'text-gray-700': standard readable dark gray.
                            - Note: For a real chat, you might need 'break-words' here 
                            to prevent long URLs from breaking the layout.
                        */}
                          <p className="text-gray-700">{message.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Reply Input */}

                {/* FOOTER CONTAINER
                    - 'flex-shrink-0': Like the Header, we force this container to keep its size.
                    It will never shrink, even if the message list above it gets huge.
                    - 'border-t': Adds a visual separator between the messages and the input area.
                */}
                <div className="p-6 border-t border-gray-200 flex-shrink-0">
                {/* FLEX WRAPPER
                    - Aligns the Textarea and Button side-by-side.
                */}
                  <div className="flex gap-3">

                {/* TEXT INPUT
                    - This is likely a custom component wrapping a standard <textarea>.
                */}
                    <Textarea
                    // STATE BINDING (Controlled Component)
                    // The input always reflects the 'newMessage' state variable.
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Contribute to the discussion..."

                      // LAYOUT
                    // 'rows={2}': Sets the initial height to show 2 lines of text.
                    // 'resize-none': Prevents the user from dragging the corner to resize the box,
                    // which often breaks the layout in fixed modals.
                      rows={2}
                      className="flex-1 resize-none"

                    // KEYBOARD HANDLING (Crucial UX)
                      onKeyDown={(e) => {
                    // CHECK: Is the key "Enter"?
                    // CHECK: Is the Shift key NOT held down?
                        if (e.key === 'Enter' && !e.shiftKey) {

                        // PREVENT DEFAULT: 
                        // Normally, 'Enter' adds a new line (\n) to the text box.
                        // We stop that because we want to SEND instead.
                          e.preventDefault();

                        // ACTION: Trigger the send function.
                          handleSendMessage();
                        }

                        // If Shift+Enter is pressed, this block is skipped, 
                        // allowing the default behavior (new line) to happen.
                      }}
                    />
                    {/* SEND BUTTON
                        - 'self-end': Flexbox alignment property.
                        Since the text area has 'rows={2}', it is taller than the button.
                        'self-end' pushes the button to the BOTTOM of the row, aligning it 
                        with the last line of text.
                    */}
                    <Button
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 self-end"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
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
