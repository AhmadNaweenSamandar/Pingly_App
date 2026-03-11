import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, X, MapPin, User, Plus, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface User {
  id: string;
  name: string;
  avatar: string; // URL or Initials
}

//variables for schedule created
interface ScheduleEntry {
  id: number;
  user: User;
  activity: string;
  duration: string;
  description: string;
  location: string;
  time: Date;
  expiresAt: Date; // Auto-delete time
}

// Mock Database of users you have matched with
// In real app, this comes from backend relations
const myMatchedUserIds = ["u0", "u1", "u2"];

//Mock data created for schedule representation
const initialSchedules: ScheduleEntry[] = [
  {
    id: 1,
    user: { id: "u1", name: "Emma Wilson", avatar: "EW" },
    activity: "Study Session",
    duration: "2 hours",
    description: "Preparing for final exams - Mathematics",
    location: "Library, 2nd floor",
    time: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2), // Expires in 2h
  },
  {
    id: 2,
    user: { id: "u2", name: "Mike Ross", avatar: "MR" },
    activity: "Coffee Break",
    duration: "1 hour",
    description: "Quick coffee and chat about project ideas",
    location: "Campus Café",
    time: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
  },
];

/**
 * MatchingSchedule Component
 * * A social feed where users broadcast their current activity or study plans.
 * * Allows creating new posts and displaying them in a timeline format.
 */
