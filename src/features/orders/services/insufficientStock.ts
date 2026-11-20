import { ApiRequestError } from '@/shared/api/client'

export type InsufficientProductStockItem = {
    productId?: number
    productName: string
    required: number
    available: number
}

export function getInsufficientProducts(
    error: unknown
): InsufficientProductStockItem[] | null {
    if (
        !(error instanceof ApiRequestError) ||
        error.code !== 'INSUFFICIENT_STOCK'
    ) {
        return null
    }

    const items = error.details.insufficientProducts

    return Array.isArray(items) ? (items as InsufficientProductStockItem[]) : []
}
