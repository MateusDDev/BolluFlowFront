import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    createStockItem,
    createStockItemPackage,
    CreateStockItemData,
    getStockItems,
    updateStockItem,
    UpdateStockItemData,
} from '@/features/stockItems/services/stockItem.api'
import { StockItemConfig } from '@/features/stockItems/services/stockItem.config'

export function useStockItems(config: StockItemConfig) {
    return useQuery({
        queryKey: [config.queryKey],
        queryFn: () => getStockItems(config),
    })
}

export type CreateStockItemInput = CreateStockItemData & {
    packageName?: string
    packageQuantityInBaseUnit?: number
}

export function useCreateStockItem(config: StockItemConfig) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            packageName,
            packageQuantityInBaseUnit,
            ...data
        }: CreateStockItemInput) => {
            const created = await createStockItem(config, data)

            if (packageName && packageQuantityInBaseUnit) {
                await createStockItemPackage(config, created.id, {
                    name: packageName,
                    quantityInBaseUnit: packageQuantityInBaseUnit,
                })
            }

            return created
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: [config.queryKey] }),
                queryClient.invalidateQueries({
                    queryKey: [config.conversionsQueryKey],
                }),
                queryClient.invalidateQueries({ queryKey: ['finance'] }),
                queryClient.invalidateQueries({ queryKey: ['onboarding'] }),
            ])
        },
    })
}

export function useUpdateStockItem(config: StockItemConfig) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateStockItemData }) =>
            updateStockItem(config, id, data),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: [config.queryKey] }),
                queryClient.invalidateQueries({ queryKey: ['products'] }),
                queryClient.invalidateQueries({ queryKey: ['recipes'] }),
                queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
            ])
        },
    })
}
