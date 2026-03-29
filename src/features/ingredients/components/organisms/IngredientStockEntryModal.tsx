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
import { getMeasurementUnitLabel } from '@/features/ingredients/services/measurementUnits'
import { useCreateStockPurchase } from '@/features/stock/hooks/mutations/useCreateStockPurchase'

type Props = {
    ingredient: IngredientModel
    open: boolean
    onOpenChange: (open: boolean) => void
}

const BASE_OPTION_VALUE = '__base__'

export function IngredientStockEntryModal({
    ingredient,
    open,
    onOpenChange,
}: Props) {
    const [selectedConversion, setSelectedConversion] =
        useState(BASE_OPTION_VALUE)
    const [quantityInput, setQuantityInput] = useState('')
    const [unitCostInput, setUnitCostInput] = useState('')
    const [notes, setNotes] = useState('')
    const [formMessage, setFormMessage] = useState<string | null>(null)

    const { data: customConversions, isLoading } = useGetIngredientConversions(
        ingredient.id,
        open
    )

    const { mutateAsync: createStockPurchase, isPending } =
        useCreateStockPurchase()

    const availableConversions = useMemo(() => {
        return (customConversions ?? []).map((item) => ({
            value: String(item.id),
            label: item.name,
            quantityInBaseUnit: item.quantityInBaseUnit,
        }))
    }, [customConversions])

    const selectedFactor = useMemo(() => {
        if (selectedConversion === BASE_OPTION_VALUE) return 1

        const conversion = availableConversions.find(
            (option) => option.value === selectedConversion
        )

        return conversion?.quantityInBaseUnit ?? 1
    }, [selectedConversion, availableConversions])

    const quantity = Number(quantityInput.replace(',', '.'))
    const unitCost = Number(unitCostInput.replace(',', '.'))
    const quantityInBaseUnit =
        !Number.isNaN(quantity) && quantity > 0 ? quantity * selectedFactor : 0

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormMessage(null)

        if (Number.isNaN(quantity) || quantity <= 0) return
        if (Number.isNaN(unitCost) || unitCost <= 0) return

        try {
            await createStockPurchase({
                itemType: 'ingredient',
                itemId: ingredient.id,
                movementType: 'purchase',
                quantity: quantityInBaseUnit,
                unitCost,
                notes: notes.trim() || undefined,
            })

            setQuantityInput('')
            setUnitCostInput('')
            setNotes('')
            setSelectedConversion(BASE_OPTION_VALUE)
            setFormMessage('Compra registrada com sucesso!')
            onOpenChange(false)
        } catch {
            setFormMessage('Não foi possível registrar a compra. Tente novamente.')
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>Compra de ingrediente</DialogTitle>
                    <DialogDescription>
                        Registre uma compra para atualizar o estoque.
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
                                    Unidade base (
                                    {getMeasurementUnitLabel(
                                        ingredient.baseUnit
                                    )}
                                    )
                                </SelectItem>
                                {availableConversions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label} ={' '}
                                        {option.quantityInBaseUnit}{' '}
                                        {getMeasurementUnitLabel(
                                            ingredient.baseUnit
                                        )}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Quantidade</Label>
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

                    <div className="grid gap-2">
                        <Label>Custo unitário (R$)</Label>
                        <Input
                            inputMode="decimal"
                            placeholder="Ex: 12,30"
                            value={unitCostInput}
                            onChange={(e) =>
                                setUnitCostInput(
                                    e.target.value.replace(/[^\d,.]/g, '')
                                )
                            }
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Observações</Label>
                        <Input
                            placeholder="Ex: Compra semanal"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <div className="rounded border p-3 text-sm text-muted-foreground">
                        Será adicionado ao estoque:{' '}
                        <strong>
                            {quantityInBaseUnit.toLocaleString('pt-BR')}{' '}
                            {getMeasurementUnitLabel(ingredient.baseUnit)}
                        </strong>
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={
                                isPending ||
                                Number.isNaN(quantity) ||
                                quantity <= 0 ||
                                Number.isNaN(unitCost) ||
                                unitCost <= 0
                            }
                        >
                            {isPending ? 'Salvando...' : 'Registrar compra'}
                        </Button>
                    </DialogFooter>

                    {formMessage && (
                        <p className="text-sm text-muted-foreground">
                            {formMessage}
                        </p>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}
