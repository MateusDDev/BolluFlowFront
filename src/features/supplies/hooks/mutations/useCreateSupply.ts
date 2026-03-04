import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createSupply,
    CreateSupplyDataType,
} from '@/features/supplies/services/supply.api'

export function useCreateSupply() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateSupplyDataType) => createSupply(data),
        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['supplies'] })
        },
        onError: (error) => console.error(error),
    })
}
