'use client'

import Image from 'next/image'
import { ImageIcon, Minus, Plus } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/shared/components/ui/dialog'
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
        <Card className="overflow-hidden border-menu-border bg-menu-card">
            <Dialog>
                {product.imageUrl ? (
                    <DialogTrigger asChild>
                        <div
                            role="button"
                            tabIndex={0}
                            aria-label={`Ver foto de ${product.name}`}
                            onKeyDown={(event) => {
                                if (
                                    event.key === 'Enter' ||
                                    event.key === ' '
                                ) {
                                    event.preventDefault()
                                    event.currentTarget.click()
                                }
                            }}
                            className="relative aspect-square w-full cursor-pointer overflow-hidden bg-menu-primary-light"
                        >
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                loading="lazy"
                                quality={90}
                                className={cn(
                                    'object-cover transition hover:scale-105',
                                    isUnavailable && 'opacity-50 grayscale'
                                )}
                            />
                        </div>
                    </DialogTrigger>
                ) : (
                    <div className="flex aspect-square w-full items-center justify-center bg-menu-primary-light">
                        <ImageIcon className="size-12 text-menu-primary-dark/30" />
                    </div>
                )}

                {product.imageUrl ? (
                    <DialogContent className="border-menu-border bg-menu-card p-2 sm:max-w-md">
                        <DialogTitle className="sr-only">
                            Foto de {product.name}
                        </DialogTitle>
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={500}
                            height={500}
                            quality={90}
                            className="w-full rounded-lg object-contain"
                        />
                    </DialogContent>
                ) : null}
            </Dialog>

            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="min-w-0 font-semibold text-menu-text">
                        {product.name}
                    </h3>
                    {isUnavailable ? (
                        <span className="shrink-0 rounded-full bg-menu-primary-medium px-2 py-0.5 text-xs text-menu-primary-dark">
                            Esgotado
                        </span>
                    ) : null}
                </div>

                {product.description ? (
                    <p className="mt-1 line-clamp-3 text-sm text-menu-muted">
                        {product.description}
                    </p>
                ) : null}

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-lg font-bold text-menu-primary">
                        {formatCurrency(getProductUnitPrice(product))}
                    </span>

                    {quantity > 0 ? (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="inline-flex size-8 items-center justify-center rounded-full border border-menu-border bg-menu-card text-menu-text transition hover:bg-menu-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-menu-primary disabled:pointer-events-none disabled:opacity-40"
                                onClick={() => onDecrease(product.id)}
                            >
                                <Minus className="size-4" />
                            </button>

                            <span className="min-w-6 text-center text-sm font-semibold text-menu-text">
                                {quantity}
                            </span>

                            <button
                                type="button"
                                className="inline-flex size-8 items-center justify-center rounded-full bg-menu-primary text-menu-primary-foreground transition hover:bg-menu-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-menu-primary disabled:pointer-events-none disabled:bg-menu-primary-medium disabled:text-menu-badge-text disabled:opacity-40"
                                disabled={isUnavailable}
                                onClick={() => onIncrease(product)}
                            >
                                <Plus className="size-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-menu-primary px-4 py-2 text-sm font-medium text-menu-primary-foreground transition hover:bg-menu-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-menu-primary disabled:pointer-events-none disabled:bg-menu-primary-medium disabled:text-menu-badge-text disabled:opacity-40"
                            disabled={isUnavailable}
                            onClick={() => onIncrease(product)}
                        >
                            <Plus className="size-4" />
                            Adicionar
                        </button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
