import { Minus, Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { cn } from '@/shared/lib/utils'
import { PublicMenuProductModel } from '@/features/menu/types/menu.types'

type Props = {
    product: PublicMenuProductModel
    quantity: number
    onIncrease: (product: PublicMenuProductModel) => void
    onDecrease: (productId: number) => void
}

function getProductUnitPrice(product: PublicMenuProductModel) {
    return product.finalPrice ?? product.salePrice ?? product.price ?? 0
}

export function ProductCard({
    product,
    quantity,
    onIncrease,
    onDecrease,
}: Props) {
    const isUnavailable = product.isAvailable === false

    return (
        <Card
            className={cn(
                'border-white/70 bg-menu-card/90 shadow-md shadow-[0_14px_34px_hsl(var(--menu-primary-medium)/0.18)]',
                isUnavailable && 'opacity-65'
            )}
        >
            <CardContent className="flex items-center justify-between gap-4 py-6">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-menu-text">
                            {product.name}
                        </h3>
                        {isUnavailable ? (
                            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                                Esgotado
                            </span>
                        ) : null}
                    </div>

                    {product.description ? (
                        <p className="max-w-xl text-sm leading-6 text-menu-muted">
                            {product.description}
                        </p>
                    ) : null}

                    <div className="flex items-center gap-3">
                        <p className="text-base font-semibold text-menu-primary">
                            {formatCurrency(getProductUnitPrice(product))}
                        </p>
                        {isUnavailable ? (
                            <p className="text-sm font-medium text-red-700">
                                Indisponível
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {quantity > 0 ? (
                        <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="rounded-full border-menu-border bg-menu-card text-menu-text"
                            onClick={() => onDecrease(product.id)}
                        >
                            <Minus />
                        </Button>
                    ) : null}

                    {quantity > 0 ? (
                        <span className="min-w-6 text-center text-sm font-semibold text-menu-text">
                            {quantity}
                        </span>
                    ) : null}

                    <Button
                        type="button"
                        size={quantity > 0 ? 'icon' : 'default'}
                        className="rounded-full bg-menu-primary text-menu-primary-foreground hover:bg-menu-primary/90 disabled:bg-menu-primary-medium disabled:text-menu-badge-text"
                        disabled={isUnavailable}
                        onClick={() => onIncrease(product)}
                    >
                        <Plus />
                        <span className={cn(quantity > 0 && 'sr-only')}>
                            Adicionar
                        </span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
