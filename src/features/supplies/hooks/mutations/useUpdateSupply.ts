import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    updateSupply,
    UpdateSupplyDataType,
} from '@/features/supplies/services/supply.api'

export function useUpdateSupply() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number
            data: UpdateSupplyDataType
        }) => updateSupply(id, data),
        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['supplies'] })
        },
        onError: (error) => console.error(error),
    })
}
