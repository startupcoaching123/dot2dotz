const API_BASE_URL = "http://localhost:8080/api";

export const getAccessToken = () => {
    return localStorage.getItem("accessToken");
};

export const setAccessToken = (token) => {
    localStorage.setItem("accessToken", token);
};

export const removeAccessToken = () => {
    localStorage.removeItem("accessToken");
};

export const refreshAccessToken = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
            method: "POST",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Refresh token invalid");
        }

        const data = await response.json();

        setAccessToken(data.accessToken);

        return data.accessToken;

    } catch (error) {
        removeAccessToken();
        window.location.href = "/login";
        return null;
    }
};