export function MatchingSchedule() {
  // =========================================
  // State Definitions
  // =========================================

  // List of active schedules/posts.
  // 'initialSchedules' is imported mock data for the prototype.
  const [schedules, setSchedules] = useState<ScheduleEntry[]>(initialSchedules);

  // Toggles the visibility of the "Create Post" form/modal
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  //states for count me in button
  const [showCountMeInForm, setShowCountMeInForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<ScheduleEntry | null>(null);
  const [countMeInMessage, setCountMeInMessage] = useState("");

  // Controlled Input State for the new schedule form
  const [formData, setFormData] = useState({
    activity: "", // e.g., "Studying Calc"
    duration: "", // e.g., "2 hours"
    description: "", // e.g., "Library 3rd floor"
    location: "", // e.g., "CRX Building"
  });

  // =========================================
  // 1. AUTO-EXPIRATION LOGIC
  // =========================================

  /**
   * Helper: Converts duration string to Milliseconds
   */
  const getDurationMs = (durationStr: string): number => {
    const hour = 60 * 60 * 1000;

    switch (durationStr) {
      case "30 min":
        return 30 * 60 * 1000;
      case "1 hour":
        return 1 * hour;
      case "2 hours":
        return 2 * hour;
      case "3 hours":
        return 3 * hour;
      case "Half day":
        return 12 * hour; // 12 hours
      case "Full day":
        return 24 * hour; // 24 hours
      case "Weekend":
        return 24 * hour; // per your specific request
      default:
        return 1 * hour;
    }
  };

  // =========================================
  // 2. MATCHED-ONLY VISIBILITY LOGIC
  // =========================================

  /**
   * Filter the list to only show:
   * 1. My own posts ("You")
   * 2. Posts from users in 'myMatchedUserIds'
   */
  const visibleSchedules = schedules.filter((post) => {
    const isMe = post.user.name === "You";
    const isMatched = myMatchedUserIds.includes(post.user.id);
    return isMe || isMatched;
  });

  // =========================================
  // Handlers
  // =========================================

  /**
   * Handles the creation of a new schedule post.
   * Validates input, updates the list, and resets the form.
   */
  const handleSubmit = () => {
    // Simple Validation: Ensure required fields are present
    if (formData.activity && formData.duration) {
      const newSchedule: ScheduleEntry = {
        id: Date.now(), // Generate unique ID
        user: { id: "u0", name: "You", avatar: "YO" }, // Mock user data
        activity: formData.activity,
        duration: formData.duration,
        description: formData.description,
        location: formData.location,
        time: new Date(), // Capture creation time for "Just now" display
        expiresAt: new Date(),
      };

      // Update State: Prepend new item to the TOP of the list
      setSchedules([newSchedule, ...schedules]);

      // Cleanup: Reset form and close modal
      setFormData({
        activity: "",
        duration: "",
        description: "",
        location: "",
      });
      setShowScheduleForm(false);
    }
  };

  /**
   * Utility to format timestamps into relative strings.
   * @param {Date} date - The creation time of the post.
   * @returns {string} - "just now", "5m ago", "2h ago", etc.
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

  // count me in handler to open form and send message to schedule creator
  const handleCountMeIn = (schedule: ScheduleEntry) => {
    setSelectedSchedule(schedule);
    setShowCountMeInForm(true);
  };

  const handleSendCountMeIn = () => {
    if (countMeInMessage.trim()) {
      // In a real app, this would send a message to the schedule creator
      alert(
        `Message sent to ${selectedSchedule?.user.name}: ${countMeInMessage}`,
      );
      setCountMeInMessage("");
      setShowCountMeInForm(false);
      setSelectedSchedule(null);
    }
  };

  return (
    <>
      <motion.div
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-fit"
        whileHover={{
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-400 to-pink-500 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-gray-800">Matching Schedule</h3>
              <p className="text-gray-500">Plan your activities</p>
            </div>
          </div>
        </div>

        {/* Schedules List */}
        <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
          {schedules.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No schedules yet. Be the first to create one!</p>
            </div>
          ) : (
            schedules.map((schedule, index) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white flex-shrink-0">
                    {schedule.user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-gray-800">{schedule.user.name}</h4>
                      <span className="text-gray-400">
                        {getTimeAgo(schedule.time)}
                      </span>
                    </div>
                    <p className="text-orange-600 mb-1">{schedule.activity}</p>
                    <p className="text-gray-600 mb-2">{schedule.description}</p>
                    <div className="flex flex-wrap gap-2 text-gray-500 mb-3">
                      <span className="flex items-center gap-1 text-sm bg-white/50 px-2 py-1 rounded-lg">
                        <Clock className="w-3 h-3" />
                        {schedule.duration}
                      </span>
                      {schedule.location && (
                        <span className="flex items-center gap-1 text-sm bg-white/50 px-2 py-1 rounded-lg">
                          <MapPin className="w-3 h-3" />
                          {schedule.location}
                        </span>
                      )}
                    </div>
                    {schedule.user.name !== "You" && (
                      <Button
                        onClick={() => handleCountMeIn(schedule)}
                        size="sm"
                        className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-md"
                      >
                        Count Me In
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Schedule Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => setShowScheduleForm(true)}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
        </div>
      </motion.div>

      {/* Schedule Form Popup */}
      <AnimatePresence>
        {showScheduleForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={() => setShowScheduleForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4">
                <button
                  onClick={() => setShowScheduleForm(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                <h3 className="text-gray-800 mb-6">Create Matching Schedule</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-gray-700">
                      Activity Type
                    </label>
                    <Select
                      value={formData.activity}
                      onValueChange={(value) =>
                        setFormData({ ...formData, activity: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Study Session">
                          Study Session
                        </SelectItem>
                        <SelectItem value="Coffee Break">
                          Coffee Break
                        </SelectItem>
                        <SelectItem value="Lunch">Lunch</SelectItem>
                        <SelectItem value="Weekend Outing">
                          Weekend Outing
                        </SelectItem>
                        <SelectItem value="Movie Night">Movie Night</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Project Work">
                          Project Work
                        </SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-700">Duration</label>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) =>
                        setFormData({ ...formData, duration: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30 minutes">30 minutes</SelectItem>
                        <SelectItem value="1 hour">1 hour</SelectItem>
                        <SelectItem value="2 hours">2 hours</SelectItem>
                        <SelectItem value="3 hours">3 hours</SelectItem>
                        <SelectItem value="Half day">Half day</SelectItem>
                        <SelectItem value="Full day">Full day</SelectItem>
                        <SelectItem value="Weekend">Weekend</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-700">Location</label>
                    <Input
                      placeholder="e.g., Campus Library, Downtown Café"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-700">
                      Description
                    </label>
                    <Textarea
                      placeholder="Describe what you'd like to do..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowScheduleForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                    >
                      Submit Schedule
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Count Me In Form Popup */}
      <AnimatePresence>
        {showCountMeInForm && selectedSchedule && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              onClick={() => {
                setShowCountMeInForm(false);
                setSelectedSchedule(null);
                setCountMeInMessage("");
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4">
                <button
                  onClick={() => {
                    setShowCountMeInForm(false);
                    setSelectedSchedule(null);
                    setCountMeInMessage("");
                  }}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                <h3 className="text-gray-800 mb-2">Count Me In!</h3>
                <p className="text-gray-600 mb-6">
                  Send a message to{" "}
                  <span className="font-semibold text-orange-600">
                    {selectedSchedule.user.name}
                  </span>{" "}
                  about their {selectedSchedule.activity}
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border border-orange-200">
                    <p className="text-sm text-gray-600 mb-1">Activity</p>
                    <p className="text-gray-800">{selectedSchedule.activity}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {selectedSchedule.description}
                    </p>
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-700">
                      Your Message
                    </label>
                    <Textarea
                      placeholder="Let them know you're interested..."
                      rows={4}
                      value={countMeInMessage}
                      onChange={(e) => setCountMeInMessage(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCountMeInForm(false);
                        setSelectedSchedule(null);
                        setCountMeInMessage("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSendCountMeIn}
                      disabled={!countMeInMessage.trim()}
                      className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
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
