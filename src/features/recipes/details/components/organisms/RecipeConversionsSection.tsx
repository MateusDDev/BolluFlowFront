'use client'

import { useState } from 'react'
import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { Trash2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useGetRecipeConversions } from '@/features/recipes/hooks/queries/useGetRecipeConversions'
import { useCreateRecipeConversion } from '@/features/recipes/hooks/mutations/useCreateRecipeConversion'
import { useDeleteRecipeConversion } from '@/features/recipes/hooks/mutations/useDeleteRecipeConversion'

export function RecipeConversionsSection() {
    const { id } = useParams<{ id: string }>()
    const recipeId = Number(id)

    const [newConversionName, setNewConversionName] = useState('')
    const [newConversionQuantity, setNewConversionQuantity] = useState('')

    const { data: conversions, isLoading } = useGetRecipeConversions(recipeId, true)

    const { mutateAsync: createConversion, isPending: isCreating, error } =
        useCreateRecipeConversion()
    const {
        mutateAsync: deleteConversion,
        isPending: isDeleting,
        error: deleteError,
    } = useDeleteRecipeConversion()

    const isBusy = isCreating || isDeleting

    const handleCreate = async () => {
        const parsedQuantity = Number(newConversionQuantity.replace(',', '.'))

        if (!newConversionName.trim() || isNaN(parsedQuantity) || parsedQuantity <= 0)
            return

        await createConversion({
            recipeId,
            data: {
                name: newConversionName.trim(),
                quantityInBaseUnit: parsedQuantity,
            },
        })

        setNewConversionName('')
        setNewConversionQuantity('')
    }

    return (
        <section className="space-y-4 py-6">
            <div className="rounded-md border p-3 grid gap-3">
                <Label>Nova conversão</Label>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-2">
                    <Input
                        placeholder="Nome (ex: bandeja)"
                        value={newConversionName}
                        onChange={(e) => setNewConversionName(e.target.value)}
                    />
                    <Input
                        placeholder="Qtd em un"
                        inputMode="decimal"
                        value={newConversionQuantity}
                        onChange={(e) =>
                            setNewConversionQuantity(
                                e.target.value.replace(/[^\d,.]/g, '')
                            )
                        }
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCreate}
                        disabled={isBusy}
                    >
                        Adicionar
                    </Button>
                </div>
            </div>

            <div className="grid gap-2">
                <Label>Conversões cadastradas</Label>
                {isLoading ? (
                    <p className="text-sm text-muted-foreground">
                        Carregando conversões...
                    </p>
                ) : conversions?.length ? (
                    conversions.map((conversion) => (
                        <div
                            key={conversion.id}
                            className="grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-2 items-center"
                        >
                            <Input value={conversion.name} disabled />
                            <Input
                                value={conversion.quantityInBaseUnit
                                    .toString()
                                    .replace('.', ',')}
                                disabled
                            />

                            <Button
                                type="button"
                                variant="destructive"
                                onClick={async () =>
                                    await deleteConversion({
                                        recipeId,
                                        conversionId: conversion.id,
                                    })
                                }
                                disabled={isBusy}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Nenhuma conversão cadastrada.
                    </p>
                )}
            </div>

            {(error || deleteError) && (
                <p className="text-sm text-red-500">
                    {error?.message || deleteError?.message}
                </p>
            )}
        </section>
    )
}
