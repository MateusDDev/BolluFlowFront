'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from 'ui/dialog'
import { Button } from 'ui/button'
import { Label } from 'ui/label'
import { Input } from 'ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { useUpdateRecipeIngredient } from '@/features/recipes/details/hooks/mutations/useUpdateRecipeIngredient'
import { RecipeIngredientModel } from '@/features/recipes/services/recipeIngredient.model'
import { INGREDIENT_CONFIG } from '@/features/stockItems/services/stockItem.config'
import { useStockItemPackages } from '@/features/stockItems/hooks/useStockItemActions'
import { buildQuantityUnitOptions } from '@/features/stockItems/services/stockItemQuantityUnits'
import { formatStockQuantity } from '@/features/stockItems/services/stockItemUnits'

interface EditRecipeIngredientModalProps {
    recipeId: number
    recipeIngredient: RecipeIngredientModel
    open: boolean
    onOpenChange: (open: boolean) => void
}

function formatInputNumber(value: number) {
    return value.toLocaleString('pt-BR', {
        maximumFractionDigits: 3,
        useGrouping: false,
    })
}

export function EditRecipeIngredientModal({
    recipeId,
    recipeIngredient,
    open,
    onOpenChange,
}: EditRecipeIngredientModalProps) {
    const [quantity, setQuantity] = useState('')
    const [unitValue, setUnitValue] = useState('base')

    const { data: packages = [] } = useStockItemPackages(
        INGREDIENT_CONFIG,
        recipeIngredient.ingredientId,
        open
    )

    const {
        mutateAsync: updateRecipeIngredient,
        isPending,
        error,
    } = useUpdateRecipeIngredient()

    useEffect(() => {
        if (!open) return

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setQuantity(formatInputNumber(recipeIngredient.quantityUsed))
        setUnitValue('base')
    }, [open, recipeIngredient])

    const unitOptions = useMemo(
        () => buildQuantityUnitOptions(recipeIngredient.unit, packages),
        [recipeIngredient.unit, packages]
    )

    const selectedUnit =
        unitOptions.find((option) => option.value === unitValue) ??
        unitOptions.find((option) => option.value === 'base')

    const quantityValue = Number(quantity.replace(',', '.')) || 0
    const quantityInBase = quantityValue * (selectedUnit?.factor ?? 1)

    const handleUnitChange = (value: string) => {
        const nextUnit = unitOptions.find((option) => option.value === value)
        if (nextUnit && quantityInBase > 0)
            setQuantity(formatInputNumber(quantityInBase / nextUnit.factor))
        setUnitValue(value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (quantityInBase <= 0) return

        await updateRecipeIngredient({
            recipeId,
            ingredientId: recipeIngredient.ingredientId,
            data: { quantityUsed: quantityInBase },
        })

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[440px]">
                <DialogHeader>
                    <DialogTitle>{recipeIngredient.name}</DialogTitle>
                    <DialogDescription>
                        Quanto deste ingrediente vai na receita inteira.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label>Quantidade</Label>
                        <div className="grid grid-cols-[1fr_2fr] gap-2">
                            <Input
                                inputMode="decimal"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                autoFocus
                            />
                            <Select
                                value={selectedUnit?.value}
                                onValueChange={handleUnitChange}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {unitOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {quantityInBase > 0 && (
                            <p className="text-muted-foreground text-xs">
                                ={' '}
                                {formatStockQuantity(
                                    quantityInBase,
                                    recipeIngredient.unit
                                )}{' '}
                                · custo{' '}
                                {formatCurrency(
                                    quantityInBase * recipeIngredient.unitPrice
                                )}
                            </p>
                        )}
                    </div>

                    {error && (
                        <p className="text-destructive text-sm">
                            {error.message}
                        </p>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending || quantityInBase <= 0}
                        >
                            {isPending ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
