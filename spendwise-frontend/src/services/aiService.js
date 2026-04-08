const AI_API_BASE = import.meta.env.VITE_AI_API_URL || "http://localhost:8000/api";

export const aiService = {
  async sendMessage(question, jwtToken) {
    try {
      const response = await fetch(`${AI_API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
          jwt_token: jwtToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI Service Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to get AI response:", error);
      throw error;
    }
  },

  async healthCheck() {
    try {
      const response = await fetch(`${AI_API_BASE}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },
};