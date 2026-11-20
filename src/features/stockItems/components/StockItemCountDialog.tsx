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
import { cn } from '@/shared/lib/utils'
import { StockItemConfig } from '@/features/stockItems/services/stockItem.config'
import { StockItemModel } from '@/features/stockItems/services/stockItem.api'
import { formatStockQuantity } from '@/features/stockItems/services/stockItemUnits'
import { buildQuantityUnitOptions } from '@/features/stockItems/services/stockItemQuantityUnits'
import {
    useAdjustStockItem,
    useStockItemPackages,
} from '@/features/stockItems/hooks/useStockItemActions'

type Props = {
    config: StockItemConfig
    item: StockItemModel
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function StockItemCountDialog({
    config,
    item,
    open,
    onOpenChange,
}: Props) {
    const { data: packages = [] } = useStockItemPackages(config, item.id, open)
    const adjust = useAdjustStockItem(config)

    const unitOptions = useMemo(
        () => buildQuantityUnitOptions(item.baseUnit, packages),
        [item.baseUnit, packages]
    )

    const [counted, setCounted] = useState('')
    const [unitValue, setUnitValue] = useState('large')
    const [note, setNote] = useState('')

    useEffect(() => {
        if (!open) return

        setCounted('')
        setNote('')
        adjust.reset()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const selectedUnit =
        unitOptions.find((option) => option.value === unitValue) ??
        unitOptions[0]

    const countedValue =
        counted.trim() === '' ? null : Number(counted.replace(',', '.'))
    const countedBase =
        countedValue === null || Number.isNaN(countedValue)
            ? null
            : countedValue * (selectedUnit?.factor ?? 1)
    const difference =
        countedBase === null ? null : countedBase - item.stockQuantity

    const canSubmit =
        difference !== null &&
        Math.abs(difference) > 0.0001 &&
        countedBase !== null &&
        countedBase >= 0 &&
        !adjust.isPending

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (difference === null) return

        await adjust.mutateAsync({
            itemId: item.id,
            quantity: Math.abs(difference),
            direction: difference > 0 ? 'add' : 'remove',
            unitCost: item.unitCost,
            reason: note.trim()
                ? `Contagem de estoque: ${note.trim()}`
                : 'Contagem de estoque',
        })

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[440px]">
                <DialogHeader>
                    <DialogTitle>Contar estoque · {item.name}</DialogTitle>
                    <DialogDescription>
                        Diga quanto tem de verdade. O sistema calcula a
                        diferença.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <p className="text-sm">
                        No sistema:{' '}
                        <strong>
                            {item.trackStock
                                ? formatStockQuantity(
                                      item.stockQuantity,
                                      item.baseUnit
                                  )
                                : 'sem controle ainda'}
                        </strong>
                    </p>

                    <div className="grid gap-2">
                        <Label>Tenho agora</Label>
                        <div className="grid grid-cols-[1fr_2fr] gap-2">
                            <Input
                                inputMode="decimal"
                                placeholder="Ex.: 1,5"
                                value={counted}
                                onChange={(e) => setCounted(e.target.value)}
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
                        <Label htmlFor="count-note">
                            Motivo{' '}
                            <span className="text-muted-foreground font-normal">
                                (opcional)
                            </span>
                        </Label>
                        <Input
                            id="count-note"
                            placeholder="Ex.: perda, quebra, contagem do mês"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    {difference !== null && (
                        <p
                            className={cn(
                                'text-sm',
                                difference < 0
                                    ? 'text-destructive'
                                    : 'text-emerald-600'
                            )}
                        >
                            {Math.abs(difference) <= 0.0001
                                ? 'Bate com o sistema, nada a ajustar.'
                                : `${difference > 0 ? 'Entram' : 'Saem'} ${formatStockQuantity(Math.abs(difference), item.baseUnit)}`}
                        </p>
                    )}

                    {adjust.error && (
                        <p className="text-destructive text-sm">
                            {adjust.error.message}
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
                            {adjust.isPending
                                ? 'Salvando...'
                                : 'Salvar contagem'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
