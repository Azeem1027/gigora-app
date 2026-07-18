import { supabase } from './supabaseClient';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("gigora_token") || "";
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
    };
};

export const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = getAuthHeaders();

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
            headers["X-User-Id"] = session.user.id;
        }
    } catch (err) {
        console.error("Error retrieving auth session headers:", err);
    }

    const config = {
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
    };

    const response = await fetch(url, config);

    if (response.status === 401) {
        // Clear dead sessions gracefully
        localStorage.removeItem("gigora_token");
        window.location.href = "/login";
        throw new Error("Session expired. Please log in again.");
    }

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.detail || "An unexpected network error occurred.");
    }

    return result;
};