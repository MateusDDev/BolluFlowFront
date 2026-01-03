import { useQuery } from '@tanstack/react-query'
import { getCustomers } from '@/features/customers/services/api/customer.api'

export function useGetOrderCustomers() {
    return useQuery({
        queryKey: ['orderCustomers'],

        queryFn: async () => getCustomers(),
    })
}
