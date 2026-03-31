import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createSupply,
    CreateSupplyDataType,
} from '@/features/supplies/services/supply.api'

export function useCreateSupply() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateSupplyDataType) => createSupply(data),
        onSuccess: async (createdSupply) => {
            await client.invalidateQueries({ queryKey: ['supplies'] })
            await client.invalidateQueries({
                queryKey: ['supply-conversions', createdSupply.id],
            })
        },
        onError: (error) => console.error(error),
    })
}
