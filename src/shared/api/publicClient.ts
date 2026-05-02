import { API_URL } from './config'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type PublicApiError = Error & {
    status: number
    code?: string
}

export async function publicApiClient<T>(
    endpoint: string,
    method: HttpMethod = 'GET',
    body?: unknown,
    options: RequestInit = {}
): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        credentials: 'omit',
        body: body ? JSON.stringify(body) : undefined,
        ...options,
    })

    const contentType = response.headers.get('Content-Type') ?? ''

    if (!response.ok) {
        if (contentType.includes('application/json')) {
            const data = (await response.json()) as {
                code?: string
                message?: string
            }

            const error = new Error(
                data.message ?? `API Error (${response.status})`
            ) as PublicApiError

            error.status = response.status
            error.code = data.code

            throw error
        }

        const error = new Error(
            `API Error (${response.status})`
        ) as PublicApiError
        error.status = response.status

        throw error
    }

    return contentType.includes('application/json')
        ? ((await response.json()) as T)
        : (undefined as T)
}
