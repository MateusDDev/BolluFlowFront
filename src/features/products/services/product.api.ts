import { apiClient } from '@/shared/api/client'
import {
    ProductComponentModel,
    ProductComponentType,
    ProductModel,
} from '@/features/products/services/product.model'

export type ProductComponentCatalogItem = {
    id: number
    name: string
    baseUnit: string
    sourceType: ProductComponentType
}

export function getProducts() {
    return apiClient<ProductModel[]>('/products', 'GET')
}

export function getProductById(id: number) {
    return apiClient<ProductModel>(`/products/${id}`, 'GET')
}

export function getProductComponents(productId: number) {
    return apiClient<ProductComponentModel[]>(
        `/products/${productId}/components`,
        'GET'
    )
}

export function getProductComponentCatalog(productId: number) {
    return apiClient<ProductComponentCatalogItem[]>(
        `/products/${productId}/components/catalog`,
        'GET'
    )
}

export type CreateProductDataType = {
    name: string
    description?: string | null
    category?: string | null
    salePrice?: number
}

export function createProduct(data: CreateProductDataType) {
    return apiClient<ProductModel>('/products', 'POST', data)
}

export type UpdateProductDataType = {
    name?: string
    description?: string | null
    category?: string | null
    isActive?: boolean
    stockQuantity?: number
    minimumStockQuantity?: number
    imageUrl?: string | null
}

export function updateProduct(id: number, data: UpdateProductDataType) {
    return apiClient<ProductModel>(`/products/${id}`, 'PATCH', data)
}

export function updateProductImage(id: number, imageUrl: string | null) {
    return apiClient<ProductModel>(`/products/${id}`, 'PATCH', { imageUrl })
}

export type UpdateProductPricingDataType = {
    indirectCostPercentage: number | null
    markupPercentage: number
    finalPrice: number
    discountPercentage?: number
}

export function updateProductPricing(
    id: number,
    data: UpdateProductPricingDataType
) {
    return apiClient<ProductModel>(`/products/${id}/pricing`, 'PATCH', data)
}

export type CreateProductComponentDataType = {
    componentType: ProductComponentType
    recipeId?: number
    ingredientId?: number
    supplyId?: number
    quantityUsed: number
}

export function createProductComponent(
    productId: number,
    data: CreateProductComponentDataType
) {
    return apiClient<ProductComponentModel>(
        `/products/${productId}/components`,
        'POST',
        data
    )
}

export function updateProductComponent(
    productId: number,
    componentId: number,
    data: { quantityUsed: number }
) {
    return apiClient<ProductComponentModel>(
        `/products/${productId}/components/${componentId}`,
        'PUT',
        data
    )
}

export function deleteProductComponent(productId: number, componentId: number) {
    return apiClient<null>(
        `/products/${productId}/components/${componentId}`,
        'DELETE'
    )
}
