'use client'

import { useQuery } from '@tanstack/react-query'
import { me } from '@/features/login/services/user.api.js'

export function useMe() {
    return useQuery({
        queryKey: ['auth', 'me'],
        queryFn: async () => await me(),
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: false,
    })
}
