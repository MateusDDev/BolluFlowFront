import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfile } from '@/features/profile/services/profile.api'
import { UpdateProfileDataType } from '@/features/profile/services/profile.model'

export function useUpdateProfile() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: UpdateProfileDataType) => updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
        },
    })
}
