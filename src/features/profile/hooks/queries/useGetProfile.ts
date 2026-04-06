import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/features/profile/services/profile.api'

export function useGetProfile(enabled: boolean = true) {
    return useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
        enabled,
    })
}
