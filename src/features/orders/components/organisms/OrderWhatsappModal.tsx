'use client'

import { ReactNode, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from 'ui/dialog'
import { Button } from 'ui/button'
import { Textarea } from 'ui/textarea'

import {
    applyWhatsappTemplate,
    buildOrderWhatsappMessage,
    openWhatsapp,
} from '@/features/orders/helpers/whatsappMessage'
import {
    OrderItemModel,
    OrderModel,
} from '@/features/orders/services/order.model'
import { useGetOrderItems } from '@/features/orders/details/hooks/queries/useGetOrderItems'
import { useGetProfile } from '@/features/profile/hooks/queries/useGetProfile'

interface OrderWhatsappModalProps {
    order: OrderModel
    trigger: ReactNode
    orderItems?: OrderItemModel[]
}

export function OrderWhatsappModal({
    order,
    trigger,
    orderItems,
}: OrderWhatsappModalProps) {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')

    const { data: fetchedItems } = useGetOrderItems(
        order.id,
        open && !orderItems
    )
    const { data: profile } = useGetProfile(open)

    const orderWithItems = {
        ...order,
        items: orderItems ?? fetchedItems ?? [],
    }

    const suggestion = profile?.whatsappMessageTemplate
        ? applyWhatsappTemplate(profile.whatsappMessageTemplate, orderWithItems)
        : buildOrderWhatsappMessage(orderWithItems)

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen)

        if (nextOpen) {
            setMessage(suggestion)
        }
    }

    const handleRestoreSuggestion = () => {
        setMessage(suggestion)
    }

    const handleSend = () => {
        openWhatsapp(order.customer.whatsapp, message)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>

            <DialogContent className="sm:max-w-[640px]">
                <DialogHeader>
                    <DialogTitle>
                        Mensagem para {order.customer.name}
                    </DialogTitle>
                    <DialogDescription>
                        Edite a mensagem antes de enviar. Formatação do WhatsApp
                        é suportada (*negrito*, _itálico_).
                    </DialogDescription>
                </DialogHeader>

                <Textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={10}
                    className="min-h-[220px]"
                />

                <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between gap-2">
                    <Button variant="ghost" onClick={handleRestoreSuggestion}>
                        Restaurar sugestão
                    </Button>

                    <Button
                        onClick={handleSend}
                        disabled={!order.customer.whatsapp}
                    >
                        Enviar no WhatsApp
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
