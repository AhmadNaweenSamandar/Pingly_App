import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../../../app/components/ui/button'; // Adjust your import paths
import { Textarea } from '../../../app/components/ui/textarea';
import { useJoinProject } from '../hooks/projectJoinRequest';
import { professionalSkills } from '../../../../data/professionalSkills';

interface JoinProjectModalProps {
  project: {
    id: string;
    user: { name: string };
  };
  isOpen: boolean;
  onClose: () => void;
}

export const JoinProjectModal: React.FC<JoinProjectModalProps> = ({ 
  project, 
  isOpen, 
  onClose 
}) => {
  // 1. Pull in all our business logic from the Custom Hook
  const { 
    motivation, 
    setMotivation, 
    selectedSkills, 
    setSelectedSkills, 
    isPending, 
    handleSendRequest, 
    handleCancel, 
    isSubmitDisabled 
  } = useJoinProject(project.id, onClose);

  // 2. UI Helpers for array manipulation
  const handleAddSkill = (skill: string) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skillToRemove));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCancel} // Use the hook's cancel to clean up state if they click outside
          />

          {/* Modal Window Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isPending}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Form Header */}
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Join Project: {project.user.name}'s Idea
            </h3>

            <div className="space-y-6">
              
              {/* Field: Skills */}
              <div>
                <label htmlFor="joinRequestSkills" className="block mb-2 text-sm font-medium text-gray-700">
                  Your Skills
                </label>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedSkills.length === 0 && (
                    <span className="text-sm text-gray-500 italic">No skills selected yet.</span>
                  )}
                  {selectedSkills.map(skill => (
                    <span 
                      key={skill} 
                      className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 border border-blue-200"
                    >
                      {skill}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-red-600 transition-colors focus:outline-none"
                        aria-label={`Remove ${skill}`}
                        disabled={isPending}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>

                <select
                  id="joinRequestSkills"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onChange={(e) => {
                    handleAddSkill(e.target.value);
                    e.target.value = ""; 
                  }}
                  defaultValue=""
                  disabled={isPending}
                >
                  <option value="" disabled>Select a skill to add...</option>
                  {professionalSkills
                    .filter(skill => !selectedSkills.includes(skill)) 
                    .sort() 
                    .map(skill => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))
                  }
                </select>
              </div>

              {/* Field: Motivation Message */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Why do you want to join?
                </label>
                <Textarea
                  placeholder="Tell the project owner why you're interested..."
                  rows={4}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  disabled={isPending}
                />
              </div>

              {/* Action Footer */}
              <div className="flex gap-3 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isPending} 
                >
                  Cancel
                </Button>

                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                  onClick={handleSendRequest}
                  disabled={isSubmitDisabled}
                >
                  {isPending ? "Sending..." : "Send Join Request"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};