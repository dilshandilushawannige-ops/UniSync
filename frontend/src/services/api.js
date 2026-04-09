import axios from "axios";

/**
 * Base axios instance used by all service files.
 * Set the backend URL here — change it if your backend runs on a different port.
 */
const api = axios.create({
  baseURL: "http://localhost:8080/api", // Spring Boot backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
