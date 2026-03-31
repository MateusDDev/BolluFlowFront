import { apiClient } from '@/shared/api/client'
import { ProductConversionModel } from '@/features/products/services/productConversion.model'

export function getProductConversions(productId: number) {
    return apiClient<ProductConversionModel[]>(
        `/products/${productId}/conversions`,
        'GET'
    )
}
