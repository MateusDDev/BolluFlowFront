import { useQuery } from '@tanstack/react-query'
import { getCustomers } from '@/features/customers/services/api/customer.api'
import { mapCustomerModel } from '@/features/customers/domain/customer.mapper'

export function useGetCustomers() {
    return useQuery({
        queryKey: ['customers'],

        queryFn: async () => {
            const customers = await getCustomers()
            return customers.map(mapCustomerModel)
        },
    })
}
