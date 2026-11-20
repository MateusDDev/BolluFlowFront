'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from 'ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from 'ui/card'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { Separator } from 'ui/separator'
import { Switch } from 'ui/switch'
import { Textarea } from 'ui/textarea'
import { useGetProduct } from '@/features/products/list/hooks/queries/useGetProduct'
import { useUpdateProduct } from '@/features/products/details/hooks/mutations/useUpdateProduct'
import { ProductModel } from '@/features/products/services/product.model'
import { UpdateProductDataType } from '@/features/products/services/product.api'
import { useModules } from '@/shared/modules/useModules'
import { TrackStockField } from '@/shared/modules/stock'

interface FormState {
    name: string
    description: string
    category: string
    minimumStockQuantity: string
    isActive: boolean
    trackStock: boolean
}

const mapProductToForm = (product: ProductModel): FormState => ({
    name: product.name,
    description: product.description ?? '',
    category: product.category ?? '',
    minimumStockQuantity: product.minimumStockQuantity?.toString() ?? '',
    isActive: product.isActive,
    trackStock: product.trackStock,
})

export function ProductDetails() {
    const { id } = useParams<{ id: string }>()
    const productId = Number(id)

    const { data: product, isLoading } = useGetProduct(productId)
    const { mutateAsync: updateProduct, isPending } = useUpdateProduct()
    const { hasModule } = useModules()
    const hasStock = hasModule('stock')

    const [form, setForm] = useState<FormState | null>(null)
    const [initialForm, setInitialForm] = useState<FormState | null>(null)

    useEffect(() => {
        if (!product) return

        const mapped = mapProductToForm(product)

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm(mapped)
        setInitialForm(mapped)
    }, [product])

    const isDirty = useMemo(() => {
        if (!form || !initialForm) return false
        return JSON.stringify(form) !== JSON.stringify(initialForm)
    }, [form, initialForm])

    if (isLoading || !product || !form) return null

    const setField = <K extends keyof FormState>(
        field: K,
        value: FormState[K]
    ) => {
        setForm((prev) => (prev ? { ...prev, [field]: value } : prev))
    }

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isDirty) return

        const payload: UpdateProductDataType = {
            name: form.name,
            description: form.description.trim() || null,
            category: form.category.trim() || null,
            isActive: form.isActive,
            trackStock: form.trackStock,
        }

        if (form.minimumStockQuantity !== '') {
            payload.minimumStockQuantity = Number(form.minimumStockQuantity)
        }

        await updateProduct({ id: productId, data: payload })

        setInitialForm(form)
    }

    return (
        <Card>
            <form onSubmit={handleSave}>
                <CardHeader>
                    <CardTitle>Informações</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-4 pt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="product-name">Nome</Label>
                        <Input
                            id="product-name"
                            value={form.name}
                            onChange={(e) => setField('name', e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="product-category">Categoria</Label>
                        <Input
                            id="product-category"
                            placeholder="Ex: Bolos, Brigadeiros, Kits..."
                            value={form.category}
                            onChange={(e) =>
                                setField('category', e.target.value)
                            }
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="product-description">Descrição</Label>
                        <Textarea
                            id="product-description"
                            placeholder="Ex: Bolo fofinho com cobertura de chocolate..."
                            value={form.description}
                            onChange={(e) =>
                                setField('description', e.target.value)
                            }
                        />
                        <p className="text-muted-foreground text-xs">
                            Aparece no cardápio online.
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
                        <div>
                            <Label htmlFor="product-active">
                                Disponível para venda
                            </Label>
                            <p className="text-muted-foreground text-sm">
                                Desligado, o produto some do cardápio e das
                                novas vendas.
                            </p>
                        </div>
                        <Switch
                            id="product-active"
                            checked={form.isActive}
                            onCheckedChange={(checked) =>
                                setField('isActive', checked)
                            }
                        />
                    </div>

                    {hasStock && (
                        <>
                            <Separator />

                            <TrackStockField
                                id="product-track-stock"
                                checked={form.trackStock}
                                onCheckedChange={(checked) =>
                                    setField('trackStock', checked)
                                }
                            />

                            {form.trackStock && (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label>Em estoque agora</Label>
                                        <Input
                                            value={product.stockQuantity.toLocaleString(
                                                'pt-BR'
                                            )}
                                            disabled
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="product-minimum-stock">
                                            Avisar quando ficar abaixo de
                                        </Label>
                                        <Input
                                            id="product-minimum-stock"
                                            type="number"
                                            min={0}
                                            value={form.minimumStockQuantity}
                                            onChange={(e) =>
                                                setField(
                                                    'minimumStockQuantity',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
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
