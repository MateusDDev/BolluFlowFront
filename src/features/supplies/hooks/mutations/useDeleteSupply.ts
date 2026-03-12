import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteSupply } from '@/features/supplies/services/supply.api'

export function useDeleteSupply() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async (id: number) => deleteSupply(id),
        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['supplies'] })
        },
    })
}
