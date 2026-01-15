'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { logout } from '@/features/login/services/user.api.js'

export function useLogout() {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn: async () => {
            await logout()
            localStorage.removeItem('authToken')
        },

        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['auth'] })
            router.push('/login')
        },

        onError: (err) => {
            console.error('Erro ao fazer logout:', err)

            localStorage.removeItem('authToken')
            queryClient.clear()
            router.push('/login')
        },
    })
}
