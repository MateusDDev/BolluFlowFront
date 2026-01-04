'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from 'ui/dialog'
import { Button } from 'ui/button'
import { Label } from 'ui/label'
import { Input } from 'ui/input'
import {
    formatCurrencyFromInput,
    formatQuantityInput,
} from '@/shared/helpers/formatHelper'
import { useUpdateOrderItem } from '@/features/orders/details/hooks/mutations/useUpdateOrderItem'

interface OrderItemModel {
    id: number
    quantity: number
    unitPrice: number
}

interface EditOrderItemModalProps {
    orderId: number
    item: OrderItemModel
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditOrderItemModal({
    orderId,
    item,
    open,
    onOpenChange,
}: EditOrderItemModalProps) {
    const [quantity, setQuantity] = useState(() =>
        item.quantity.toString().replace('.', ',')
    )
    const [unitPrice, setUnitPrice] = useState(() =>
        String(Math.round(item.unitPrice * 100))
    )

    const { mutateAsync, isPending, error } = useUpdateOrderItem()

    const handleOpenChange = (nextOpen: boolean) => {
        if (nextOpen) {
            setQuantity(item.quantity.toString().replace('.', ','))
            setUnitPrice(item.unitPrice.toString().replace('.', ','))
        }

        onOpenChange(nextOpen)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const quantityNumber = Number(quantity.replace(',', '.'))
        const unitPriceNumber = Number(unitPrice) / 100

        if (
            isNaN(quantityNumber) ||
            quantityNumber <= 0 ||
            isNaN(unitPriceNumber) ||
            unitPriceNumber <= 0
        ) {
            return
        }

        await mutateAsync({
            orderId,
            itemId: item.id,
            data: {
                quantity: quantityNumber,
                unitPrice: unitPriceNumber,
            },
        })

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar item do pedido</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Atualize a quantidade e o preço unitário do item.
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Quantidade*</Label>
                        <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="Ex: 2"
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(formatQuantityInput(e.target.value))
                            }
                            required
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Preço unitário*</Label>
                        <Input
                            placeholder="Ex: 12,50"
                            value={formatCurrencyFromInput(unitPrice)}
                            onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, '')
                                setUnitPrice(digits)
                            }}
                            required
                        />
                    </div>

                    <DialogFooter className="flex flex-col gap-2">
                        <div className="flex justify-end gap-2">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isPending}
                                >
                                    Cancelar
                                </Button>
                            </DialogClose>

                            <Button
                                type="submit"
                                disabled={isPending || !quantity || !unitPrice}
                            >
                                {isPending
                                    ? 'Salvando...'
                                    : 'Salvar alterações'}
                            </Button>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500">
                                Erro ao atualizar item.
                            </p>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
