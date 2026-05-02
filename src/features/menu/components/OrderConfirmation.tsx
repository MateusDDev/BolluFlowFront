import { PackageCheck } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card'
import { PublicOrderConfirmationModel } from '@/features/menu/types/menu.types'

type Props = {
    order: PublicOrderConfirmationModel
    onBack: () => void
}

function getOrderNumber(order: PublicOrderConfirmationModel) {
    return order.orderNumber ?? order.number ?? order.id
}

export function OrderConfirmation({ order, onBack }: Props) {
    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-sm text-center">
                <Card className="border-emerald-200 bg-menu-card/90 shadow-xl shadow-emerald-100/40">
                    <CardHeader className="items-center">
                        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            <PackageCheck className="size-8" />
                        </div>
                        <CardTitle className="text-3xl text-emerald-950">
                            Pedido recebido!
                        </CardTitle>
                        <CardDescription className="text-base text-emerald-900/85">
                            O acompanhamento do pedido pode ser feito pelo
                            whatsapp.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-full border-emerald-200 bg-white text-emerald-950 hover:bg-emerald-50 hover:text-emerald-900"
                            onClick={onBack}
                        >
                            Voltar ao cardápio
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
