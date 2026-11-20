'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signUp } from '@/features/login/services/user.api.js'

type SignUpPayload = {
    name: string
    email: string
    password: string
}

export function useSignUp() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ name, email, password }: SignUpPayload) => {
            const user = await signUp(name, email, password)

            localStorage.setItem('authToken', user.token ?? '')

            return user
        },
        onSuccess: (user) => {
            queryClient.setQueryData(['auth', 'me'], user)
        },
    })
}
