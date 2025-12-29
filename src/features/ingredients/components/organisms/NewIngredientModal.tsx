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
import { Label } from 'ui/label'
import { Input } from 'ui/input'
import React, { useState } from 'react'
import { useCreateIngredient } from '@/features/ingredients/hooks/mutations/useCreateIngredient'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { CreateIngredientData } from '@/features/ingredients/services/ingredient.api'

export const NewIngredientModal = () => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [unit, setUnit] = useState('')
    const [unitPrice, setUnitPrice] = useState('')
    const [minimumStockQuantity, setMinimumStockQuantity] = useState('')
    const [stockQuantity, setStockQuantity] = useState<string | undefined>('')

    const {
        mutateAsync: createIngredient,
        isPending,
        error,
    } = useCreateIngredient()

    const resetForm = () => {
        setName('')
        setUnit('')
        setUnitPrice('')
        setMinimumStockQuantity('')
        setStockQuantity('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const payload: CreateIngredientData = {
            name,
            unit,
            unitPrice: Number(unitPrice.replace(',', '.')),
            stockQuantity: Number(stockQuantity),
        }

        if (minimumStockQuantity !== '')
            payload.minimumStockQuantity = Number(minimumStockQuantity)

        await createIngredient(payload)

        resetForm()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Novo ingrediente</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Novo ingrediente</DialogTitle>
                    <DialogDescription>
                        Preencha os dados do ingrediente e clique em salvar.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Nome*</Label>
                        <Input
                            placeholder="Nome do ingrediente"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Unidade de medida*</Label>
                        <Input
                            placeholder="Kg, g, unidade, etc."
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Preço unitário*</Label>
                        <Input
                            placeholder="0,00"
                            inputMode="decimal"
                            value={unitPrice}
                            onChange={(e) =>
                                setUnitPrice(formatCurrency(e.target.value))
                            }
                            required
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Quantidade em estoque*</Label>
                        <Input
                            type="number"
                            min={0}
                            placeholder="20"
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Estoque mínimo</Label>
                        <Input
                            type="number"
                            min={0}
                            placeholder="19"
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
