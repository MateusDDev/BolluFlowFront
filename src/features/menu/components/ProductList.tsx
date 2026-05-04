import { ProductCard } from '@/features/menu/components/ProductCard'
import { PublicMenuProductModel } from '@/features/menu/types/menu.types'

type Props = {
    products: PublicMenuProductModel[]
    quantities: Record<number, number>
    onIncrease: (product: PublicMenuProductModel) => void
    onDecrease: (productId: number) => void
}

function normalizeCategory(category?: string | null) {
    return category?.trim() || 'Outros'
}

function groupProductsByCategory(products: PublicMenuProductModel[]) {
    const groups = products.reduce<Map<string, PublicMenuProductModel[]>>(
        (acc, product) => {
            const key = normalizeCategory(product.category)
            const existing = acc.get(key) ?? []
            existing.push(product)
            acc.set(key, existing)
            return acc
        },
        new Map()
    )

    return Array.from(groups.entries())
        .map(([title, groupedProducts]) => ({
            title,
            products: groupedProducts,
            isOther: title === 'Outros',
        }))
        .sort((a, b) => {
            if (a.isOther) return 1
            if (b.isOther) return -1
            return a.title.localeCompare(b.title, 'pt-BR')
        })
}

export function ProductList({
    products,
    quantities,
    onIncrease,
    onDecrease,
}: Props) {
    const groups = groupProductsByCategory(products)

    return (
        <div className="space-y-8">
            {groups.map((group) => (
                <div key={group.title} className="space-y-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-menu-primary-dark/85">
                            {group.title}
                        </h2>
                        <div className="h-px flex-1 bg-menu-border" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {group.products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                quantity={quantities[product.id] ?? 0}
                                onIncrease={onIncrease}
                                onDecrease={onDecrease}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
