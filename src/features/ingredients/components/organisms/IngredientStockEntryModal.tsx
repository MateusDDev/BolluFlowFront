import React, { useMemo, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from 'ui/dialog'
import { Label } from 'ui/label'
import { Input } from 'ui/input'
import { Button } from 'ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'
import { IngredientModel } from '@/features/ingredients/services/ingredient.model'
import { useGetIngredientConversions } from '@/features/ingredients/hooks/queries/useGetIngredientConversions'
import { useUpdateIngredient } from '@/features/ingredients/hooks/mutations/useUpdateIngredient'
import { getMeasurementUnitLabel } from '@/features/ingredients/services/measurementUnits'

type Props = {
    ingredient: IngredientModel
    open: boolean
    onOpenChange: (open: boolean) => void
}

const BASE_OPTION_VALUE = '__base__'

export function IngredientStockEntryModal({ ingredient, open, onOpenChange }: Props) {
    const [selectedConversion, setSelectedConversion] = useState(BASE_OPTION_VALUE)
    const [quantityInput, setQuantityInput] = useState('')

    const { data: customConversions, isLoading } = useGetIngredientConversions(
        ingredient.id,
        open
    )

    const {
        mutateAsync: updateIngredient,
        isPending,
        error,
    } = useUpdateIngredient()

    const availableConversions = useMemo(() => {
        return (customConversions ?? []).map((item) => ({
            value: String(item.id),
            label: item.name,
            quantityInBaseUnit: item.quantityInBaseUnit,
        }))
    }, [customConversions, ingredient.baseUnit])

    const selectedFactor = useMemo(() => {
        if (selectedConversion === BASE_OPTION_VALUE) return 1

        const conversion = availableConversions.find(
            (option) => option.value === selectedConversion
        )

        return conversion?.quantityInBaseUnit ?? 1
    }, [selectedConversion, availableConversions])

    const quantity = Number(quantityInput.replace(',', '.'))
    const addedInBaseUnit =
        !isNaN(quantity) && quantity > 0 ? quantity * selectedFactor : 0

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (isNaN(quantity) || quantity <= 0) return

        await updateIngredient({
            id: ingredient.id,
            data: {
                name: ingredient.name,
                baseUnit: ingredient.baseUnit,
                unitPrice: ingredient.unitPrice,
                stockQuantity: ingredient.stockQuantity + addedInBaseUnit,
                minimumStockQuantity: ingredient.minimumStockQuantity,
            },
        })

        setQuantityInput('')
        setSelectedConversion(BASE_OPTION_VALUE)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>Entrada de estoque</DialogTitle>
                    <DialogDescription>
                        Lance compras usando conversões personalizadas e o sistema
                        converte para unidade base.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label>Conversão</Label>
                        <Select
                            value={selectedConversion}
                            onValueChange={setSelectedConversion}
                            disabled={isLoading || isPending}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma conversão" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={BASE_OPTION_VALUE}>
                                    Unidade base ({getMeasurementUnitLabel(ingredient.baseUnit)})
                                </SelectItem>
                                {availableConversions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label} = {option.quantityInBaseUnit}{' '}
                                        {getMeasurementUnitLabel(ingredient.baseUnit)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {!isLoading && availableConversions.length === 0 && (
                        <p className="text-xs text-muted-foreground">
                            Nenhuma conversão personalizada cadastrada.
                        </p>
                    )}

                    <div className="grid gap-2">
                        <Label>Quantidade comprada</Label>
                        <Input
                            inputMode="decimal"
                            placeholder="Ex: 2"
                            value={quantityInput}
                            onChange={(e) =>
                                setQuantityInput(
                                    e.target.value.replace(/[^\d,.]/g, '')
                                )
                            }
                            required
                        />
                    </div>

                    <div className="rounded border p-3 text-sm text-muted-foreground">
                        Será adicionado ao estoque:{' '}
                        <strong>
                            {addedInBaseUnit.toLocaleString('pt-BR')} {' '}
                            {getMeasurementUnitLabel(ingredient.baseUnit)}
                        </strong>
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={
                                isPending || isNaN(quantity) || quantity <= 0
                            }
                        >
                            {isPending ? 'Salvando...' : 'Adicionar ao estoque'}
                        </Button>
                    </DialogFooter>

                    {error && <p className="text-sm text-red-500">{error.message}</p>}
                </form>
            </DialogContent>
        </Dialog>
    )
}
