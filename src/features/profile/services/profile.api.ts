import { apiClient } from '@/shared/api/client'
import {
    ProfileModel,
    UpdateProfileDataType,
} from '@/features/profile/services/profile.model'

export function getProfile() {
    return apiClient<ProfileModel>('/profile', 'GET')
}

export function updateProfile(data: UpdateProfileDataType) {
    return apiClient<ProfileModel>('/profile', 'PUT', data)
}
