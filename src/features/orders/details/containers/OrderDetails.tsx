'use client'

import { useParams } from 'next/navigation'

import { Button } from 'ui/button'
import { Label } from 'ui/label'
import { Input } from 'ui/input'

import {
    orderStatusLabelMap,
    orderStatusVariantMap,
} from '@/features/orders/services/order.model'
import { useGetOrder } from '@/features/orders/details/hooks/queries/useGetOrder'
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card'
import { Separator } from 'ui/separator'
import { BackButton } from 'components/BackButton'
import { formatCurrency, formatWhatsapp } from '@/shared/helpers/formatHelper'
import { Badge } from 'ui/badge'
import { OrderItemsTable } from '@/features/orders/details/components/organisms/OrderItemsTable'
import { Smartphone } from 'lucide-react'
import Link from 'next/link'
import { useGetOrderItems } from '@/features/orders/details/hooks/queries/useGetOrderItems'

export function OrderDetails() {
    const { id } = useParams<{ id: string }>()
    const orderId = Number(id)

    const { data: order, isLoading } = useGetOrder(orderId)
    const { data: orderItems } = useGetOrderItems(orderId)

    if (isLoading || !order) return null

    const total =
        orderItems?.reduce((total, item) => {
            return total + item.quantity * item.unitPrice
        }, 0) ?? 0

    return (
        <div className="my-6 space-y-6">
            <header className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold">
                        Pedido #{order.number}
                    </h2>
                    <Badge variant={orderStatusVariantMap[order.status]}>
                        {orderStatusLabelMap[order.status]}
                    </Badge>
                </div>

                <BackButton className="[&_svg]:size-6" />
            </header>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Informações do cliente{' '}
                        <Link
                            href={`https://wa.me/${order.customer.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary"
                        >
                            <Smartphone />
                        </Link>
                    </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Nome</Label>
                            <Input value={order.customer.name} disabled />
                        </div>

                        <div className="grid gap-2">
                            <Label>WhatsApp</Label>
                            <Input
                                value={formatWhatsapp(order.customer.whatsapp)}
                                disabled
                            />
                        </div>

                        <div className="grid gap-2 col-span-2">
                            <Label>Endereço de entrega</Label>
                            <Input
                                value={`Rua ${order.customer.deliveryAddress.street}, Nº ${order.customer.deliveryAddress.number} - Bairro ${order.customer.deliveryAddress.neighborhood}`}
                                disabled
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <OrderItemsTable />

            <Card className="max-w-sm ml-auto">
                <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between font-medium text-base">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                </CardContent>
            </Card>

            <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                    Observações
                </h3>

                <div className="rounded-md border p-4 text-sm text-muted-foreground">
                    {order.note}
                </div>
            </section>

            <section className="space-y-4 border-t pt-6">
                <h3 className="text-sm font-medium text-muted-foreground">
                    Linha do tempo
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Pedido criado em</Label>
                        <Input
                            value={new Date(order.createdAt).toLocaleString()}
                            disabled
                        />
                    </div>

                    {order.deliveryDate && (
                        <div className="grid gap-2">
                            <Label>Data de entrega</Label>
                            <Input
                                value={new Date(
                                    order.deliveryDate
                                ).toLocaleString()}
                                disabled
                            />
                        </div>
                    )}
                </div>
            </section>

            <div className="flex justify-end gap-2 pt-6">
                <Button variant="destructive">Cancelar pedido</Button>
                <Button>Alterar status</Button>
            </div>
        </div>
    )
}
