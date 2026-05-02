import { ArrowRight, Minus, Plus, ShoppingBag } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { cn } from '@/shared/lib/utils'
import { CartItem } from '@/features/menu/types/menu.types'

type Props = {
    cart: CartItem[]
    total: number
    totalItems: number
    onIncrease: (item: CartItem) => void
    onDecrease: (item: CartItem) => void
    onCheckout: () => void
    className?: string
}

function EmptyCartState() {
    return (
        <div className="rounded-2xl border border-dashed border-menu-border bg-menu-primary-light/70 px-4 py-8 text-center">
            <ShoppingBag className="mx-auto mb-3 size-8 text-menu-primary-dark" />
            <p className="font-medium text-menu-text">
                Seu carrinho está vazio
            </p>
            <p className="mt-1 text-sm text-menu-muted">
                Adicione produtos para montar seu pedido.
            </p>
        </div>
    )
}

export function CartSummary({
    cart,
    total,
    totalItems,
    onIncrease,
    onDecrease,
    onCheckout,
    className,
}: Props) {
    return (
        <Card
            className={cn(
                'border-menu-border/70 bg-menu-card/95 shadow-lg shadow-[0_16px_40px_hsl(var(--menu-primary-medium)/0.32)]',
                className
            )}
        >
            <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                    <CardTitle className="flex items-center gap-2 text-lg text-menu-text">
                        <ShoppingBag className="size-5" />
                        Carrinho
                    </CardTitle>
                    <span className="rounded-full bg-menu-primary-medium px-3 py-1 text-xs font-semibold text-menu-badge-text">
                        {totalItems} {totalItems === 1 ? 'item' : 'itens'}
                    </span>
                </div>
                <CardDescription className="text-menu-muted">
                    Revise os produtos antes de finalizar o pedido.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {cart.length === 0 ? (
                    <EmptyCartState />
                ) : (
                    <div className="space-y-3">
                        {cart.map((item) => (
                            <div
                                key={item.productId}
                                className="rounded-2xl border border-menu-border bg-menu-primary-light/50 p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-medium text-menu-text">
                                            {item.productName}
                                        </p>
                                        <p className="text-sm text-menu-muted">
                                            {formatCurrency(item.unitPrice)}{' '}
                                            cada
                                        </p>
                                    </div>
                                    <p className="font-semibold text-menu-text">
                                        {formatCurrency(
                                            item.unitPrice * item.quantity
                                        )}
                                    </p>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <div className="inline-flex items-center rounded-full border border-menu-border bg-menu-card">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full text-menu-text"
                                            onClick={() => onDecrease(item)}
                                        >
                                            <Minus />
                                        </Button>
                                        <span className="min-w-8 text-center text-sm font-semibold text-menu-text">
                                            {item.quantity}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full text-menu-text"
                                            onClick={() => onIncrease(item)}
                                        >
                                            <Plus />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Separator className="bg-menu-border" />

                <div className="flex items-center justify-between text-base font-semibold text-menu-text">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                </div>

                <Button
                    type="button"
                    className="h-11 w-full rounded-full bg-menu-primary text-menu-primary-foreground shadow-sm hover:bg-menu-primary/90"
                    disabled={cart.length === 0}
                    onClick={onCheckout}
                >
                    Fazer pedido
                    <ArrowRight />
                </Button>
            </CardContent>
        </Card>
    )
}
