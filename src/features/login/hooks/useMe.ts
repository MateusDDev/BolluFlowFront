'use client'

import { useQuery } from '@tanstack/react-query'
import { mapUserToUserModel } from '@/features/login/domain/user.mapper'
import { me } from '@/features/login/services/user.api.js'

export function useMe() {
    return useQuery({
        queryKey: ['auth', 'me'],
        queryFn: async () => {
            const res = await me()
            return mapUserToUserModel(res)
        },
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: false,
    })
}
