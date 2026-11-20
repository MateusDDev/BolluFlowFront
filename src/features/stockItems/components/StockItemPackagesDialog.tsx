'use client'

import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from 'ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from 'ui/dialog'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { StockItemConfig } from '@/features/stockItems/services/stockItem.config'
import { StockItemModel } from '@/features/stockItems/services/stockItem.api'
import {
    formatStockQuantity,
    getStockUnit,
} from '@/features/stockItems/services/stockItemUnits'
import {
    useCreateStockItemPackage,
    useDeleteStockItemPackage,
    useStockItemPackages,
} from '@/features/stockItems/hooks/useStockItemActions'

type Props = {
    config: StockItemConfig
    item: StockItemModel
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function StockItemPackagesDialog({
    config,
    item,
    open,
    onOpenChange,
}: Props) {
    const { data: packages = [] } = useStockItemPackages(config, item.id, open)
    const createPackage = useCreateStockItemPackage(config)
    const deletePackage = useDeleteStockItemPackage(config)
    const unitInfo = getStockUnit(item.baseUnit)

    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')

    const amountValue = Number(amount.replace(',', '.')) || 0
    const canAdd =
        name.trim() !== '' && amountValue > 0 && !createPackage.isPending

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await createPackage.mutateAsync({
            itemId: item.id,
            name: name.trim(),
            quantityInBaseUnit: amountValue,
        })

        setName('')
        setAmount('')
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[440px]">
                <DialogHeader>
                    <DialogTitle>Embalagens · {item.name}</DialogTitle>
                    <DialogDescription>
                        Como você compra este {config.singular}. Aparecem como
                        opção na compra e na contagem.{' '}
                        {unitInfo.largeFactor > 1 &&
                            `${unitInfo.largeSymbol} e ${unitInfo.baseSymbol} já vêm prontos.`}
                    </DialogDescription>
                </DialogHeader>

                {packages.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                        Nenhuma embalagem cadastrada.
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {packages.map((pkg) => (
                            <li
                                key={pkg.id}
                                className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
                            >
                                <span>
                                    <strong>{pkg.name}</strong> ={' '}
                                    {formatStockQuantity(
                                        pkg.quantityInBaseUnit,
                                        item.baseUnit
                                    )}
                                </span>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    aria-label={`Remover ${pkg.name}`}
                                    disabled={deletePackage.isPending}
                                    onClick={() =>
                                        deletePackage.mutate({
                                            itemId: item.id,
                                            packageId: pkg.id,
                                        })
                                    }
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}

                <form
                    onSubmit={handleAdd}
                    className="grid grid-cols-[2fr_1fr_auto] items-end gap-2"
                >
                    <div className="grid gap-1.5">
                        <Label
                            htmlFor="package-name"
                            className="text-muted-foreground text-xs"
                        >
                            Embalagem
                        </Label>
                        <Input
                            id="package-name"
                            placeholder={config.packagePlaceholder}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-1.5">
                        <Label
                            htmlFor="package-amount"
                            className="text-muted-foreground text-xs"
                        >
                            Vem com ({unitInfo.baseSymbol})
                        </Label>
                        <Input
                            id="package-amount"
                            inputMode="decimal"
                            placeholder="Ex.: 395"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={!canAdd}>
                        Adicionar
                    </Button>
                </form>

                {(createPackage.error || deletePackage.error) && (
                    <p className="text-destructive text-sm">
                        {(createPackage.error ?? deletePackage.error)?.message}
                    </p>
                )}
            </DialogContent>
        </Dialog>
    )
}
