'use client'

import Link from 'next/link'
import { EyeIcon, MessageCircle, MoreHorizontal } from 'lucide-react'

import { Button } from 'ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from 'ui/dropdown-menu'

import { OrderModel } from '@/features/orders/services/order.model'
import { OrderWhatsappModal } from '@/features/orders/components/organisms/OrderWhatsappModal'

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
                    <Link href={`/orders/${order.id}`} className="flex items-center gap-2">
                        <EyeIcon className="h-4 w-4" />
                        Ver detalhes
                    </Link>
                </DropdownMenuItem>

                {order.customer.whatsapp && (
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
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
