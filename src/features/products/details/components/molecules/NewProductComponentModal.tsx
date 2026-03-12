'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from 'ui/dialog'
import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'
import { formatQuantityInput } from '@/shared/helpers/formatHelper'
import { useGetProductComponentCatalog } from '@/features/products/details/hooks/queries/useGetProductComponentCatalog'
import { useGetProductComponents } from '@/features/products/details/hooks/queries/useGetProductComponents'
import { useCreateProductComponent } from '@/features/products/details/hooks/mutations/useCreateProductComponent'
import {
    CreateProductComponentDataType,
    ProductComponentCatalogItem,
} from '@/features/products/services/product.api'

function buildCatalogValue(item: ProductComponentCatalogItem) {
    return `${item.sourceType}:${item.id}`
}

export function NewProductComponentModal() {
    const { id } = useParams<{ id: string }>()
    const productId = Number(id)

    const [open, setOpen] = useState(false)
    const [selectedCatalogValue, setSelectedCatalogValue] = useState('')
    const [quantityUsed, setQuantityUsed] = useState('')

    const { data: catalog, isLoading } =
        useGetProductComponentCatalog(productId)
    const { data: components } = useGetProductComponents(productId)
    const { mutateAsync, isPending, error } = useCreateProductComponent()

    const usedKeys = components?.map(
        (item) =>
            `${item.componentType}-${item.ingredientId ?? item.recipeId ?? item.supplyId}`
    )

    const availableCatalog = catalog?.filter(
        (item) => !usedKeys?.includes(`${item.sourceType}-${item.id}`)
    )

    const reset = () => {
        setSelectedCatalogValue('')
        setQuantityUsed('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const quantity = Number(quantityUsed.replace(',', '.'))
        if (!selectedCatalogValue || isNaN(quantity) || quantity <= 0) return

        const selected = catalog?.find(
            (item) => buildCatalogValue(item) === selectedCatalogValue
        )

        if (!selected) return

        const payload: CreateProductComponentDataType = {
            componentType: selected.sourceType,
            quantityUsed: quantity,
            ...(selected.sourceType === 'Ingredient'
                ? { ingredientId: selected.id }
                : selected.sourceType === 'Supply'
                  ? { supplyId: selected.id }
                  : { recipeId: selected.id }),
        }

        await mutateAsync({
            productId,
            data: payload,
        })

        reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Adicionar componente</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adicionar componente</DialogTitle>
                    <DialogDescription>
                        Escolha uma receita, ingrediente ou insumo para compor o
                        produto final.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Componente</Label>
                        <Select
                            value={selectedCatalogValue}
                            onValueChange={setSelectedCatalogValue}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um componente" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableCatalog?.length ? (
                                    availableCatalog.map((item) => (
                                        <SelectItem
                                            key={buildCatalogValue(item)}
                                            value={buildCatalogValue(item)}
                                        >
                                            {item.name} ({item.sourceType})
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-sm text-muted-foreground">
                                        Todos os componentes disponiveis ja
                                        foram adicionados.
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-3">
                        <Label>Quantidade usada</Label>
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
                                disabled={
                                    isPending ||
                                    !selectedCatalogValue ||
                                    !quantityUsed
                                }
                            >
                                {isPending ? 'Salvando...' : 'Adicionar'}
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
