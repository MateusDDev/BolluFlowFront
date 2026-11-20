'use client'

import React, { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from 'ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from 'ui/dialog'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'
import { SearchableSelect } from 'components/SearchableSelect'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { useGetIngredients } from '@/features/recipes/details/hooks/queries/useGetIngredients'
import { useCreateRecipeIngredient } from '@/features/recipes/details/hooks/mutations/useCreateRecipeIngredient'
import { useGetRecipeIngredients } from '@/features/recipes/details/hooks/queries/useGetRecipeIngredients'
import { INGREDIENT_CONFIG } from '@/features/stockItems/services/stockItem.config'
import { useStockItemPackages } from '@/features/stockItems/hooks/useStockItemActions'
import { buildQuantityUnitOptions } from '@/features/stockItems/services/stockItemQuantityUnits'
import { formatStockQuantity } from '@/features/stockItems/services/stockItemUnits'

export function NewRecipeIngredientModal() {
    const { id } = useParams<{ id: string }>()
    const recipeId = Number(id)

    const [open, setOpen] = useState(false)
    const [ingredientId, setIngredientId] = useState('')
    const [quantity, setQuantity] = useState('')
    const [unitValue, setUnitValue] = useState('base')

    const { data: ingredients, isLoading } = useGetIngredients()
    const { data: recipeIngredients } = useGetRecipeIngredients(recipeId)
    const {
        mutateAsync: createRecipeIngredient,
        isPending,
        error,
    } = useCreateRecipeIngredient()

    const selectedIngredient = ingredients?.find(
        (ingredient) => ingredient.id.toString() === ingredientId
    )

    const { data: packages = [] } = useStockItemPackages(
        INGREDIENT_CONFIG,
        Number(ingredientId),
        open && !!selectedIngredient
    )

    const unitOptions = useMemo(
        () =>
            selectedIngredient
                ? buildQuantityUnitOptions(
                      selectedIngredient.baseUnit,
                      packages
                  )
                : [],
        [selectedIngredient, packages]
    )

    const selectedUnit =
        unitOptions.find((option) => option.value === unitValue) ??
        unitOptions.find((option) => option.value === 'base')

    const quantityValue = Number(quantity.replace(',', '.')) || 0
    const quantityInBase = quantityValue * (selectedUnit?.factor ?? 1)

    const usedIngredientIds = recipeIngredients?.map(
        (ingredient) => ingredient.ingredientId
    )

    const availableIngredients = ingredients?.filter(
        (ingredient) => !usedIngredientIds?.includes(ingredient.id)
    )

    const handleOpenChange = (next: boolean) => {
        setOpen(next)
        if (!next) return

        setIngredientId('')
        setQuantity('')
        setUnitValue('base')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!selectedIngredient || quantityInBase <= 0) return

        await createRecipeIngredient({
            recipeId,
            data: {
                ingredientId: selectedIngredient.id,
                quantityUsed: quantityInBase,
            },
        })

        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4" />
                    Adicionar ingrediente
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[440px]">
                <DialogHeader>
                    <DialogTitle>Adicionar ingrediente</DialogTitle>
                    <DialogDescription>
                        Quanto deste ingrediente vai na receita inteira.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label>Ingrediente</Label>
                        <SearchableSelect
                            options={
                                availableIngredients?.map((ingredient) => ({
                                    value: ingredient.id.toString(),
                                    label: ingredient.name,
                                })) ?? []
                            }
                            value={ingredientId}
                            onValueChange={(value) => {
                                setIngredientId(value)
                                setUnitValue('base')
                            }}
                            disabled={isLoading}
                            placeholder="Selecione um ingrediente"
                            searchPlaceholder="Buscar ingrediente..."
                            emptyMessage="Nenhum ingrediente encontrado."
                        />
                    </div>

                    {selectedIngredient && (
                        <div className="grid gap-2">
                            <Label>Quantidade</Label>
                            <div className="grid grid-cols-[1fr_2fr] gap-2">
                                <Input
                                    inputMode="decimal"
                                    placeholder="Ex.: 200"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(e.target.value)
                                    }
                                    autoFocus
                                />
                                <Select
                                    value={selectedUnit?.value}
                                    onValueChange={setUnitValue}
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
                                        selectedIngredient.baseUnit
                                    )}{' '}
                                    · custo{' '}
                                    {formatCurrency(
                                        quantityInBase *
                                            selectedIngredient.unitCost
                                    )}
                                </p>
                            )}
                        </div>
                    )}

                    {error && (
                        <p className="text-destructive text-sm">
                            {error.message}
                        </p>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                isPending ||
                                !selectedIngredient ||
                                quantityInBase <= 0
                            }
                        >
                            {isPending ? 'Salvando...' : 'Adicionar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
