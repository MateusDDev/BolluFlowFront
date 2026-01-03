'use client'

import React, { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'

import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { Label } from 'ui/label'

import { useGetRecipe } from '@/features/recipes/list/hooks/queries/useGetRecipe'
import { useGetRecipeIngredients } from '@/features/recipes/details/hooks/queries/useGetRecipeIngredients'
import { useUpdateRecipePricing } from '@/features/recipes/details/hooks/mutations/useUpdateRecipePricing'
import { UpdateRecipePricingDataType } from '@/features/recipes/services/recipe.api'
import { formatCurrencyInput } from '@/shared/helpers/formatHelper'
import { InfoIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from 'ui/tooltip'

interface PricingFormState {
    indirectCost: string
    markup: string
    discount: string
    finalPrice: string
}

function calculateSuggestedPrice({
    baseCost,
    indirectCostPercentage,
    markupPercentage,
    discountPercentage = 0,
}: {
    baseCost: number
    indirectCostPercentage: string | number
    markupPercentage: string | number
    discountPercentage?: string | number
}) {
    const indirectCostPct = Number(indirectCostPercentage) || 0
    const markupPct = Number(markupPercentage) || 0
    const discountPct = Number(discountPercentage) || 0

    const costWithIndirect = baseCost * (1 + indirectCostPct / 100)
    const priceWithMarkup = costWithIndirect * (1 + markupPct / 100)
    const finalPrice = priceWithMarkup * (1 - discountPct / 100)

    return Math.round(finalPrice * 100) / 100
}

export function RecipePricing() {
    const { id } = useParams<{ id: string }>()
    const recipeId = Number(id)

    const { data: recipe, isLoading: isLoadingRecipe } = useGetRecipe(recipeId)
    const { data: recipeIngredients, isLoading: isLoadingIngredients } =
        useGetRecipeIngredients(recipeId)

    const { mutateAsync: updatePricing, isPending } = useUpdateRecipePricing()

    const initialForm = useMemo<PricingFormState | null>(() => {
        if (!recipe) return null

        return {
            indirectCost: recipe.indirectCostPercentage.toString(),
            markup: recipe.markupPercentage.toString(),
            discount: recipe.discountPercentage?.toString() ?? '',
            finalPrice: recipe.finalPrice.toString(),
        }
    }, [recipe])

    const [form, setForm] = useState<PricingFormState | null>(null)
    if (!form && initialForm) setForm(initialForm)

    const baseCost = useMemo(() => {
        if (!recipeIngredients) return 0
        return recipeIngredients.reduce(
            (total, ingredient) =>
                total + ingredient.unitPrice * ingredient.quantityUsed,
            0
        )
    }, [recipeIngredients])

    const suggestedPrice = useMemo(() => {
        if (!form) return 0

        return calculateSuggestedPrice({
            baseCost,
            indirectCostPercentage: form.indirectCost,
            markupPercentage: form.markup,
            discountPercentage: form.discount,
        })
    }, [baseCost, form])

    const isDirty = useMemo(() => {
        if (!form || !initialForm) return false
        return JSON.stringify(form) !== JSON.stringify(initialForm)
    }, [form, initialForm])

    if (isLoadingRecipe || isLoadingIngredients || !recipe || !form) {
        return null
    }

    const setField = <K extends keyof PricingFormState>(
        field: K,
        value: string
    ) => {
        setForm((prev) => (prev ? { ...prev, [field]: value } : prev))
    }

    const handleSave = async () => {
        if (!isDirty || !form) return

        const payload: UpdateRecipePricingDataType = {
            indirectCostPercentage: Number(form.indirectCost) || 0,
            markupPercentage: Number(form.markup) || 0,
            finalPrice:
                form.finalPrice === '' ? 0 : Number(form.finalPrice) / 100,
        }

        if (form.discount !== '')
            payload.discountPercentage = Number(form.discount) || 0

        console.log('Form', form)

        console.log('Payload', payload)

        await updatePricing({
            recipeId,
            data: payload,
        })
    }

    return (
        <form className="my-6 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                    Precificação
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Custo indireto (%)</Label>
                        <Input
                            required
                            type="number"
                            value={form.indirectCost}
                            onChange={(e) =>
                                setField('indirectCost', e.target.value)
                            }
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Margem de lucro (%)</Label>
                        <Input
                            required
                            type="number"
                            value={form.markup}
                            onChange={(e) => setField('markup', e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Desconto (%)</Label>
                        <Input
                            type="number"
                            value={form.discount}
                            onChange={(e) =>
                                setField('discount', e.target.value)
                            }
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="flex items-center gap-2">
                            Preço sugerido
                            <Tooltip>
                                <TooltipTrigger>
                                    <button>
                                        <InfoIcon className="w-4 h-4 text-primary-foreground" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        Calculado automaticamente com base no
                                        custo total dos ingredientes e nos
                                        campos de precificação adicionados.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </Label>
                        <Input
                            value={suggestedPrice.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            })}
                            disabled
                        />
                    </div>

                    <div className="grid gap-2 col-span-2">
                        <Label className="flex items-center gap-2">
                            Preço final
                            <Tooltip>
                                <TooltipTrigger>
                                    <button>
                                        <InfoIcon className="w-4 h-4 text-primary-foreground" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        Valor que será aplicado na receita. Pode
                                        ser igual ao preço sugerido ou definido
                                        manualmente.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </Label>
                        <Input
                            type="text"
                            value={formatCurrencyInput(form.finalPrice)}
                            onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, '')
                                setField('finalPrice', digits)
                            }}
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
                    type="submit"
                    disabled={!isDirty || isPending}
                    onClick={handleSave}
                >
                    {isPending ? 'Salvando...' : 'Salvar alterações'}
                </Button>
            </div>
        </form>
    )
}
