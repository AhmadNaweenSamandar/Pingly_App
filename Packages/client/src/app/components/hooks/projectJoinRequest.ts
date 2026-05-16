// hooks/useJoinProject.ts
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { projectJoinRequestsApi } from '../api/projectIdeaApi/projectJoinRequestApi';

export const useJoinProject = (projectId: string, onClose: () => void) => {
  const [motivation, setMotivation] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const joinMutation = useMutation({
    mutationFn: (payload) => projectJoinRequestsApi.createRequest(payload),
    onSuccess: () => {
      setMotivation("");
      setSelectedSkills([]);
      onClose(); // Closes the modal
    },
  });

  const handleSendRequest = () => {
    if (!motivation.trim() || selectedSkills.length === 0) return;
    joinMutation.mutate({ projectIdeaId: projectId, skills: selectedSkills, motivation });
  };

  // Expose ONLY what the UI needs to render
  return {
    motivation,
    setMotivation,
    selectedSkills,
    setSelectedSkills,
    isPending: joinMutation.isPending,
    handleSendRequest,
    isSubmitDisabled: joinMutation.isPending || selectedSkills.length === 0 || !motivation.trim()
  };
};