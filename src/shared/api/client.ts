import { API_URL } from "./config";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function apiClient<T>(
    endpoint: string,
    method: HttpMethod = "GET",
    body?: unknown,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem("authToken");

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {})
    };

    const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
        ...options,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API Error (${res.status}): ${text}`);
    }

    const contentType = res.headers.get("Content-Type") ?? "";
    return contentType.includes("application/json")
        ? res.json()
        : (undefined as T);
}
