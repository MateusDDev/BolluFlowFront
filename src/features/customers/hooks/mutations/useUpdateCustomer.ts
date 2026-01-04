import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCustomer } from '@/features/customers/services/api/customer.api'
import { CustomerModel } from '@/features/customers/services/api/customer.model'

export function useUpdateCustomer() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number
            data: Partial<CustomerModel>
        }) => await updateCustomer(id, data),
        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['customers'] })
        },
    })
}
