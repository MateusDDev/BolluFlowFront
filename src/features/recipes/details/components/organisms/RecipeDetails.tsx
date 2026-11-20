'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from 'ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from 'ui/card'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { Switch } from 'ui/switch'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { ModuleGate } from '@/shared/modules/ModuleGate'
import { HelpTip } from 'components/HelpTip'
import { useGetRecipe } from '@/features/recipes/list/hooks/queries/useGetRecipe'
import { useUpdateRecipe } from '@/features/recipes/list/hooks/mutations/useUpdateRecipe'
import { UpdateRecipeDataType } from '@/features/recipes/services/recipe.api'
import { RecipeModel } from '@/features/recipes/services/recipe.model'
import { useGetRecipeIngredients } from '@/features/recipes/details/hooks/queries/useGetRecipeIngredients'
import {
    formatStockQuantity,
    formatUnitCost,
    fromBaseQuantity,
    getStockUnit,
    toBaseQuantity,
} from '@/features/stockItems/services/stockItemUnits'

interface FormState {
    name: string
    category: string
    recipeYield: string
    preparationMinutes: string
    minimumStock: string
    isActive: boolean
}

function parseDecimal(value: string) {
    if (value.trim() === '') return null
    const parsed = Number(value.replace(',', '.'))
    return Number.isFinite(parsed) ? parsed : null
}

function formatInputNumber(value: number) {
    return value.toLocaleString('pt-BR', { maximumFractionDigits: 3 })
}

const mapRecipeToForm = (recipe: RecipeModel): FormState => ({
    name: recipe.name,
    category: recipe.category,
    recipeYield: recipe.yield ? formatInputNumber(recipe.yield) : '',
    preparationMinutes: recipe.preparationTime
        ? String(recipe.preparationTime)
        : '',
    minimumStock: recipe.minimumStockQuantity
        ? formatInputNumber(
              fromBaseQuantity(recipe.minimumStockQuantity, recipe.baseUnit)
          )
        : '',
    isActive: recipe.isActive,
})

