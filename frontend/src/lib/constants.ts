export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://securenotes-api.alextesting.ninja"
    : "http://localhost:5000";
