// src/api/projectJoinRequestsApi.ts
import { apiClient } from '../apiClient'; // Import our global engine

// ---------------------------------------------------------
// TYPES & INTERFACES
// It is exactly as our backend expects, 
// so we can directly pass these objects to Axios without transformation.
// ---------------------------------------------------------
export interface CreateJoinRequestPayload {
  projectIdeaId: string;
  skills: string[];
  motivation: string;
}

export interface JoinRequestResponse {
  id: string;
  userId: string;
  projectIdeaId: string;
  userMessage: string;
  userSkills: string[];
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  createdAt: string;
  user: {
    id: string;
    name: string;
    profilePicture: string | null;
    university: string | null;
  };
}

// ---------------------------------------------------------
// API METHODS
// ---------------------------------------------------------
export const projectJoinRequestsApi = {
  
  /**
   * 1. CREATE JOIN REQUEST
   * Submits an application for a project idea.
   */
  createRequest: async (payload: CreateJoinRequestPayload) => {
    // Axios automatically stringifies the payload and throws on 400/500 errors
    const response = await apiClient.post('/projects/join', payload);
    return response.data; 
  },

  /**
   * 2. GET PENDING REQUESTS
   * Fetches all pending applications for a specific project.
   */
  getPendingRequests: async (ideaId: string): Promise<JoinRequestResponse[]> => {
    const response = await apiClient.get(`/projects/${ideaId}/requests`);
    return response.data;
  },

  // ---------------------------------------------------------
  // DEFERRED ENDPOINTS
  // ---------------------------------------------------------
  // acceptRequest: async (requestId: string) => { ... },
  // rejectRequest: async (requestId: string) => { ... },
};