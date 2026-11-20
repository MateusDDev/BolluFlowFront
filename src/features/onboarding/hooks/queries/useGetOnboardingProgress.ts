import { useQuery } from '@tanstack/react-query'
import { getOnboardingProgress } from '@/features/onboarding/services/onboarding.api'

export function useGetOnboardingProgress() {
    return useQuery({
        queryKey: ['onboarding', 'progress'],
        queryFn: getOnboardingProgress,
    })
}
