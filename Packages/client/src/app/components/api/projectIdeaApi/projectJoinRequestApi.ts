// ---------------------------------------------------------
// TYPES & INTERFACES (Maintainability)
// ---------------------------------------------------------

// Maps exactly to our backend CreateJoinRequestDto
export interface CreateJoinRequestPayload {
  projectIdeaId: string;
  skills: string[];
  motivation: string;
}

// Maps to the backend response for the Owner's Dashboard
export interface JoinRequestResponse {
  id: string;
  userId: string;
  projectIdeaId: string;
  userMessage: string;
  userSkills: string[];
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  createdAt: string;
  // Included relation from our backend query
  user: {
    id: string;
    name: string;
    profilePicture: string | null;
    university: string | null;
  };
}

// ---------------------------------------------------------
// API METHODS (Scalability)
// ---------------------------------------------------------
const API_BASE_URL = 'http://localhost:3000/api';

// We export a single cohesive object so it's easy to import and mock in tests.
export const projectJoinRequestsApi = {
  
  /**
   * 1. CREATE JOIN REQUEST
   * Submits an application for a project idea.
   * Backend Route: POST /projects/join
   */
  createRequest: async (payload: CreateJoinRequestPayload) => {
    const token = localStorage.getItem("access_token"); // jwt access token stored in localStorage after login 
    // Replace 'apiClient' with your actual configured Axios or fetch wrapper
    // The JWT token should be automatically attached by your HTTP client
    const response = await fetch(`${API_BASE_URL}/projects/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    return response.json(); 
  },

  /**
   * 2. GET PENDING REQUESTS
   * Fetches all pending applications for a specific project. (Owner Only)
   * Backend Route: GET /projects/:ideaId/requests
   */
  getPendingRequests: async (ideaId: string): Promise<JoinRequestResponse[]> => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/projects/${ideaId}/requests`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  // ---------------------------------------------------------
  // DEFERRED ENDPOINTS (To be implemented with Notifications)
  // ---------------------------------------------------------
  // acceptRequest: async (requestId: string) => { ... },
  // rejectRequest: async (requestId: string) => { ... },
};