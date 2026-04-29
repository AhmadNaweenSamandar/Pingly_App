const API_BASE_URL = 'http://localhost:3000'; // Adjust to your backend URL

// Define the shape of the data we are sending
interface CreateIdeaPayload {
  title: string;
  description: string;
  skills: string[];
}

export const projectIdeasApi = {
  // --- 1. POST: Create a new project idea ---
  createIdea: async (payload: CreateIdeaPayload) => {
    const token = localStorage.getItem("access_token"); // jwt access token stored in localStorage after login 

    const response = await fetch(`${API_BASE_URL}/project-ideas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to post project idea');
    }

    return response.json();
  },

  // --- 2. GET: Fetch the feed with Cursor Pagination ---
  // The 'tab' parameter determines whether we want the 'latest' feed or the personalized 'forYou' feed.
  getFeed: async (tab: 'latest' | 'forYou', cursor?: string) => {
    // We retrieve the JWT token from localStorage to include in the Authorization header for authenticated requests.
    const token = localStorage.getItem("access_token");

    // Build the query string dynamically
    // We use URLSearchParams to construct the query string, which makes it easy to handle optional parameters like 'cursor'.
    const params = new URLSearchParams({ tab });
    if (cursor) {
      params.append('cursor', cursor);
    }

    // Make the GET request to the backend API with the appropriate query parameters and headers.
    const response = await fetch(`${API_BASE_URL}/project-ideas?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch the feed');
    }

    return response.json();
  },

  // --- 3. POST: Toggle a wish ---
  toggleWish: async (ideaId: string) => {
    const token = localStorage.getItem("access_token");
    
    const response = await fetch(`${API_BASE_URL}/project-ideas/${ideaId}/wish`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to toggle wish');
    return response.json();
  },
};