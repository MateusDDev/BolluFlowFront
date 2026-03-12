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
import { SupplyModel } from '@/features/supplies/services/supply.model'
import { useUpdateSupply } from '@/features/supplies/hooks/mutations/useUpdateSupply'
import { formatCurrencyFromInput } from '@/shared/helpers/formatHelper'

interface Props {
    supply: SupplyModel
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditSupplyModal({ supply, open, onOpenChange }: Props) {
    const [name, setName] = useState('')
    const [unitCost, setUnitCost] = useState('')
    const [stockQuantity, setStockQuantity] = useState('')
    const [minimumStockQuantity, setMinimumStockQuantity] = useState('')

    const { mutateAsync, isPending, error } = useUpdateSupply()

    useEffect(() => {
        if (!open) return

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setName(supply.name)
        setUnitCost(Math.round(supply.unitCost * 100).toString())
        setStockQuantity(supply.stockQuantity.toString())
        setMinimumStockQuantity((supply.minimumStockQuantity ?? '').toString())
    }, [open, supply])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await mutateAsync({
            id: supply.id,
            data: {
                name,
                unitCost: Number(unitCost) / 100,
                stockQuantity: Number(stockQuantity),
                minimumStockQuantity:
                    minimumStockQuantity === ''
                        ? undefined
                        : Number(minimumStockQuantity),
            },
        })

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar insumo</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Nome</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Custo unitario</Label>
                        <Input
                            type="text"
                            value={formatCurrencyFromInput(unitCost)}
                            onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, '')
                                setUnitCost(digits)
                            }}
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Estoque disponivel</Label>
                        <Input
                            type="number"
                            min={0}
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Estoque minimo</Label>
                        <Input
                            type="number"
                            min={0}
                            value={minimumStockQuantity}
                            onChange={(e) =>
                                setMinimumStockQuantity(e.target.value)
                            }
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
                            <Button type="submit" disabled={isPending}>
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
