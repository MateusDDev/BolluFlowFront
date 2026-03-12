import { useQuery } from '@tanstack/react-query'
import { getSupplyConversions } from '@/features/supplies/services/supplyConversion.api'

export function useGetSupplyConversions(supplyId: number, enabled = true) {
    return useQuery({
        queryKey: ['supply-conversions', supplyId],
        queryFn: async () => getSupplyConversions(supplyId),
        enabled: enabled && Number.isFinite(supplyId),
    })
}
