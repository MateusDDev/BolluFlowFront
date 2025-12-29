import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCustomer } from '@/features/customers/services/api/customer.api'
import { Customer } from '@/features/customers/domain/customer'

export function useUpdateCustomer() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Customer> }) =>
            updateCustomer(id, data),
        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['customers'] })
        },
    })
}
