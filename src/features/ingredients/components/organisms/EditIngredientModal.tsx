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
import React, { useEffect, useState } from 'react'
import { formatCurrencyInput } from '@/shared/helpers/formatHelper'
import { useUpdateIngredient } from '@/features/ingredients/hooks/mutations/useUpdateIngredient'
import { UpdateIngredientDataType } from '@/features/ingredients/services/ingredient.api'
import { IngredientModel } from '@/features/ingredients/services/ingredient.model'

interface EditIngredientModalProps {
    ingredient: IngredientModel
    open: boolean
    onOpenChange: (open: boolean) => void
}

interface FormState {
    name: string
    unit: string
    unitPrice: string
    stockQuantity: string
    minimumStockQuantity: string
}

const mapIngredientToForm = (ingredient: IngredientModel): FormState => ({
    name: ingredient.name,
    unit: ingredient.unit,
    unitPrice: formatCurrencyInput(
        ingredient.unitPrice.toString().replace('.', ',')
    ),
    stockQuantity: ingredient.stockQuantity.toString(),
    minimumStockQuantity: ingredient.minimumStockQuantity?.toString() ?? '',
})

export const EditIngredientModal = ({
    ingredient,
    open,
    onOpenChange,
}: EditIngredientModalProps) => {
    const [form, setForm] = useState<FormState>(() =>
        mapIngredientToForm(ingredient)
    )

    const {
        mutateAsync: updateIngredient,
        isPending,
        error,
    } = useUpdateIngredient()

    useEffect(() => {
        setForm(mapIngredientToForm(ingredient))
    }, [ingredient])

    const setField = <K extends keyof FormState>(
        field: K,
        value: FormState[K]
    ) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const payload: UpdateIngredientDataType = {
            name: form.name,
            unit: form.unit,
            unitPrice: Number(form.unitPrice.replace(',', '.')),
            stockQuantity: Number(form.stockQuantity),
        }

        if (form.minimumStockQuantity !== '')
            payload.minimumStockQuantity = Number(form.minimumStockQuantity)

        await updateIngredient({
            id: ingredient.id,
            data: payload,
        })

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar ingrediente</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Atualize os dados do ingrediente e clique em salvar.
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Nome</Label>
                        <Input
                            value={form.name}
                            onChange={(e) => setField('name', e.target.value)}
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Unidade de medida</Label>
                        <Input
                            value={form.unit}
                            onChange={(e) => setField('unit', e.target.value)}
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Preço unitário</Label>
                        <Input
                            placeholder="0,00"
                            inputMode="decimal"
                            value={form.unitPrice}
                            onChange={(e) =>
                                setField(
                                    'unitPrice',
                                    formatCurrencyInput(e.target.value)
                                )
                            }
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Quantidade em estoque</Label>
                        <Input
                            type="number"
                            min={0}
                            value={form.stockQuantity}
                            onChange={(e) =>
                                setField('stockQuantity', e.target.value)
                            }
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Estoque mínimo</Label>
                        <Input
                            type="number"
                            min={0}
                            value={form.minimumStockQuantity}
                            onChange={(e) =>
                                setField('minimumStockQuantity', e.target.value)
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
                                    : 'Salvar alterações'}
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
