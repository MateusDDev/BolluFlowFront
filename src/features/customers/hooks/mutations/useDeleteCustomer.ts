import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCustomer } from '@/features/customers/services/api/customer.api'

export function useDeleteCustomer() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: deleteCustomer,
        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['customers'] })
        },
    })
}
