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
import { Label } from 'ui/label'
import { Input } from 'ui/input'

import { useUpdateRecipeIngredient } from '@/features/recipes/details/hooks/mutations/useUpdateRecipeIngredient'
import { formatQuantityInput } from '@/shared/helpers/formatHelper'
import { getMeasurementUnitLabel } from '@/features/ingredients/services/measurementUnits'
import { RecipeIngredientModel } from '@/features/recipes/services/recipeIngredient.model'

interface EditRecipeIngredientModalProps {
    recipeId: number
    recipeIngredient: RecipeIngredientModel
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditRecipeIngredientModal({
    recipeId,
    recipeIngredient,
    open,
    onOpenChange,
}: EditRecipeIngredientModalProps) {
    const [quantityUsed, setQuantityUsed] = useState('')

    const {
        mutateAsync: updateRecipeIngredient,
        isPending,
        error,
    } = useUpdateRecipeIngredient()

    useEffect(() => {
        if (open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setQuantityUsed(
                recipeIngredient.quantityUsed.toString().replace('.', ',')
            )
        }
    }, [open, recipeIngredient])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const normalizedQuantity = Number(quantityUsed.replace(',', '.'))

        if (isNaN(normalizedQuantity) || normalizedQuantity <= 0) return

        await updateRecipeIngredient({
            recipeId,
            ingredientId: recipeIngredient.ingredientId,
            data: {
                quantityUsed: normalizedQuantity,
            },
        })

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar quantidade</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Atualize a quantidade usada do ingrediente selecionado.
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <div className="flex justify-between items-center">
                            <Label>Quantidade usada*</Label>

                            {recipeIngredient.baseUnit && (
                                <span className="text-sm text-muted-foreground">
                                    {getMeasurementUnitLabel(recipeIngredient.baseUnit)}
                                </span>
                            )}
                        </div>

                        <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="Ex: 0,5"
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
