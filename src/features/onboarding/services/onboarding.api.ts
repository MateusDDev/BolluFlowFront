import { apiClient } from '@/shared/api/client'
import { UserModel } from '@/features/login/services/user.model'
import {
    CompleteOnboardingData,
    OnboardingProgressModel,
} from '@/features/onboarding/services/onboarding.model'

export function completeOnboarding(data: CompleteOnboardingData) {
    return apiClient<UserModel>('/onboarding/complete', 'POST', data)
}

export function getOnboardingProgress() {
    return apiClient<OnboardingProgressModel>('/onboarding/progress', 'GET')
}
