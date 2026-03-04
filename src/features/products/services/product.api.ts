import { apiClient } from '@/shared/api/client'
import { ProductModel } from '@/features/products/services/product.model'

export function getProducts() {
    // BACKEND: expose final products separated from recipes.
    // Suggested route: GET /products with stockQuantity and salePrice.
    return apiClient<ProductModel[]>('/products', 'GET')
}
