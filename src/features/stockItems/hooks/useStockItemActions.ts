import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    adjustStockItem,
    createStockItemPackage,
    deleteStockItem,
    deleteStockItemPackage,
    getStockItemPackages,
    registerStockItemPurchase,
} from '@/features/stockItems/services/stockItem.api'
import { StockItemConfig } from '@/features/stockItems/services/stockItem.config'
import { showTipOnce } from '@/shared/onboarding/tips'

function useInvalidateStockItem(config: StockItemConfig) {
    const queryClient = useQueryClient()

    return () =>
        Promise.all(
            [
                [config.queryKey],
                [config.conversionsQueryKey],
                ['products'],
                ['recipes'],
                ['finance'],
                ['dashboard'],
                ['onboarding'],
            ].map((queryKey) => queryClient.invalidateQueries({ queryKey }))
        )
}

export function useStockItemPackages(
    config: StockItemConfig,
    itemId: number,
    enabled = true
) {
    return useQuery({
        queryKey: [config.conversionsQueryKey, itemId],
        queryFn: () => getStockItemPackages(config, itemId),
        enabled,
    })
}

export function usePurchaseStockItem(config: StockItemConfig) {
    const invalidate = useInvalidateStockItem(config)

    return useMutation({
        mutationFn: (data: Parameters<typeof registerStockItemPurchase>[1]) =>
            registerStockItemPurchase(config, data),
        onSuccess: () => {
            showTipOnce('first-purchase')
            return invalidate()
        },
    })
}

export function useAdjustStockItem(config: StockItemConfig) {
    const invalidate = useInvalidateStockItem(config)

    return useMutation({
        mutationFn: (data: Parameters<typeof adjustStockItem>[1]) =>
            adjustStockItem(config, data),
        onSuccess: () => {
            showTipOnce('first-count')
            return invalidate()
        },
    })
}

export function useDeleteStockItem(config: StockItemConfig) {
    const invalidate = useInvalidateStockItem(config)

    return useMutation({
        mutationFn: (id: number) => deleteStockItem(config, id),
        onSuccess: invalidate,
    })
}

export function useCreateStockItemPackage(config: StockItemConfig) {
    const invalidate = useInvalidateStockItem(config)

    return useMutation({
        mutationFn: ({
            itemId,
            ...data
        }: {
            itemId: number
            name: string
            quantityInBaseUnit: number
        }) => createStockItemPackage(config, itemId, data),
        onSuccess: invalidate,
    })
}

export function useDeleteStockItemPackage(config: StockItemConfig) {
    const invalidate = useInvalidateStockItem(config)

    return useMutation({
        mutationFn: ({
            itemId,
            packageId,
        }: {
            itemId: number
            packageId: number
        }) => deleteStockItemPackage(config, itemId, packageId),
        onSuccess: invalidate,
    })
}
