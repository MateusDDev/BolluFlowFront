import { apiClient } from '@/shared/api/client'
import { UserModel } from '@/features/login/services/user.model'

export function login(email: string, password: string) {
    return apiClient<UserModel>('/auth/login', 'POST', {
        email,
        password,
    })
}

export function signUp(name: string, email: string, password: string) {
    return apiClient<UserModel>('/auth/sign-up', 'POST', {
        name,
        email,
        password,
    })
}

export function logout() {
    return apiClient('/auth/logout', 'POST')
}

export function me() {
    return apiClient<UserModel>('/auth/me', 'GET')
}
