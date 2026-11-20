'use client'

import Link from 'next/link'
import { Badge } from 'ui/badge'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from 'ui/card'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { useGetProductMargins } from '@/features/dashboard/hooks/queries/useGetProductMargins'

const LOW_MARGIN_PERCENT = 30
const LIST_LIMIT = 5

export function ProductMarginsCard() {
    const { data: products = [] } = useGetProductMargins()

    const withoutRecipe = products.filter((product) => !product.hasRecipe)
    const lowestMargins = products
        .filter((product) => product.margin !== null)
        .slice(0, LIST_LIMIT)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Margem dos produtos</CardTitle>
                <CardDescription>
                    Quanto sobra de cada venda depois do custo da ficha técnica
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {lowestMargins.length > 0 && (
                    <ul className="space-y-2">
                        {lowestMargins.map((product) => (
                            <li key={product.id}>
                                <Link
                                    href={`/products/${product.id}`}
                                    className="hover:border-primary flex items-center justify-between gap-2 rounded-lg border p-2.5 text-sm transition-colors"
                                >
                                    <span className="min-w-0">
                                        <span className="block truncate font-medium">
                                            {product.name}
                                        </span>
                                        <span className="text-muted-foreground text-xs">
                                            Custo {formatCurrency(product.cost)}{' '}
                                            · Preço{' '}
                                            {formatCurrency(product.price)}
                                        </span>
                                    </span>
                                    <Badge
                                        variant={
                                            (product.margin ?? 0) <
                                            LOW_MARGIN_PERCENT
                                                ? 'destructive'
                                                : 'secondary'
                                        }
                                    >
                                        {product.margin?.toFixed(0)}%
                                    </Badge>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                {withoutRecipe.length > 0 && (
                    <div className="space-y-1">
                        <p className="text-sm font-medium">
                            Sem ficha técnica ({withoutRecipe.length})
                        </p>
                        <p className="text-muted-foreground text-sm">
                            {withoutRecipe
                                .slice(0, LIST_LIMIT)
                                .map((product, index) => (
                                    <span key={product.id}>
                                        {index > 0 && ', '}
                                        <Link
                                            href={`/products/${product.id}`}
                                            className="hover:text-primary underline underline-offset-2"
                                        >
                                            {product.name}
                                        </Link>
                                    </span>
                                ))}
                            {withoutRecipe.length > LIST_LIMIT && ' e outros'}
                        </p>
                    </div>
                )}

                {products.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                        Cadastre produtos para ver as margens.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
