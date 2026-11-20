'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { Switch } from 'ui/switch'
import { Textarea } from 'ui/textarea'
import { useGetProduct } from '@/features/products/list/hooks/queries/useGetProduct'
import { useUpdateProduct } from '@/features/products/details/hooks/mutations/useUpdateProduct'
import { ProductModel } from '@/features/products/services/product.model'
import { UpdateProductDataType } from '@/features/products/services/product.api'
import { ProductImageUpload } from '@/features/products/components/ProductImageUpload'
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

const mapProductToForm = (product: ProductModel): FormState => {
    return {
        name: product.name,
        description: product.description ?? '',
        category: product.category ?? '',
        minimumStockQuantity: product.minimumStockQuantity?.toString() ?? '',
        isActive: product.isActive,
        trackStock: product.trackStock,
    }
}

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

    const handleSave = async () => {
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

        await updateProduct({
            id: productId,
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

                <ProductImageUpload
                    productId={productId}
                    imageUrl={product.imageUrl}
                />

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2 col-span-2">
                        <Label>Nome</Label>
                        <Input
                            value={form.name}
                            onChange={(e) => setField('name', e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2 col-span-2">
                        <Label>Categoria</Label>
                        <Input
                            placeholder="Ex: Bolos, Brigadeiros, Kits..."
                            value={form.category}
                            onChange={(e) =>
                                setField('category', e.target.value)
                            }
                        />
                    </div>

                    <div className="grid gap-2 col-span-2">
                        <Label>Descrição</Label>
                        <Textarea
                            placeholder="Ex: Bolo fofinho com cobertura de chocolate..."
                            value={form.description}
                            onChange={(e) =>
                                setField('description', e.target.value)
                            }
                        />
                    </div>

                    {hasStock && (
                        <div className="grid gap-2">
                            <Label>Estoque minimo</Label>
                            <Input
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
                    )}

                    {hasStock && (
                        <div className="col-span-2">
                            <TrackStockField
                                id="product-track-stock"
                                checked={form.trackStock}
                                onCheckedChange={(checked) =>
                                    setField('trackStock', checked)
                                }
                            />
                        </div>
                    )}
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                    Status
                </h3>
                <div className="rounded-lg border p-4 flex items-center justify-between">
                    <div>
                        <p className="font-medium">Produto ativo</p>
                        <p className="text-sm text-muted-foreground">
                            Produtos inativos não ficam disponiveis para novos
                            pedidos.
                        </p>
                    </div>
                    <Switch
                        checked={form.isActive}
                        onCheckedChange={(checked) =>
                            setField('isActive', checked)
                        }
                    />
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
