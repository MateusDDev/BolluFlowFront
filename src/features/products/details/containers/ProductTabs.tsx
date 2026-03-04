'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/tabs'
import { BackButton } from 'components/BackButton'
import { usePageTitle } from 'components/providers/PageTitleProvider'
import { useGetProduct } from '@/features/products/list/hooks/queries/useGetProduct'
import { useGetProductComponents } from '@/features/products/details/hooks/queries/useGetProductComponents'
import { ProductDetails } from '@/features/products/details/components/organisms/ProductDetails'
import { ProductComponentsTable } from '@/features/products/details/components/organisms/ProductComponentsTable'
import { ProductPricing } from '@/features/products/details/components/organisms/ProductPricing'

export function ProductTabs() {
    const { id } = useParams<{ id: string }>()
    const productId = Number(id)

    const { data: product } = useGetProduct(productId)
    const componentsQuery = useGetProductComponents(productId)
    const { setTitle } = usePageTitle()

    useEffect(() => {
        if (product?.name) setTitle(product.name)

        return () => setTitle(null)
    }, [product, setTitle])

    return (
        <section>
            <Tabs defaultValue="details">
                <div className="flex justify-between items-center">
                    <TabsList>
                        <TabsTrigger value="details">Detalhes</TabsTrigger>
                        <TabsTrigger value="components">Composicao</TabsTrigger>
                        <TabsTrigger value="pricing">Precificacao</TabsTrigger>
                    </TabsList>
                    <BackButton className="[&_svg]:size-6" />
                </div>

                <TabsContent value="details">
                    <ProductDetails />
                </TabsContent>

                <TabsContent value="components">
                    <ProductComponentsTable
                        components={componentsQuery.data}
                        isLoading={componentsQuery.isLoading}
                        error={componentsQuery.error}
                    />
                </TabsContent>

                <TabsContent value="pricing">
                    <ProductPricing />
                </TabsContent>
            </Tabs>
        </section>
    )
}
