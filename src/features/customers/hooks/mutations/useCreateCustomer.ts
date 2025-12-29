import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCustomer } from '@/features/customers/services/api/customer.api'
import { mapCustomerModel } from '@/features/customers/domain/customer.mapper'

export type CreateCustomerInput = {
    name: string
    whatsapp: string
    preferences?: string
    birthday?: Date
    deliveryAddress: {
        street: string
        number: number
        neighborhood: string
    }
}

export function useCreateCustomer() {
    const client = useQueryClient()

    return useMutation({
        mutationFn: async (data: CreateCustomerInput) => {
            const customer = await createCustomer(data)
            return mapCustomerModel(customer)
        },

        onSuccess: async () => {
            await client.invalidateQueries({ queryKey: ['customers'] })
        },

        onError: (error) => {
            console.error(error)
        },
    })
}
