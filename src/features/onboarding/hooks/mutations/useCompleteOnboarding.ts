import { useMutation, useQueryClient } from '@tanstack/react-query'
import { completeOnboarding } from '@/features/onboarding/services/onboarding.api'
import { CompleteOnboardingData } from '@/features/onboarding/services/onboarding.model'

export function useCompleteOnboarding() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: CompleteOnboardingData) =>
            completeOnboarding(data),
        onSuccess: async (user) => {
            queryClient.setQueryData(['auth', 'me'], user)
            await queryClient.invalidateQueries({ queryKey: ['profile'] })
        },
    })
}
