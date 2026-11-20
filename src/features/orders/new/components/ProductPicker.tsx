'use client'

import { useMemo, useState } from 'react'
import { Minus, Plus, Search } from 'lucide-react'
import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { cn } from '@/shared/lib/utils'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { ProductModel } from '@/features/products/services/product.model'

type Props = {
    products: ProductModel[]
    quantities: Record<number, number>
    onQuantityChange: (productId: number, quantity: number) => void
    showStock: boolean
}

function normalize(value: string) {
    return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

export function ProductPicker({
    products,
    quantities,
    onQuantityChange,
    showStock,
}: Props) {
    const [search, setSearch] = useState('')

    const filtered = useMemo(() => {
        const term = normalize(search.trim())

        if (!term) return products

        return products.filter(
            (product) =>
                normalize(product.name).includes(term) ||
                normalize(product.category ?? '').includes(term)
        )
    }, [products, search])

    return (
        <div className="space-y-3">
            <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                    type="search"
                    placeholder="Buscar produto"
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {filtered.length === 0 && (
                <p className="text-muted-foreground py-6 text-center text-sm">
                    {products.length === 0
                        ? 'Cadastre produtos ativos para começar a vender.'
                        : 'Nenhum produto encontrado.'}
                </p>
            )}

            <ul className="grid gap-2">
                {filtered.map((product) => {
                    const quantity = quantities[product.id] ?? 0
                    const selected = quantity > 0

                    return (
                        <li
                            key={product.id}
                            className={cn(
                                'flex items-center gap-3 rounded-lg border p-2 transition-colors',
                                selected && 'border-primary bg-primary/5'
                            )}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    onQuantityChange(product.id, quantity + 1)
                                }
                                className="flex min-w-0 flex-1 items-center gap-3 text-left"
                            >
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt=""
                                        className="h-11 w-11 shrink-0 rounded-md object-cover"
                                    />
                                ) : (
                                    <span className="bg-muted text-muted-foreground flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-sm font-semibold">
                                        {product.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                                <span className="min-w-0">
                                    <span className="block truncate font-medium">
                                        {product.name}
                                    </span>
                                    <span className="text-muted-foreground block text-sm">
                                        {formatCurrency(product.finalPrice)}
                                        {showStock && product.trackStock && (
                                            <>
                                                {' '}
                                                · {product.stockQuantity} em
                                                estoque
                                            </>
                                        )}
                                    </span>
                                </span>
                            </button>

                            {selected ? (
                                <div className="flex shrink-0 items-center gap-1">
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="outline"
                                        className="h-9 w-9"
                                        aria-label={`Remover um ${product.name}`}
                                        onClick={() =>
                                            onQuantityChange(
                                                product.id,
                                                quantity - 1
                                            )
                                        }
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center font-semibold tabular-nums">
                                        {quantity}
                                    </span>
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="outline"
                                        className="h-9 w-9"
                                        aria-label={`Adicionar um ${product.name}`}
                                        onClick={() =>
                                            onQuantityChange(
                                                product.id,
                                                quantity + 1
                                            )
                                        }
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-9 w-9 shrink-0"
                                    aria-label={`Adicionar ${product.name}`}
                                    onClick={() =>
                                        onQuantityChange(product.id, 1)
                                    }
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            )}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
