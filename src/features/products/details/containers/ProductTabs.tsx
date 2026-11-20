'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/tabs'
import { Button } from 'ui/button'
import { Badge } from 'ui/badge'
import { BackButton } from 'components/BackButton'
import { usePageTitle } from 'components/providers/PageTitleProvider'
import { useModules } from '@/shared/modules/useModules'
import { useGetProduct } from '@/features/products/list/hooks/queries/useGetProduct'
import { useGetProductComponents } from '@/features/products/details/hooks/queries/useGetProductComponents'
import { ProductDetails } from '@/features/products/details/components/organisms/ProductDetails'
import { ProductComponentsTable } from '@/features/products/details/components/organisms/ProductComponentsTable'
import { ProductPricing } from '@/features/products/details/components/organisms/ProductPricing'
import { ProductImageUpload } from '@/features/products/components/ProductImageUpload'
import { ProductProductionModal } from '@/features/products/list/components/organisms/ProductProductionModal'

export function ProductTabs() {
    const { id } = useParams<{ id: string }>()
    const productId = Number(id)

    const { data: product } = useGetProduct(productId)
    const componentsQuery = useGetProductComponents(productId)
    const { setTitle } = usePageTitle()
    const { hasModule } = useModules()
    const [isProductionOpen, setIsProductionOpen] = useState(false)

    const usesRecipes = hasModule('recipes')
    const hasStock = hasModule('stock')

    useEffect(() => {
        if (product?.name) setTitle(product.name)

        return () => setTitle(null)
    }, [product, setTitle])

    if (!product) return null

    const overview = (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-2">
                <ProductImageUpload
                    productId={productId}
                    imageUrl={product.imageUrl}
                />
                <p className="text-muted-foreground text-center text-xs">
                    Fotos quadradas ficam melhores no cardápio.
                </p>
            </div>

            <div className="space-y-6 lg:col-span-2">
                <ProductDetails />
                <ProductPricing />
            </div>
        </div>
    )

    return (
        <section className="space-y-6 py-6">
            <Tabs defaultValue="overview" className="gap-6">
                <header className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <BackButton href="/products" />
                        {usesRecipes ? (
                            <TabsList>
                                <TabsTrigger value="overview">
                                    Visão geral
                                </TabsTrigger>
                                <TabsTrigger value="recipe">
                                    Ficha técnica
                                </TabsTrigger>
                            </TabsList>
                        ) : null}
                        <Badge
                            variant={product.isActive ? 'default' : 'secondary'}
                        >
                            {product.isActive ? 'À venda' : 'Fora de venda'}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                        {hasStock && (
                            <Button
                                variant="outline"
                                onClick={() => setIsProductionOpen(true)}
                            >
                                Registrar produção
                            </Button>
                        )}
                    </div>
                </header>

                <TabsContent value="overview">{overview}</TabsContent>

                {usesRecipes && (
                    <TabsContent value="recipe">
                        <ProductComponentsTable
                            components={componentsQuery.data}
                            isLoading={componentsQuery.isLoading}
                            error={componentsQuery.error}
                        />
                    </TabsContent>
                )}
            </Tabs>

            {hasStock && (
                <ProductProductionModal
                    product={product}
                    open={isProductionOpen}
                    onOpenChange={setIsProductionOpen}
                />
            )}
        </section>
    )
}
