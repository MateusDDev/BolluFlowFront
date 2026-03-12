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
import { getMeasurementUnitLabel } from '@/features/ingredients/services/measurementUnits'

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

    const isBusy = isCreating || isUpdating || isDeleting

    const sortedConversions = useMemo(
        () =>
            (conversions ?? [])
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name)),
        [conversions]
    )

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
        ) {
            return
        }

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
                    <DialogTitle>Conversoes personalizadas</DialogTitle>
                    <DialogDescription>
                        Defina formatos de compra desse insumo (ex: pacote,
                        caixa, fardo). Conversao para unidade base{' '}
                        <strong>
                            {getMeasurementUnitLabel(supply.baseUnit)}
                        </strong>
                        .
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="rounded-md border p-3 grid gap-3">
                        <Label>Nova conversao</Label>
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-2">
                            <Input
                                placeholder="Nome (ex: caixa)"
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
                                onClick={() => handleCreate()}
                                disabled={isBusy}
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Adicionar
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-md border overflow-hidden">
                        <div className="px-3 py-2 bg-muted text-sm font-medium">
                            Conversoes cadastradas
                        </div>
                        <div className="divide-y">
                            {isLoading && (
                                <div className="p-3 text-sm text-muted-foreground">
                                    Carregando conversoes...
                                </div>
                            )}

                            {!isLoading && sortedConversions.length === 0 && (
                                <div className="p-3 text-sm text-muted-foreground">
                                    Nenhuma conversao cadastrada.
                                </div>
                            )}

                            {sortedConversions.map((conversion) => {
                                const isEditing =
                                    editingConversionId === conversion.id

                                return (
                                    <div
                                        key={conversion.id}
                                        className="p-3 grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-2 items-center"
                                    >
                                        {isEditing ? (
                                            <>
                                                <Input
                                                    value={
                                                        editingConversionName
                                                    }
                                                    onChange={(e) =>
                                                        setEditingConversionName(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Nome"
                                                />
                                                <Input
                                                    inputMode="decimal"
                                                    value={
                                                        editingConversionQuantity
                                                    }
                                                    onChange={(e) =>
                                                        setEditingConversionQuantity(
                                                            e.target.value.replace(
                                                                /[^\d,.]/g,
                                                                ''
                                                            )
                                                        )
                                                    }
                                                />
                                                <div className="flex gap-1 justify-end">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        onClick={handleUpdate}
                                                        disabled={isBusy}
                                                    >
                                                        <Save className="w-4 h-4 mr-1" />
                                                        Salvar
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={stopEdit}
                                                        disabled={isBusy}
                                                    >
                                                        <X className="w-4 h-4 mr-1" />
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="text-sm font-medium">
                                                    {conversion.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {
                                                        conversion.quantityInBaseUnit
                                                    }{' '}
                                                    {getMeasurementUnitLabel(
                                                        supply.baseUnit
                                                    )}
                                                </div>
                                                <div className="flex gap-1 justify-end">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            startEdit(
                                                                conversion
                                                            )
                                                        }
                                                        disabled={isBusy}
                                                    >
                                                        <Pencil className="w-4 h-4 mr-1" />
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            deleteConversion({
                                                                supplyId:
                                                                    supply.id,
                                                                conversionId:
                                                                    conversion.id,
                                                            })
                                                        }
                                                        disabled={isBusy}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Excluir
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

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
