import React, { useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from 'ui/dialog'
import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'
import { formatCurrencyFromInput } from '@/shared/helpers/formatHelper'
import { MEASUREMENT_UNITS } from '@/features/ingredients/services/measurementUnits'
import { useCreateSupply } from '@/features/supplies/hooks/mutations/useCreateSupply'
import { CreateSupplyDataType } from '@/features/supplies/services/supply.api'

export function NewSupplyModal() {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [baseUnit, setBaseUnit] = useState('')
    const [unitCost, setUnitCost] = useState('')
    const [stockQuantity, setStockQuantity] = useState('')
    const [minimumStockQuantity, setMinimumStockQuantity] = useState('')

    const { mutateAsync, isPending, error } = useCreateSupply()

    const reset = () => {
        setName('')
        setBaseUnit('')
        setUnitCost('')
        setStockQuantity('')
        setMinimumStockQuantity('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const payload: CreateSupplyDataType = {
            name,
            baseUnit,
            unitCost: Number(unitCost) / 100,
            stockQuantity: Number(stockQuantity),
        }

        if (minimumStockQuantity !== '') {
            payload.minimumStockQuantity = Number(minimumStockQuantity)
        }

        await mutateAsync(payload)
        reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Novo insumo</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Novo insumo</DialogTitle>
                    <DialogDescription>
                        Cadastre insumos nao alimenticios como embalagem,
                        colher, etiqueta etc.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Nome*</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Unidade base*</Label>
                        <Select value={baseUnit} onValueChange={setBaseUnit}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a unidade" />
                            </SelectTrigger>
                            <SelectContent>
                                {MEASUREMENT_UNITS.map((unit) => (
                                    <SelectItem
                                        key={unit.value}
                                        value={unit.value}
                                    >
                                        {unit.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-3">
                        <Label>Custo unitario*</Label>
                        <Input
                            type="text"
                            value={formatCurrencyFromInput(unitCost)}
                            onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, '')
                                setUnitCost(digits)
                            }}
                            required
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Estoque inicial*</Label>
                        <Input
                            type="number"
                            min={0}
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(e.target.value)}
                            required
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
                            <Button
                                type="submit"
                                disabled={isPending || !baseUnit}
                            >
                                {isPending ? 'Salvando...' : 'Adicionar'}
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
