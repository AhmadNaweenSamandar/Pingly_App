// hooks/useJoinProject.ts
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { 
  projectJoinRequestsApi, 
  CreateJoinRequestPayload 
} from '../api/projectJoinRequestApi'; 

export const useJoinProject = (projectId: string, onClose: () => void) => {
  const [motivation, setMotivation] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const joinMutation = useMutation({
    // THE FIX: Explicitly tell TypeScript the type of the payload here!
    mutationFn: (payload: CreateJoinRequestPayload) => 
      projectJoinRequestsApi.createRequest(payload),
      
    onSuccess: () => {
      setMotivation("");
      setSelectedSkills([]);
      onClose(); // Closes the modal
      // Optional: toast.success("Request sent!");
    },
    onError: (error: Error) => {
      console.error("Join request failed:", error.message);
      // Optional: toast.error(error.message);
    }
  });

  const handleSendRequest = () => {
    // Efficiency: Don't fire if validation fails
    if (!motivation.trim() || selectedSkills.length === 0) return;

    joinMutation.mutate({ 
      projectIdeaId: projectId, 
      skills: selectedSkills, 
      motivation 
    });
  };

  const handleCancel = () => {
    setMotivation("");
    setSelectedSkills([]);
    onClose();
  };

  // Expose exactly what the UI needs
  return {
    motivation,
    setMotivation,
    selectedSkills,
    setSelectedSkills,
    isPending: joinMutation.isPending,
    handleSendRequest,
    handleCancel,
    isSubmitDisabled: joinMutation.isPending || selectedSkills.length === 0 || !motivation.trim()
  };
};