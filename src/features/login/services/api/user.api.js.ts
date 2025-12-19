import { apiClient } from '@/shared/api/client'
import { ResultOf } from '@/shared/types/result'
import { UserModel } from '@/features/login/services/api/user.model'

export function login(email: string, password: string) {
    return apiClient<ResultOf<UserModel>>('/auth/login', 'POST', {
        email,
        password,
    })
}

export function me() {
    return apiClient<ResultOf<UserModel>>('/auth/me', 'GET')
}
