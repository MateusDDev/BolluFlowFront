import { useMutation } from '@tanstack/react-query'
import { createPublicOrder } from '@/features/menu/services/menu.api'
import { CreatePublicOrderDataType } from '@/features/menu/types/menu.types'

export function useCreateMenuOrder(slug: string) {
    return useMutation({
        mutationFn: (data: CreatePublicOrderDataType) =>
            createPublicOrder(slug, data),
    })
}
