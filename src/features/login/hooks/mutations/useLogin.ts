'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { mapUserToUserModel } from '@/features/login/domain/user.mapper'
import { login } from '@/features/login/services/user.api.js'

type LoginPayload = {
    email: string
    password: string
}

export function useLogin() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ email, password }: LoginPayload) => {
            const res = await login(email, password)

            const user = mapUserToUserModel(res)

            localStorage.setItem('authToken', user.token ?? '')

            return user
        },

        onSuccess: (user) => {
            queryClient.setQueryData(['auth', 'me'], user)
        },

        onError: (err) => {
            console.error('Erro ao fazer login:', err)
        },
    })
}
