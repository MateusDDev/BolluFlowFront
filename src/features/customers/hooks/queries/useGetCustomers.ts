import { useQuery } from '@tanstack/react-query'
import { getCustomers } from '@/features/customers/services/api/customer.api'

export function useGetCustomers() {
    return useQuery({
        queryKey: ['customers'],

        queryFn: async () => await getCustomers(),
    })
}
