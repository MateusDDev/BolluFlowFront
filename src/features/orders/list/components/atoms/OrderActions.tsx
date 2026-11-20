'use client'

import Link from 'next/link'
import {
    EyeIcon,
    FileText,
    MessageCircle,
    MoreHorizontal,
    Trash2,
} from 'lucide-react'

import { Button } from 'ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from 'ui/dropdown-menu'

import {
    isDirectSale,
    OrderModel,
} from '@/features/orders/services/order.model'
import { OrderWhatsappModal } from '@/features/orders/components/organisms/OrderWhatsappModal'
import { DeleteDirectSaleDialog } from '@/features/orders/components/organisms/DeleteDirectSaleDialog'
import {
    openCustomerOrderReport,
    openOrderReport,
} from '@/features/orders/services/order.api'

interface OrderActionsProps {
    order: OrderModel
}

export function OrderActions({ order }: OrderActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link
                        href={`/orders/${order.id}`}
                        className="flex items-center gap-2"
                    >
                        <EyeIcon className="h-4 w-4" />
                        Ver detalhes
                    </Link>
                </DropdownMenuItem>

                {!isDirectSale(order) && (
                    <DropdownMenuItem
                        onSelect={(event) => {
                            event.preventDefault()
                            openOrderReport(order.id)
                        }}
                        className="flex items-center gap-2"
                    >
                        <FileText className="h-4 w-4" />
                        Comanda do entregador
                    </DropdownMenuItem>
                )}

                <DropdownMenuItem
                    onSelect={(event) => {
                        event.preventDefault()
                        openCustomerOrderReport(order.id)
                    }}
                    className="flex items-center gap-2"
                >
                    <FileText className="h-4 w-4" />
                    Comanda do cliente
                </DropdownMenuItem>

                {order.customer?.whatsapp && (
                    <OrderWhatsappModal
                        order={order}
                        trigger={
                            <DropdownMenuItem
                                onSelect={(event) => event.preventDefault()}
                                className="flex items-center gap-2"
                            >
                                <MessageCircle className="h-4 w-4" />
                                Enviar no WhatsApp
                            </DropdownMenuItem>
                        }
                    />
                )}

                {isDirectSale(order) && (
                    <>
                        <DropdownMenuSeparator />
                        <DeleteDirectSaleDialog
                            orderId={order.id}
                            orderNumber={order.number}
                            trigger={
                                <DropdownMenuItem
                                    onSelect={(event) => event.preventDefault()}
                                    className="text-destructive flex items-center gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Excluir venda
                                </DropdownMenuItem>
                            }
                        />
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
