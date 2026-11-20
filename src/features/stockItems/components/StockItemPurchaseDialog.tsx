'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Button } from 'ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from 'ui/dialog'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'
import { Switch } from 'ui/switch'
import { formatCurrencyFromInput } from '@/shared/helpers/formatHelper'
import { useModules } from '@/shared/modules/useModules'
import { StockItemConfig } from '@/features/stockItems/services/stockItem.config'
import { StockItemModel } from '@/features/stockItems/services/stockItem.api'
import {
    formatStockQuantity,
    formatUnitCost,
} from '@/features/stockItems/services/stockItemUnits'
import { buildQuantityUnitOptions } from '@/features/stockItems/services/stockItemQuantityUnits'
import {
    usePurchaseStockItem,
    useStockItemPackages,
} from '@/features/stockItems/hooks/useStockItemActions'

const COST_CHANGE_TOLERANCE = 0.005

type Props = {
    config: StockItemConfig
    item: StockItemModel
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function StockItemPurchaseDialog({
    config,
    item,
    open,
    onOpenChange,
}: Props) {
    const { hasModule } = useModules()
    const { data: packages = [] } = useStockItemPackages(config, item.id, open)
    const purchase = usePurchaseStockItem(config)

    const unitOptions = useMemo(
        () => buildQuantityUnitOptions(item.baseUnit, packages),
        [item.baseUnit, packages]
    )

    const [quantity, setQuantity] = useState('')
    const [unitValue, setUnitValue] = useState('')
    const [totalPrice, setTotalPrice] = useState('')
    const [notes, setNotes] = useState('')
    const [updateCost, setUpdateCost] = useState(true)

    useEffect(() => {
        if (!open) return

        setQuantity('')
        setTotalPrice('')
        setNotes('')
        setUpdateCost(true)
        purchase.reset()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const selectedUnit =
        unitOptions.find((option) => option.value === unitValue) ??
        unitOptions[0]

    const quantityValue = Number(quantity.replace(',', '.')) || 0
    const baseQuantity = quantityValue * (selectedUnit?.factor ?? 1)
    const total = totalPrice === '' ? 0 : Number(totalPrice) / 100
    const unitCost = baseQuantity > 0 ? total / baseQuantity : 0

    const costChanged =
        unitCost > 0 &&
        Math.abs(unitCost - item.unitCost) / item.unitCost >
            COST_CHANGE_TOLERANCE

    const canSubmit = baseQuantity > 0 && total > 0 && !purchase.isPending

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await purchase.mutateAsync({
            itemId: item.id,
            quantity: baseQuantity,
            unitCost,
            notes: notes.trim() || undefined,
            updateItemCost: costChanged && updateCost,
        })

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[460px]">
                <DialogHeader>
                    <DialogTitle>Registrar compra · {item.name}</DialogTitle>
                    <DialogDescription>
                        {hasModule('stock')
                            ? 'Soma no estoque e entra como despesa no financeiro.'
                            : 'Entra como despesa no financeiro.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label>Comprei</Label>
                        <div className="grid grid-cols-[1fr_2fr] gap-2">
                            <Input
                                inputMode="decimal"
                                placeholder="Ex.: 2"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                autoFocus
                            />
                            <Select
                                value={selectedUnit?.value}
                                onValueChange={setUnitValue}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {unitOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="purchase-total">
                            Por quanto, no total
                        </Label>
                        <Input
                            id="purchase-total"
                            inputMode="decimal"
                            placeholder="R$ 0,00"
                            value={
                                totalPrice
                                    ? formatCurrencyFromInput(totalPrice)
                                    : ''
                            }
                            onChange={(e) =>
                                setTotalPrice(e.target.value.replace(/\D/g, ''))
                            }
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="purchase-notes">
                            Observação{' '}
                            <span className="text-muted-foreground font-normal">
                                (opcional)
                            </span>
                        </Label>
                        <Input
                            id="purchase-notes"
                            placeholder="Ex.: Atacadão"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    {canSubmit && (
                        <div className="bg-muted/50 space-y-2 rounded-lg p-3 text-sm">
                            <p>
                                {hasModule('stock') && (
                                    <>
                                        Entram{' '}
                                        <strong>
                                            {formatStockQuantity(
                                                baseQuantity,
                                                item.baseUnit
                                            )}
                                        </strong>{' '}
                                        ·{' '}
                                    </>
                                )}
                                Saiu a{' '}
                                <strong>
                                    {formatUnitCost(unitCost, item.baseUnit)}
                                </strong>
                            </p>

                            {costChanged && (
                                <label className="flex items-center justify-between gap-3">
                                    <span>
                                        Atualizar o custo de{' '}
                                        {formatUnitCost(
                                            item.unitCost,
                                            item.baseUnit
                                        )}{' '}
                                        para{' '}
                                        {formatUnitCost(
                                            unitCost,
                                            item.baseUnit
                                        )}
                                        <span className="text-muted-foreground block text-xs">
                                            Receitas e margens passam a usar o
                                            novo valor.
                                        </span>
                                    </span>
                                    <Switch
                                        checked={updateCost}
                                        onCheckedChange={setUpdateCost}
                                    />
                                </label>
                            )}
                        </div>
                    )}

                    {purchase.error && (
                        <p className="text-destructive text-sm">
                            {purchase.error.message}
                        </p>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={!canSubmit}>
                            {purchase.isPending
                                ? 'Salvando...'
                                : 'Registrar compra'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
