'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'

import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { Switch } from 'ui/switch'

import { useGetRecipe } from '@/features/recipes/list/hooks/queries/useGetRecipe'
import { useUpdateRecipe } from '@/features/recipes/list/hooks/mutations/useUpdateRecipe'
import { UpdateRecipeDataType } from '@/features/recipes/services/recipe.api'
import { RecipeModel } from '@/features/recipes/services/recipe.model'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { useGetRecipeIngredients } from '@/features/recipes/details/hooks/queries/useGetRecipeIngredients'

interface FormState {
    name: string
    category: string
    hours: string
    minutes: string
    isActive: boolean
}

const minutesToHoursAndMinutes = (total?: number) => {
    if (!total || total <= 0) {
        return { hours: '', minutes: '' }
    }

    return {
        hours: Math.floor(total / 60).toString(),
        minutes: (total % 60).toString(),
    }
}

const hoursAndMinutesToMinutes = (hours: string, minutes: string) => {
    const h = Number(hours) || 0
    const m = Number(minutes) || 0

    return h * 60 + m
}

const mapRecipeToForm = (recipe: RecipeModel): FormState => {
    const { hours, minutes } = minutesToHoursAndMinutes(recipe.preparationTime)

    return {
        name: recipe.name,
        category: recipe.category,
        hours,
        minutes,
        isActive: recipe.isActive,
    }
}

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

    const isDirty = useMemo(() => {
        if (!form || !initialForm) return false

        return JSON.stringify(form) !== JSON.stringify(initialForm)
    }, [form, initialForm])

    const estimatedCost = useMemo(() => {
        if (!recipeIngredients?.length) return 0

        return recipeIngredients.reduce(
            (total, item) => total + item.unitPrice * item.quantityUsed,
            0
        )
    }, [recipeIngredients])

    if (isLoading || !recipe || !form) return null

    const setField = <K extends keyof FormState>(
        field: K,
        value: FormState[K]
    ) => {
        setForm((prev) => (prev ? { ...prev, [field]: value } : prev))
    }

    const handleSave = async () => {
        if (!isDirty) return

        const payload: UpdateRecipeDataType = {
            name: form.name,
            category: form.category,
            isActive: form.isActive,
        }

        const totalMinutes = hoursAndMinutesToMinutes(form.hours, form.minutes)

        if (totalMinutes > 0) {
            payload.preparationTime = totalMinutes
        }

        await updateRecipe({
            id: recipeId,
            data: payload,
        })

        setInitialForm(form)
    }

    return (
        <form className="my-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                    Informações básicas
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Nome</Label>
                        <Input
                            value={form.name}
                            onChange={(e) => setField('name', e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Categoria</Label>
                        <Input
                            value={form.category}
                            onChange={(e) =>
                                setField('category', e.target.value)
                            }
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Tempo de preparo</Label>

                        <div className="flex gap-2">
                            <div className="w-full">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Horas
                                </Label>
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="Horas"
                                    value={form.hours}
                                    onChange={(e) =>
                                        setField('hours', e.target.value)
                                    }
                                />
                            </div>
                            <div className="w-full">
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Minutos
                                </Label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={59}
                                    placeholder="Minutos"
                                    value={form.minutes}
                                    onChange={(e) =>
                                        setField('minutes', e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                    Status
                </h3>

                <div className="flex items-center gap-3">
                    <Switch
                        checked={form.isActive}
                        onCheckedChange={(checked) =>
                            setField('isActive', checked)
                        }
                    />
                    <Label>Receita ativa</Label>
                </div>
            </section>

            <section className="space-y-4 border-t pt-6">
                <h3 className="text-sm font-medium text-muted-foreground">
                    Informacoes de custo
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Custo estimado da receita</Label>
                        <Input value={formatCurrency(estimatedCost)} disabled />
                    </div>

                    <div className="grid gap-2">
                        <Label>Preco de referencia</Label>
                        <Input
                            value={formatCurrency(recipe.finalPrice)}
                            disabled
                        />
                    </div>
                </div>
            </section>

            <div className="flex justify-end gap-2 pt-6">
                <Button
                    type="button"
                    variant="outline"
                    disabled={!isDirty || isPending}
                    onClick={() => setForm(initialForm)}
                >
                    Descartar
                </Button>

                <Button
                    type="button"
                    disabled={!isDirty || isPending}
                    onClick={handleSave}
                >
                    {isPending ? 'Salvando...' : 'Salvar alterações'}
                </Button>
            </div>
        </form>
    )
}
