import { API_URL } from './config'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type ApiError = {
    code: string
    message: string
    details?: Record<string, unknown>
}

export class ApiRequestError extends Error {
    readonly code: string
    readonly details: Record<string, unknown>

    constructor(error: ApiError) {
        super(error.message || 'Ocorreu um erro ao processar a requisição')
        this.code = error.code
        this.details = error.details ?? {}
    }
}

export async function apiClient<T>(
    endpoint: string,
    method: HttpMethod = 'GET',
    body?: unknown,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('authToken')

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
    }

    let res: Response

    try {
        res = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers,
            credentials: 'include',
            body: body ? JSON.stringify(body) : undefined,
            ...options,
        })
    } catch {
        throw new Error('Servidor indisponível. Tente novamente mais tarde.')
    }

    const contentType = res.headers.get('Content-Type') ?? ''

    if (!res.ok) {
        if (contentType.includes('application/json')) {
            throw new ApiRequestError((await res.json()) as ApiError)
        }

        throw new Error(`Erro (${res.status})`)
    }

    return contentType.includes('application/json')
        ? res.json()
        : (undefined as T)
}
