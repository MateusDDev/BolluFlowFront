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

export function NewOrderItemModal() {
    const { id } = useParams<{ id: string }>()
    const orderId = Number(id)

    const [open, setOpen] = useState(false)
    const [recipeId, setRecipeId] = useState('')
    const [quantity, setQuantity] = useState('')

    const { data: recipes, isLoading } = useGetRecipes()
    const { mutateAsync: createItem, isPending, error } = useCreateOrderItem()
    const { data: orderItems } = useGetOrderItems(orderId)

    const resetForm = () => {
        setRecipeId('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const payload: CreateOrderItemDataType = {
            recipeId: Number(recipeId),
            quantity: Number(quantity),
        }

        await createItem({
            orderId,
            data: [payload],
        })

        resetForm()
        setOpen(false)
    }

    const usedRecipeIds = orderItems?.map((item) => item.recipe.id)

    const availableRecipes = recipes?.filter(
        (recipe) => !usedRecipeIds?.includes(recipe.id)
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Adicionar receita</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adicionar receita</DialogTitle>
                    <DialogDescription>
                        Selecione a receita que deseja adicionar ao pedido.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Receita</Label>

                        <Select
                            value={recipeId}
                            onValueChange={setRecipeId}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma receita" />
                            </SelectTrigger>

                            <SelectContent>
                                {availableRecipes?.length ? (
                                    availableRecipes.map((recipe) => (
                                        <SelectItem
                                            key={recipe.id}
                                            value={recipe.id.toString()}
                                        >
                                            {recipe.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-sm text-muted-foreground">
                                        Todas as receitas já foram adicionadas
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
                                disabled={!recipeId || isPending}
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
