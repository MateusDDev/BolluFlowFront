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
import {
    formatCurrency,
    formatCurrencyFromInput,
} from '@/shared/helpers/formatHelper'
import { useModules } from '@/shared/modules/useModules'
import { useGetProduct } from '@/features/products/list/hooks/queries/useGetProduct'
import { useGetProductComponents } from '@/features/products/details/hooks/queries/useGetProductComponents'
import { useUpdateProductPricing } from '@/features/products/details/hooks/mutations/useUpdateProductPricing'
import { UpdateProductPricingDataType } from '@/features/products/services/product.api'
import { useGetProfile } from '@/features/profile/hooks/queries/useGetProfile'

interface PricingFormState {
    indirectCost: string
    markup: string
    discount: string
    finalPrice: string
}

function calculateSuggestedPrice(
    baseCost: number,
    form: PricingFormState
): number {
    const indirectCostPct = Number(form.indirectCost) || 0
    const markupPct = Number(form.markup) || 0
    const discountPct = Number(form.discount) || 0

    const costWithIndirect = baseCost * (1 + indirectCostPct / 100)
    const priceWithMarkup = costWithIndirect * (1 + markupPct / 100)
    const finalPrice = priceWithMarkup * (1 - discountPct / 100)

    return Math.round(finalPrice * 100) / 100
}

export function ProductPricing() {
    const { id } = useParams<{ id: string }>()
    const productId = Number(id)

    const { hasModule } = useModules()
    const usesRecipes = hasModule('recipes')

    const { data: product } = useGetProduct(productId)
    const { data: components } = useGetProductComponents(productId)
    const { data: profile } = useGetProfile()
    const { mutateAsync, isPending } = useUpdateProductPricing()

    const initialForm = useMemo<PricingFormState | null>(() => {
        if (!product) return null

        const indirectCost =
            product.indirectCostPercentage ?? profile?.indirectCostRate ?? 0

        return {
            indirectCost: indirectCost.toString(),
            markup: product.markupPercentage.toString(),
            discount: product.discountPercentage?.toString() ?? '',
            finalPrice: Math.round(product.finalPrice * 100).toString(),
        }
    }, [product, profile?.indirectCostRate])

    const [form, setForm] = useState<PricingFormState | null>(null)

    useEffect(() => {
        if (!initialForm) return

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm(initialForm)
    }, [initialForm])

    const baseCost = useMemo(
        () =>
            (components ?? []).reduce(
                (total, component) =>
                    total + component.unitPrice * component.quantityUsed,
                0
            ),
        [components]
    )

    const isDirty = useMemo(
        () =>
            !!form &&
            !!initialForm &&
            JSON.stringify(form) !== JSON.stringify(initialForm),
        [form, initialForm]
    )

    if (!product || !form) return null

    const suggestedPrice = calculateSuggestedPrice(baseCost, form)
    const finalPriceValue =
        form.finalPrice === '' ? 0 : Number(form.finalPrice) / 100
    const margin =
        finalPriceValue > 0 && baseCost > 0
            ? ((finalPriceValue - baseCost) / finalPriceValue) * 100
            : null

    const setField = (field: keyof PricingFormState, value: string) => {
        setForm((prev) => (prev ? { ...prev, [field]: value } : prev))
    }

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const payload: UpdateProductPricingDataType = {
            indirectCostPercentage: usesRecipes
                ? form.indirectCost.trim() === ''
                    ? null
                    : Number(form.indirectCost)
                : product.indirectCostPercentage,
            markupPercentage: usesRecipes
                ? Number(form.markup) || 0
                : product.markupPercentage,
            finalPrice: finalPriceValue,
        }

        if (usesRecipes && form.discount !== '') {
            payload.discountPercentage = Number(form.discount) || 0
        }

        await mutateAsync({ productId, data: payload })
    }

    return (
        <Card>
            <form onSubmit={handleSave}>
                <CardHeader>
                    <CardTitle>Preço</CardTitle>
                    {usesRecipes && (
                        <CardDescription>
                            {baseCost > 0 ? (
                                <>
                                    Custo pela ficha técnica:{' '}
                                    <strong>{formatCurrency(baseCost)}</strong>
                                    {margin !== null && (
                                        <>
                                            {' '}
                                            · Margem real: {margin.toFixed(0)}%
                                        </>
                                    )}
                                </>
                            ) : (
                                'Monte a ficha técnica para ver o custo e o preço sugerido.'
                            )}
                        </CardDescription>
                    )}
                </CardHeader>

                <CardContent className="grid gap-4 pt-4">
                    {usesRecipes && (
                        <>
                            <div className="grid items-end gap-4 sm:grid-cols-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="pricing-indirect">
                                        Custo indireto (%)
                                    </Label>
                                    <Input
                                        id="pricing-indirect"
                                        type="number"
                                        value={form.indirectCost}
                                        onChange={(e) =>
                                            setField(
                                                'indirectCost',
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="pricing-markup">
                                        Margem de lucro (%)
                                    </Label>
                                    <Input
                                        id="pricing-markup"
                                        type="number"
                                        value={form.markup}
                                        onChange={(e) =>
                                            setField('markup', e.target.value)
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="pricing-discount">
                                        Desconto (%)
                                    </Label>
                                    <Input
                                        id="pricing-discount"
                                        type="number"
                                        value={form.discount}
                                        onChange={(e) =>
                                            setField('discount', e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="bg-muted/50 flex flex-wrap items-center justify-between gap-2 rounded-lg p-3 text-sm">
                                <span>
                                    Preço sugerido:{' '}
                                    <strong>
                                        {formatCurrency(suggestedPrice)}
                                    </strong>
                                </span>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={suggestedPrice <= 0}
                                    onClick={() =>
                                        setField(
                                            'finalPrice',
                                            Math.round(
                                                suggestedPrice * 100
                                            ).toString()
                                        )
                                    }
                                >
                                    Usar sugerido
                                </Button>
                            </div>
                        </>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="pricing-final">Preço de venda</Label>
                        <Input
                            id="pricing-final"
                            inputMode="decimal"
                            className="text-lg font-semibold"
                            value={formatCurrencyFromInput(form.finalPrice)}
                            onChange={(e) =>
                                setField(
                                    'finalPrice',
                                    e.target.value.replace(/\D/g, '')
                                )
                            }
                        />
                        <p className="text-muted-foreground text-xs">
                            É o valor cobrado nas vendas e mostrado no cardápio.
                        </p>
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
    )
}