export function RecipeDetails() {
    const { id } = useParams<{ id: string }>()
    const recipeId = Number(id)

    const { data: recipe, isLoading } = useGetRecipe(recipeId)
    const { data: recipeIngredients } = useGetRecipeIngredients(recipeId)
    const { mutateAsync: updateRecipe, isPending } = useUpdateRecipe()

    const [form, setForm] = useState<FormState | null>(null)
    const [initialForm, setInitialForm] = useState<FormState | null>(null)

    useEffect(() => {
        if (!recipe) return

        const mapped = mapRecipeToForm(recipe)

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm(mapped)
        setInitialForm(mapped)
    }, [recipe])

    const isDirty = useMemo(
        () =>
            !!form &&
            !!initialForm &&
            JSON.stringify(form) !== JSON.stringify(initialForm),
        [form, initialForm]
    )

    const batchCost = useMemo(
        () =>
            (recipeIngredients ?? []).reduce(
                (total, item) => total + item.unitPrice * item.quantityUsed,
                0
            ),
        [recipeIngredients]
    )

    if (isLoading || !recipe || !form) return null

    const unitInfo = getStockUnit(recipe.baseUnit)
    const yieldValue = parseDecimal(form.recipeYield)
    const costPerBaseUnit =
        yieldValue && yieldValue > 0 ? batchCost / yieldValue : null

    const setField = <K extends keyof FormState>(
        field: K,
        value: FormState[K]
    ) => {
        setForm((prev) => (prev ? { ...prev, [field]: value } : prev))
    }

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isDirty) return

        const minimumValue = parseDecimal(form.minimumStock)
        const payload: UpdateRecipeDataType = {
            name: form.name.trim(),
            category: form.category.trim(),
            baseUnit: String(recipe.baseUnit),
            yield: yieldValue,
            isActive: form.isActive,
            minimumStockQuantity:
                minimumValue === null
                    ? null
                    : toBaseQuantity(minimumValue, recipe.baseUnit),
        }

        const minutes = Number(form.preparationMinutes) || 0
        if (minutes > 0) payload.preparationTime = minutes

        await updateRecipe({ id: recipeId, data: payload })

        setInitialForm(form)
    }

    return (
        <div className="my-6 grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
                <form onSubmit={handleSave}>
                    <CardHeader>
                        <CardTitle>Informações</CardTitle>
                    </CardHeader>

                    <CardContent className="grid gap-4 pt-4 sm:grid-cols-2">
                        <div className="grid gap-2 sm:col-span-2">
                            <Label htmlFor="recipe-name">Nome</Label>
                            <Input
                                id="recipe-name"
                                value={form.name}
                                onChange={(e) =>
                                    setField('name', e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="recipe-category">Categoria</Label>
                            <Input
                                id="recipe-category"
                                placeholder="Ex.: Recheios"
                                value={form.category}
                                onChange={(e) =>
                                    setField('category', e.target.value)
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="recipe-time">
                                Tempo de preparo (min)
                            </Label>
                            <Input
                                id="recipe-time"
                                inputMode="numeric"
                                placeholder="Opcional"
                                value={form.preparationMinutes}
                                onChange={(e) =>
                                    setField(
                                        'preparationMinutes',
                                        e.target.value.replace(/\D/g, '')
                                    )
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="recipe-yield">
                                <HelpTip>
                                    Quanto a receita inteira produz. É o que
                                    divide o custo: rende mais, cada grama sai
                                    mais barato nos produtos.
                                </HelpTip>
                            </Label>
                            <Input
                                id="recipe-yield"
                                inputMode="decimal"
                                placeholder="Ex.: 1200"
                                value={form.recipeYield}
                                onChange={(e) =>
                                    setField('recipeYield', e.target.value)
                                }
                            />
                            <p className="text-muted-foreground text-xs">
                                {yieldValue
                                    ? `= ${formatStockQuantity(yieldValue, recipe.baseUnit)}`
                                    : 'Sem rendimento, a receita não tem custo por unidade nos produtos.'}
                            </p>
                        </div>

                        <ModuleGate module="stock">
                            <div className="grid gap-2">
                                <Label htmlFor="recipe-minimum">
                                    <HelpTip>
                                        Quando o estoque desta receita ficar
                                        abaixo desse valor, ela aparece nos
                                        alertas do Dashboard.
                                    </HelpTip>
                                </Label>
                                <Input
                                    id="recipe-minimum"
                                    inputMode="decimal"
                                    placeholder="Opcional"
                                    value={form.minimumStock}
                                    onChange={(e) =>
                                        setField('minimumStock', e.target.value)
                                    }
                                />
                            </div>
                        </ModuleGate>

                        <div className="flex items-center justify-between gap-4 rounded-lg border p-3 sm:col-span-2">
                            <div>
                                <Label htmlFor="recipe-active">
                                    Receita ativa
                                </Label>
                                <p className="text-muted-foreground text-sm">
                                    Inativa, some das opções ao montar a ficha
                                    técnica de produtos.
                                </p>
                            </div>
                            <Switch
                                id="recipe-active"
                                checked={form.isActive}
                                onCheckedChange={(checked) =>
                                    setField('isActive', checked)
                                }
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="justify-end gap-2 pt-6">
                        <Button
                            type="button"
                            variant="ghost"
                            disabled={!isDirty || isPending}
                            onClick={() => setForm(initialForm)}
                        >
                            Descartar
                        </Button>
                        <Button type="submit" disabled={!isDirty || isPending}>
                            {isPending ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Custo</CardTitle>
                    <CardDescription>
                        Calculado pelos ingredientes, com o custo atual de cada
                        um.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Receita inteira
                        </span>
                        <strong className="tabular-nums">
                            {formatCurrency(batchCost)}
                        </strong>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Por {unitInfo.largeName}
                        </span>
                        <strong className="tabular-nums">
                            {costPerBaseUnit !== null
                                ? formatUnitCost(
                                      costPerBaseUnit,
                                      recipe.baseUnit
                                  )
                                : '—'}
                        </strong>
                    </div>
                    {(recipeIngredients?.length ?? 0) === 0 && (
                        <p className="text-muted-foreground">
                            Adicione ingredientes na aba Ingredientes.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
