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
    // BACKEND: endpoint principal de produtos finais (sem misturar com receitas).
    return apiClient<ProductModel[]>('/products', 'GET')
}

export function getProductById(id: number) {
    // BACKEND: retornar campos de detalhes e precificacao do produto final.
    return apiClient<ProductModel>(`/products/${id}`, 'GET')
}

export function getProductComponents(productId: number) {
    // BACKEND: listar composicao do produto final (receitas + insumos) na mesma resposta.
    return apiClient<ProductComponentModel[]>(
        `/products/${productId}/components`,
        'GET'
    )
}

export function getProductComponentCatalog(productId: number) {
    // BACKEND: catalogo para adicao de componente no produto (insumos e receitas ativas).
    return apiClient<ProductComponentCatalogItem[]>(
        `/products/${productId}/components/catalog`,
        'GET'
    )
}

export type CreateProductDataType = {
    name: string
    salePrice?: number
}

export function createProduct(data: CreateProductDataType) {
    // BACKEND: criar produto final de forma independente da entidade receita.
    return apiClient<ProductModel>('/products', 'POST', data)
}

export type UpdateProductDataType = {
    name?: string
    isActive?: boolean
    minimumStockQuantity?: number
}

export function updateProduct(id: number, data: UpdateProductDataType) {
    return apiClient<ProductModel>(`/products/${id}`, 'PATCH', data)
}

export type UpdateProductPricingDataType = {
    indirectCostPercentage: number
    markupPercentage: number
    finalPrice: number
    discountPercentage?: number
}

export function updateProductPricing(
    id: number,
    data: UpdateProductPricingDataType
) {
    // BACKEND: mesma ideia de precificacao da receita, porem aplicada ao produto final.
    return apiClient<ProductModel>(`/products/${id}/pricing`, 'PATCH', data)
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
    // BACKEND: aceitar componentType para vincular receita ou insumo ao produto final.
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
