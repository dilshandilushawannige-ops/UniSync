import api from "./api";

export const loginUser = async (loginData) => {
    try {
        const response = await api.post("/auth/login", loginData);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || "Login failed";
        throw new Error(message);
    }
};

export const checkAuth = async () => {
    const response = await api.get("/auth/check");
    return response.data;
};
