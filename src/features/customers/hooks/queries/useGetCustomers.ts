import { useQuery } from '@tanstack/react-query'
import { getCustomers } from '@/features/customers/services/api/customer.api'
import { mapCustomerModel } from '@/features/customers/domain/customer.mapper'

export function useGetCustomers(id: number) {
    return useQuery({
        queryKey: ['customers', id],

        queryFn: async () => {
            const data = await getCustomers(id)
            return (data.value ?? []).map(mapCustomerModel)
        },
    })
}
