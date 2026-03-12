'use client'

import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from 'ui/dialog'
import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { formatQuantityInput } from '@/shared/helpers/formatHelper'
import { ProductComponentModel } from '@/features/products/services/product.model'
import { useUpdateProductComponent } from '@/features/products/details/hooks/mutations/useUpdateProductComponent'

interface Props {
    component: ProductComponentModel
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditProductComponentModal({
    component,
    open,
    onOpenChange,
}: Props) {
    const [quantityUsed, setQuantityUsed] = useState('')
    const { mutateAsync, isPending, error } = useUpdateProductComponent()

    useEffect(() => {
        if (!open) return

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setQuantityUsed(component.quantityUsed.toString().replace('.', ','))
    }, [open, component])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const quantity = Number(quantityUsed.replace(',', '.'))
        if (isNaN(quantity) || quantity <= 0) return

        await mutateAsync({
            productId: component.productId,
            componentId: component.id,
            data: {
                quantityUsed: quantity,
            },
        })

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar componente</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Quantidade usada</Label>
                        <Input
                            type="text"
                            inputMode="decimal"
                            value={quantityUsed}
                            onChange={(e) =>
                                setQuantityUsed(
                                    formatQuantityInput(e.target.value)
                                )
                            }
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
                                disabled={isPending || !quantityUsed}
                            >
                                {isPending
                                    ? 'Salvando...'
                                    : 'Salvar alteracoes'}
                            </Button>
                        </div>
                        {error && (
                            <p className="text-sm text-red-500">
                                {error.message}
                            </p>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
