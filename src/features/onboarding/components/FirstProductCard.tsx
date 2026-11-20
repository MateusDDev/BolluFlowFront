'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useQueryClient } from '@tanstack/react-query'
import { Sparkles } from 'lucide-react'
import { Button } from 'ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from 'ui/card'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { useModules } from '@/shared/modules/useModules'
import { useCreateProduct } from '@/features/products/list/hooks/mutations/useCreateProduct'
import { useGetOnboardingProgress } from '@/features/onboarding/hooks/queries/useGetOnboardingProgress'

function parseMoney(value: string) {
    const parsed = Number(value.replace(/\./g, '').replace(',', '.'))
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

type Saved = { id: number; name: string; price: number; cost: number | null }

export function FirstProductCard() {
    const queryClient = useQueryClient()
    const { data: progress } = useGetOnboardingProgress()
    const { hasModule } = useModules()
    const { mutateAsync: createProduct, isPending, error } = useCreateProduct()

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [cost, setCost] = useState('')
    const [saved, setSaved] = useState<Saved | null>(null)

    if (!progress || (progress.hasProduct && !saved)) return null

    const priceValue = parseMoney(price)
    const costValue = parseMoney(cost)
    const shown = saved ?? {
        price: priceValue,
        cost: costValue,
    }
    const profit =
        shown.price && shown.cost !== null ? shown.price - shown.cost : null
    const margin = profit !== null && shown.price ? profit / shown.price : null

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!priceValue || name.trim().length < 2) return

        const created = await createProduct({
            name: name.trim(),
            salePrice: priceValue,
        })

        setSaved({
            id: created.id,
            name: name.trim(),
            price: priceValue,
            cost: costValue,
        })
        await queryClient.invalidateQueries({ queryKey: ['onboarding'] })
    }

    const profitLine =
        profit !== null && margin !== null ? (
            <p className="text-sm">
                Você lucra{' '}
                <strong className={profit < 0 ? 'text-destructive' : ''}>
                    {formatCurrency(profit)}
                </strong>{' '}
                por unidade ({Math.round(margin * 100)}% do preço).
            </p>
        ) : null

    if (saved)
        return (
            <Card className="border-primary/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="text-primary h-5 w-5" />
                        {saved.name} cadastrado!
                    </CardTitle>
                    <CardDescription>
                        Ele já aparece nos pedidos e no cardápio online.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {profitLine}
                    <p className="text-muted-foreground text-sm">
                        {hasModule('recipes')
                            ? 'Esse lucro é uma estimativa. Para o sistema calcular sozinho e acompanhar o preço dos ingredientes, monte a ficha técnica do produto.'
                            : 'Próximo passo: registre uma venda para ver o faturamento no Dashboard.'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {hasModule('recipes') ? (
                            <Button asChild>
                                <Link href={`/products/${saved.id}`}>
                                    Montar ficha técnica
                                </Link>
                            </Button>
                        ) : hasModule('orders') ? (
                            <Button asChild>
                                <Link href="/orders/new?mode=quick">
                                    Registrar uma venda
                                </Link>
                            </Button>
                        ) : null}
                        <Button variant="ghost" onClick={() => setSaved(null)}>
                            Fechar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )

    return (
        <Card className="border-primary/40">
            <CardHeader>
                <CardTitle>Comece pelo que você mais vende</CardTitle>
                <CardDescription>
                    Três respostas e você já sabe quanto lucra em cada venda.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={handleSubmit}
                    className="grid gap-4 sm:grid-cols-3"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="first-product-name">
                            Qual produto?
                        </Label>
                        <Input
                            id="first-product-name"
                            placeholder="Ex.: Brigadeiro gourmet"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="first-product-price">
                            Vende por (R$)
                        </Label>
                        <Input
                            id="first-product-price"
                            inputMode="decimal"
                            placeholder="Ex.: 3,50"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="first-product-cost">
                            Gasta para fazer um (R$){' '}
                            <span className="text-muted-foreground font-normal">
                                (opcional)
                            </span>
                        </Label>
                        <Input
                            id="first-product-cost"
                            inputMode="decimal"
                            placeholder="Ex.: 1,20"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-3">
                        <div>{profitLine}</div>
                        <Button
                            type="submit"
                            disabled={
                                isPending ||
                                !priceValue ||
                                name.trim().length < 2
                            }
                        >
                            {isPending ? 'Salvando...' : 'Cadastrar produto'}
                        </Button>
                    </div>

                    {error && (
                        <p className="text-destructive text-sm sm:col-span-3">
                            {error.message}
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    )
}
