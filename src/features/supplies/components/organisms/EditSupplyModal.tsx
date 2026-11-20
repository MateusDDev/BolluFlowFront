'use client'

import React, { useEffect, useState } from 'react'
import { ModuleGate } from '@/shared/modules/ModuleGate'
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
import { TrackStockField } from '@/shared/modules/stock'

interface Props {
    supply: SupplyModel
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditSupplyModal({ supply, open, onOpenChange }: Props) {
    const [name, setName] = useState('')
    const [unitCost, setUnitCost] = useState('')
    const [minimumStockQuantity, setMinimumStockQuantity] = useState('')
    const [trackStock, setTrackStock] = useState(false)

    const { mutateAsync, isPending, error } = useUpdateSupply()

    useEffect(() => {
        if (!open) return

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setName(supply.name)
        setUnitCost(Math.round(supply.unitCost * 100).toString())
        setMinimumStockQuantity((supply.minimumStockQuantity ?? '').toString())
        setTrackStock(supply.trackStock)
    }, [open, supply])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await mutateAsync({
            id: supply.id,
            data: {
                name,
                baseUnit: supply.baseUnit,
                trackStock,
                unitCost: Number(unitCost) / 100,
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

                    <ModuleGate module="stock">
                        <TrackStockField
                            id="supply-track-stock"
                            checked={trackStock}
                            onCheckedChange={setTrackStock}
                        />
                    </ModuleGate>

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
