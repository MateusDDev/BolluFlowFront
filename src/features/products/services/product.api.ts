import { apiClient } from '@/shared/api/client'
import {
    ProductComponentModel,
    ProductComponentType,
    ProductModel,
} from '@/features/products/services/product.model'

export function getProducts() {
    // BACKEND: expose final products in dedicated endpoint.
    return apiClient<ProductModel[]>('/products', 'GET')
}

export function getProductById(id: number) {
    // BACKEND: include stock + pricing summary for the final product.
    return apiClient<ProductModel>(`/products/${id}`, 'GET')
}

export function getProductComponents(productId: number) {
    // BACKEND: return product composition (recipes + ingredients) in one list.
    return apiClient<ProductComponentModel[]>(
        `/products/${productId}/components`,
        'GET'
    )
}

export type CreateProductDataType = {
    name: string
    salePrice?: number
}

export function createProduct(data: CreateProductDataType) {
    // BACKEND: create final product entity (independent from recipes).
    return apiClient<ProductModel>('/products', 'POST', data)
}

export type CreateProductComponentDataType = {
    componentType: ProductComponentType
    recipeId?: number
    ingredientId?: number
    quantityUsed: number
}

export function createProductComponent(
    productId: number,
    data: CreateProductComponentDataType
) {
    // BACKEND: support product composition using recipe and ingredient as component types.
    return apiClient<ProductComponentModel>(
        `/products/${productId}/components`,
        'POST',
        data
    )
}
