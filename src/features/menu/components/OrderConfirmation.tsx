import { MessageCircle, PackageCheck } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card'
import { PixKeyCopy } from '@/features/menu/components/PixKeyCopy'
import {
    CompletedMenuOrder,
    MenuStoreAddress,
} from '@/features/menu/types/menu.types'
import { formatAddress } from '@/shared/helpers/addressHelper'

type Props = {
    order: CompletedMenuOrder
    pixKey?: string | null
    storeAddress: MenuStoreAddress | null
    onBack: () => void
}

export function OrderConfirmation({
    order,
    pixKey,
    storeAddress,
    onBack,
}: Props) {
    const { whatsappUrl } = order

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-sm text-center">
                <Card className="border-emerald-200 bg-menu-card/90 shadow-xl shadow-emerald-100/40">
                    <CardHeader className="items-center">
                        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            <PackageCheck className="size-8" />
                        </div>
                        <CardTitle className="text-3xl text-emerald-950">
                            Pedido #{order.orderNumber} recebido!
                        </CardTitle>
                        <CardDescription className="text-base text-emerald-900/85">
                            {whatsappUrl
                                ? 'Envie o pedido pelo WhatsApp para a loja confirmar.'
                                : 'A loja vai falar com você pelo WhatsApp.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-3">
                        {order.isPickup && storeAddress ? (
                            <div className="w-full rounded-xl border border-menu-border bg-menu-card p-3 text-left">
                                <p className="text-xs font-medium uppercase tracking-wide text-menu-muted">
                                    Retire seu pedido em
                                </p>
                                <p className="mt-1 text-sm font-semibold text-menu-text">
                                    {formatAddress(storeAddress)}
                                </p>
                            </div>
                        ) : null}
                        {order.paymentMethod === 'Pix' && pixKey ? (
                            <div className="w-full">
                                <PixKeyCopy pixKey={pixKey} />
                            </div>
                        ) : null}
                        {whatsappUrl ? (
                            <Button
                                asChild
                                className="h-11 w-full rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <MessageCircle />
                                    Enviar pedido no WhatsApp
                                </a>
                            </Button>
                        ) : null}
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
