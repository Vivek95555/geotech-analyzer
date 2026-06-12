// API base URL — uses environment variable in production, localhost in development
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default API_URL;
