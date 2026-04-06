'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { InfoIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from 'ui/tooltip'
import {
    formatCurrency,
    formatCurrencyFromInput,
} from '@/shared/helpers/formatHelper'
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

export function ProductPricing() {
    const { id } = useParams<{ id: string }>()
    const productId = Number(id)

    const { data: product, isLoading: isLoadingProduct } =
        useGetProduct(productId)
    const { data: components, isLoading: isLoadingComponents } =
        useGetProductComponents(productId)

    const { mutateAsync, isPending } = useUpdateProductPricing()
    const { data: profile } = useGetProfile()

    const isUsingProductSpecificIndirectCost =
        product?.indirectCostPercentage != null

    const initialForm = useMemo<PricingFormState | null>(() => {
        if (!product) return null

        const indirectCostValue =
            product.indirectCostPercentage != null
                ? product.indirectCostPercentage
                : (profile?.indirectCostRate ?? 0)

        return {
            indirectCost: indirectCostValue.toString(),
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

    const baseCost = useMemo(() => {
        if (!components) return 0

        return components.reduce(
            (total, component) =>
                total + component.unitPrice * component.quantityUsed,
            0
        )
    }, [components])

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

    if (isLoadingProduct || isLoadingComponents || !product || !form)
        return null

    const setField = <K extends keyof PricingFormState>(
        field: K,
        value: string
    ) => {
        setForm((prev) => (prev ? { ...prev, [field]: value } : prev))
    }

    const handleSave = async () => {
        const indirectCostValue =
            form.indirectCost.trim() === '' ? null : Number(form.indirectCost)

        const payload: UpdateProductPricingDataType = {
            indirectCostPercentage: indirectCostValue,
            markupPercentage: Number(form.markup) || 0,
            finalPrice:
                form.finalPrice === '' ? 0 : Number(form.finalPrice) / 100,
        }

        if (form.discount !== '') {
            payload.discountPercentage = Number(form.discount) || 0
        }

        await mutateAsync({
            productId,
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
                            type="number"
                            value={form.indirectCost}
                            onChange={(e) =>
                                setField('indirectCost', e.target.value)
                            }
                        />
                        <p className="text-sm text-muted-foreground">
                            {product.indirectCostPercentage === null &&
                            profile?.indirectCostRate != null
                                ? 'Sugerido pelas configurações — salve para aplicar a este produto'
                                : isUsingProductSpecificIndirectCost
                                  ? 'Valor definido para este produto'
                                  : 'Defina a taxa nas configurações ou diretamente aqui'}
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label>Margem de lucro (%)</Label>
                        <Input
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
                            Preco sugerido
                            <Tooltip>
                                <TooltipTrigger>
                                    <button type="button">
                                        <InfoIcon className="w-4 h-4 text-primary-foreground" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        Calculado com base no custo dos
                                        componentes e parametros de
                                        precificação.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </Label>
                        <Input
                            value={formatCurrency(suggestedPrice)}
                            disabled
                        />
                    </div>

                    <div className="grid gap-2 col-span-2">
                        <Label className="flex items-center gap-2">
                            Preco final
                            <Tooltip>
                                <TooltipTrigger>
                                    <button type="button">
                                        <InfoIcon className="w-4 h-4 text-primary-foreground" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        Valor final aplicado ao produto no
                                        momento da venda.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </Label>
                        <Input
                            type="text"
                            value={formatCurrencyFromInput(form.finalPrice)}
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
                    {isPending ? 'Salvando...' : 'Salvar alteracoes'}
                </Button>
            </div>
        </form>
    )
}
