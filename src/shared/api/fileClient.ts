import { API_URL } from './config'

export async function fileClient(
    endpoint: string,
    options: RequestInit = {}
): Promise<Blob> {
    const token = localStorage.getItem('authToken')

    const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers ?? {}),
        },
        credentials: 'include',
        ...options,
    })

    if (!res.ok) {
        const contentType = res.headers.get('Content-Type') ?? ''

        if (contentType.includes('application/json')) {
            throw await res.json()
        }

        throw new Error(`Download error (${res.status})`)
    }

    return res.blob()
}
