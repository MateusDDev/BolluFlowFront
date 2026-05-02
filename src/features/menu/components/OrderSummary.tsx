import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { CartItem } from '@/features/menu/types/menu.types'

type Props = {
    cart: CartItem[]
    total: number
}

export function OrderSummary({ cart, total }: Props) {
    return (
        <Card className="border-menu-border/70 bg-menu-card/80 shadow-sm">
            <CardHeader>
                <CardTitle className="text-base text-menu-text">
                    Resumo do pedido
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {cart.map((item) => (
                    <div
                        key={item.productId}
                        className="flex items-start justify-between gap-3 text-sm"
                    >
                        <p className="font-medium text-menu-text">
                            {item.productName} x{item.quantity}
                        </p>
                        <p className="font-semibold text-menu-text">
                            {formatCurrency(item.unitPrice * item.quantity)}
                        </p>
                    </div>
                ))}

                <Separator className="bg-menu-border" />

                <div className="flex items-center justify-between font-semibold text-menu-text">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                </div>
            </CardContent>
        </Card>
    )
}
