'use client'

import React, { useState } from 'react'
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
import { Label } from 'ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'
import { useCreateOrderItem } from '@/features/orders/details/hooks/mutations/useCreateOrderItem'
import { useGetRecipes } from '@/features/recipes/list/hooks/queries/useGetRecipes'
import { CreateOrderItemDataType } from '@/features/orders/services/order.api'
import { formatQuantityInput } from '@/shared/helpers/formatHelper'
import { Input } from 'ui/input'
import { useParams } from 'next/navigation'
import { useGetOrderItems } from '@/features/orders/details/hooks/queries/useGetOrderItems'
import { useGetProducts } from '@/features/products/list/hooks/queries/useGetProducts'

export function NewOrderItemModal() {
    const { id } = useParams<{ id: string }>()
    const orderId = Number(id)

    const [open, setOpen] = useState(false)
    const [selectedId, setSelectedId] = useState('')
    const [quantity, setQuantity] = useState('')

    const { data: products, isLoading: isLoadingProducts } = useGetProducts()
    const { data: recipes, isLoading: isLoadingRecipes } = useGetRecipes()
    const { mutateAsync: createItem, isPending, error } = useCreateOrderItem()
    const { data: orderItems } = useGetOrderItems(orderId)

    const resetForm = () => {
        setSelectedId('')
        setQuantity('')
    }

    const hasProducts = Boolean(products?.length)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const payload: CreateOrderItemDataType = {
            quantity: Number(quantity),
            ...(hasProducts
                ? { productId: Number(selectedId) }
                : { recipeId: Number(selectedId) }),
        }

        await createItem({
            orderId,
            data: [payload],
        })

        resetForm()
        setOpen(false)
    }

    const usedIds = orderItems?.map(
        (item) => item.product?.id ?? item.recipe?.id
    )

    const availableItems = (hasProducts ? products : recipes)?.filter(
        (item) => !usedIds?.includes(item.id)
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Adicionar item</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adicionar item</DialogTitle>
                    <DialogDescription>
                        Selecione o produto que deseja adicionar ao pedido.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>{hasProducts ? 'Produto' : 'Receita'}</Label>

                        <Select
                            value={selectedId}
                            onValueChange={setSelectedId}
                            disabled={isLoadingProducts || isLoadingRecipes}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um item" />
                            </SelectTrigger>

                            <SelectContent>
                                {availableItems?.length ? (
                                    availableItems.map((item) => (
                                        <SelectItem
                                            key={item.id}
                                            value={item.id.toString()}
                                        >
                                            {item.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-sm text-muted-foreground">
                                        Todos os itens ja foram adicionados
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-3">
                        <Label>Quantidade</Label>
                        <Input
                            placeholder="20"
                            value={formatQuantityInput(quantity)}
                            onChange={(e) => setQuantity(e.target.value)}
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
                                disabled={!selectedId || isPending}
                            >
                                {isPending ? 'Adicionando...' : 'Adicionar'}
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
