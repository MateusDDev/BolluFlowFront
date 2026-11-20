import React, { useMemo, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from 'ui/dialog'
import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { SupplyModel } from '@/features/supplies/services/supply.model'
import { useGetSupplyConversions } from '@/features/supplies/hooks/queries/useGetSupplyConversions'
import { useCreateSupplyConversion } from '@/features/supplies/hooks/mutations/useCreateSupplyConversion'
import { useUpdateSupplyConversion } from '@/features/supplies/hooks/mutations/useUpdateSupplyConversion'
import { useDeleteSupplyConversion } from '@/features/supplies/hooks/mutations/useDeleteSupplyConversion'
import {
    getDefaultConversionsForBaseUnit,
    getMeasurementUnitLabel,
} from '@/features/ingredients/services/measurementUnits'

interface SupplyConversionsModalProps {
    supply: SupplyModel
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SupplyConversionsModal({
    supply,
    open,
    onOpenChange,
}: SupplyConversionsModalProps) {
    const [newConversionName, setNewConversionName] = useState('')
    const [newConversionQuantity, setNewConversionQuantity] = useState('')
    const [editingConversionId, setEditingConversionId] = useState<
        number | null
    >(null)
    const [editingConversionName, setEditingConversionName] = useState('')
    const [editingConversionQuantity, setEditingConversionQuantity] =
        useState('')

    const { data: conversions, isLoading } = useGetSupplyConversions(
        supply.id,
        open
    )

    const {
        mutateAsync: createConversion,
        isPending: isCreating,
        error,
    } = useCreateSupplyConversion()
    const {
        mutateAsync: updateConversion,
        isPending: isUpdating,
        error: updateError,
    } = useUpdateSupplyConversion()
    const {
        mutateAsync: deleteConversion,
        isPending: isDeleting,
        error: deleteError,
    } = useDeleteSupplyConversion()

    const defaultConversions = useMemo(
        () => getDefaultConversionsForBaseUnit(supply.baseUnit),
        [supply.baseUnit]
    )

    const isBusy = isCreating || isUpdating || isDeleting

    const resetCreateFields = () => {
        setNewConversionName('')
        setNewConversionQuantity('')
    }

    const startEdit = (conversion: {
        id: number
        name: string
        quantityInBaseUnit: number
    }) => {
        setEditingConversionId(conversion.id)
        setEditingConversionName(conversion.name)
        setEditingConversionQuantity(
            conversion.quantityInBaseUnit.toString().replace('.', ',')
        )
    }

    const stopEdit = () => {
        setEditingConversionId(null)
        setEditingConversionName('')
        setEditingConversionQuantity('')
    }

    const handleCreate = async (
        name = newConversionName,
        quantity = newConversionQuantity
    ) => {
        const parsedQuantity = Number(quantity.replace(',', '.'))

        if (!name.trim() || isNaN(parsedQuantity) || parsedQuantity <= 0) return

        await createConversion({
            supplyId: supply.id,
            data: {
                name: name.trim(),
                quantityInBaseUnit: parsedQuantity,
            },
        })

        resetCreateFields()
    }

    const handleUpdate = async () => {
        if (editingConversionId === null) return

        const parsedQuantity = Number(
            editingConversionQuantity.replace(',', '.')
        )

        if (
            !editingConversionName.trim() ||
            isNaN(parsedQuantity) ||
            parsedQuantity <= 0
        )
            return

        await updateConversion({
            supplyId: supply.id,
            conversionId: editingConversionId,
            data: {
                name: editingConversionName.trim(),
                quantityInBaseUnit: parsedQuantity,
            },
        })

        stopEdit()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[720px]">
                <DialogHeader>
                    <DialogTitle>Conversões personalizadas</DialogTitle>
                    <DialogDescription>
                        Defina como você compra esse insumo (ex: cartela, pote,
                        vasilha). O sistema converte para a unidade base{' '}
                        <strong>
                            {getMeasurementUnitLabel(supply.baseUnit)}
                        </strong>
                        .
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="rounded-md border p-3 grid gap-3">
                        <Label>Nova conversão</Label>
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-2">
                            <Input
                                placeholder="Nome (ex: cartela)"
                                value={newConversionName}
                                onChange={(e) =>
                                    setNewConversionName(e.target.value)
                                }
                            />
                            <Input
                                placeholder={`Qtd em ${getMeasurementUnitLabel(supply.baseUnit)}`}
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
                                onClick={() => handleCreate()}
                                disabled={isBusy}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {!isLoading &&
                        !conversions?.length &&
                        defaultConversions.length > 0 && (
                            <div className="rounded-md border border-dashed p-3 grid gap-2">
                                <p className="text-sm font-medium">
                                    Nenhuma conversão personalizada cadastrada.
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Você pode usar as padrão abaixo para
                                    começar.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {defaultConversions.map(
                                        (defaultConversion) => (
                                            <Button
                                                key={defaultConversion.name}
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    handleCreate(
                                                        defaultConversion.name,
                                                        String(
                                                            defaultConversion.quantityInBaseUnit
                                                        )
                                                    )
                                                }
                                                disabled={isBusy}
                                            >
                                                {defaultConversion.name} ={' '}
                                                {
                                                    defaultConversion.quantityInBaseUnit
                                                }
                                            </Button>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                    <div className="grid gap-2">
                        <Label>Conversões cadastradas</Label>
                        {isLoading ? (
                            <p className="text-sm text-muted-foreground">
                                Carregando conversões...
                            </p>
                        ) : conversions?.length ? (
                            conversions.map((conversion) => {
                                const isEditing =
                                    editingConversionId === conversion.id

                                return (
                                    <div
                                        key={conversion.id}
                                        className="grid grid-cols-1 md:grid-cols-[1fr_180px_auto_auto_auto] gap-2 items-center"
                                    >
                                        <Input
                                            value={
                                                isEditing
                                                    ? editingConversionName
                                                    : conversion.name
                                            }
                                            onChange={(e) =>
                                                setEditingConversionName(
                                                    e.target.value
                                                )
                                            }
                                            disabled={!isEditing}
                                        />
                                        <Input
                                            value={
                                                isEditing
                                                    ? editingConversionQuantity
                                                    : conversion.quantityInBaseUnit
                                                          .toString()
                                                          .replace('.', ',')
                                            }
                                            onChange={(e) =>
                                                setEditingConversionQuantity(
                                                    e.target.value.replace(
                                                        /[^\d,.]/g,
                                                        ''
                                                    )
                                                )
                                            }
                                            disabled={!isEditing}
                                        />

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                startEdit(conversion)
                                            }
                                            disabled={isBusy}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleUpdate}
                                            disabled={!isEditing || isBusy}
                                        >
                                            <Save className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={async () =>
                                                await deleteConversion({
                                                    supplyId: supply.id,
                                                    conversionId: conversion.id,
                                                })
                                            }
                                            disabled={isBusy}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )
                            })
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Nenhuma conversão cadastrada.
                            </p>
                        )}
                    </div>

                    {editingConversionId !== null && (
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={stopEdit}
                            >
                                <X className="h-4 w-4 mr-1" />
                                Cancelar edição
                            </Button>
                        </div>
                    )}

                    {(error || updateError || deleteError) && (
                        <p className="text-sm text-red-500">
                            {error?.message ||
                                updateError?.message ||
                                deleteError?.message}
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
