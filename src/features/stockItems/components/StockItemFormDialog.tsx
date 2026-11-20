'use client'

import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
import { ChipGroup, ChipOption } from 'components/ChipGroup'
import { formatCurrencyFromInput } from '@/shared/helpers/formatHelper'
import { ModuleGate } from '@/shared/modules/ModuleGate'
import { TrackStockField } from '@/shared/modules/stock'
import {
    MeasurementUnitValue,
    normalizeMeasurementUnit,
} from '@/features/ingredients/services/measurementUnits'
import { StockItemConfig } from '@/features/stockItems/services/stockItem.config'
import {
    getStockItemPackages,
    StockItemModel,
} from '@/features/stockItems/services/stockItem.api'
import {
    formatStockQuantity,
    formatUnitCost,
    fromBaseQuantity,
    getStockUnit,
    STOCK_UNITS,
    toBaseQuantity,
} from '@/features/stockItems/services/stockItemUnits'
import {
    useCreateStockItem,
    useUpdateStockItem,
} from '@/features/stockItems/hooks/useStockItems'

type PriceMode = 'package' | 'direct'

const UNIT_OPTIONS: ChipOption<MeasurementUnitValue>[] = (
    Object.keys(STOCK_UNITS) as MeasurementUnitValue[]
).map((value) => ({ value, label: STOCK_UNITS[value].chipLabel }))

function parseDecimal(value: string) {
    if (value.trim() === '') return null
    const parsed = Number(value.replace(',', '.'))
    return Number.isFinite(parsed) ? parsed : null
}

function centsToNumber(digits: string) {
    return digits === '' ? 0 : Number(digits) / 100
}

function numberToCents(value: number) {
    return String(Math.round(value * 100))
}

function formatInputNumber(value: number) {
    return value.toLocaleString('pt-BR', { maximumFractionDigits: 3 })
}

type Props = {
    config: StockItemConfig
    open: boolean
    onOpenChange: (open: boolean) => void
    item?: StockItemModel
}

export function StockItemFormDialog({
    config,
    open,
    onOpenChange,
    item,
}: Props) {
    const isEditing = !!item
    const createMutation = useCreateStockItem(config)
    const updateMutation = useUpdateStockItem(config)
    const mutation = isEditing ? updateMutation : createMutation

    const [name, setName] = useState('')
    const [unit, setUnit] = useState<MeasurementUnitValue>('Gram')
    const [priceMode, setPriceMode] = useState<PriceMode>('package')
    const [packageName, setPackageName] = useState('')
    const [packageAmount, setPackageAmount] = useState('')
    const [packagePrice, setPackagePrice] = useState('')
    const [directPrice, setDirectPrice] = useState('')
    const [stockCount, setStockCount] = useState('')
    const [minimumStock, setMinimumStock] = useState('')
    const [trackStock, setTrackStock] = useState(false)

    const { data: packages = [] } = useQuery({
        queryKey: [config.conversionsQueryKey, item?.id],
        queryFn: () => getStockItemPackages(config, item!.id),
        enabled: open && isEditing,
    })

    useEffect(() => {
        if (!open) return

        const itemUnit = item ? normalizeMeasurementUnit(item.baseUnit) : 'Gram'

        setName(item?.name ?? '')
        setUnit(itemUnit)
        setPriceMode(item ? 'direct' : 'package')
        setPackageName('')
        setPackageAmount('')
        setPackagePrice('')
        setDirectPrice(
            item
                ? numberToCents(
                      item.unitCost * getStockUnit(itemUnit).largeFactor
                  )
                : ''
        )
        setStockCount('')
        setMinimumStock(
            item?.minimumStockQuantity
                ? formatInputNumber(
                      fromBaseQuantity(item.minimumStockQuantity, itemUnit)
                  )
                : ''
        )
        setTrackStock(item?.trackStock ?? false)
        mutation.reset()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, item])

    const unitInfo = getStockUnit(unit)
    const usesPackage = !isEditing && priceMode === 'package'
    const packageAmountValue = parseDecimal(packageAmount)

    const unitCost = usesPackage
        ? packageAmountValue && packageAmountValue > 0
            ? centsToNumber(packagePrice) / packageAmountValue
            : 0
        : centsToNumber(directPrice) / unitInfo.largeFactor

    const stockCountValue = parseDecimal(stockCount)
    const stockInBase =
        stockCountValue === null
            ? 0
            : usesPackage
              ? stockCountValue * (packageAmountValue ?? 0)
              : toBaseQuantity(stockCountValue, unit)

    const minimumValue = parseDecimal(minimumStock)
    const minimumInBase =
        minimumValue === null ? undefined : toBaseQuantity(minimumValue, unit)

    const canSubmit =
        name.trim().length >= 2 &&
        unitCost > 0 &&
        (!usesPackage ||
            (packageName.trim() !== '' && (packageAmountValue ?? 0) > 0)) &&
        !mutation.isPending

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (isEditing) {
            const priceChanged =
                directPrice !==
                numberToCents(item.unitCost * unitInfo.largeFactor)

            await updateMutation.mutateAsync({
                id: item.id,
                data: {
                    name: name.trim(),
                    baseUnit: unit,
                    unitCost: priceChanged ? unitCost : item.unitCost,
                    minimumStockQuantity: minimumInBase,
                    trackStock,
                },
            })
        } else {
            await createMutation.mutateAsync({
                name: name.trim(),
                baseUnit: unit,
                unitCost,
                stockQuantity: stockInBase,
                minimumStockQuantity: minimumInBase,
                packageName: usesPackage ? packageName.trim() : undefined,
                packageQuantityInBaseUnit: usesPackage
                    ? (packageAmountValue ?? undefined)
                    : undefined,
            })
        }

        onOpenChange(false)
    }

    const stockUnitLabel = usesPackage
        ? packageName.trim() || 'embalagens'
        : unitInfo.largeSymbol

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? `Editar ${config.singular}`
                            : config.newLabel}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'O custo atualizado vale para receitas e produtos na hora.'
                            : 'Só nome, como você mede e quanto paga. O resto é opcional.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="stock-item-name">Nome</Label>
                        <Input
                            id="stock-item-name"
                            placeholder={config.namePlaceholder}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Medido em</Label>
                        {isEditing ? (
                            <p className="text-sm">
                                {unitInfo.chipLabel}{' '}
                                <span className="text-muted-foreground">
                                    · não dá para trocar depois de criado, para
                                    não mudar as receitas que já usam
                                </span>
                            </p>
                        ) : (
                            <ChipGroup
                                ariaLabel="Medido em"
                                options={UNIT_OPTIONS}
                                value={unit}
                                onChange={(value) => value && setUnit(value)}
                            />
                        )}
                    </div>

                    <div className="grid gap-3 rounded-lg border p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <Label>Quanto custa</Label>
                            {!isEditing && (
                                <ChipGroup
                                    ariaLabel="Como informar o preço"
                                    options={[
                                        {
                                            value: 'package',
                                            label: 'Por embalagem',
                                        },
                                        {
                                            value: 'direct',
                                            label: `Por ${unitInfo.largeName}`,
                                        },
                                    ]}
                                    value={priceMode}
                                    onChange={(value) =>
                                        value && setPriceMode(value)
                                    }
                                />
                            )}
                        </div>

                        {usesPackage ? (
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="grid gap-1.5">
                                    <Label
                                        htmlFor="stock-item-package"
                                        className="text-muted-foreground text-xs"
                                    >
                                        Embalagem
                                    </Label>
                                    <Input
                                        id="stock-item-package"
                                        placeholder={config.packagePlaceholder}
                                        value={packageName}
                                        onChange={(e) =>
                                            setPackageName(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label
                                        htmlFor="stock-item-package-amount"
                                        className="text-muted-foreground text-xs"
                                    >
                                        Vem com ({unitInfo.baseSymbol})
                                    </Label>
                                    <Input
                                        id="stock-item-package-amount"
                                        inputMode="decimal"
                                        placeholder={
                                            unit === 'Unit'
                                                ? 'Ex.: 12'
                                                : 'Ex.: 395'
                                        }
                                        value={packageAmount}
                                        onChange={(e) =>
                                            setPackageAmount(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label
                                        htmlFor="stock-item-package-price"
                                        className="text-muted-foreground text-xs"
                                    >
                                        Preço pago
                                    </Label>
                                    <Input
                                        id="stock-item-package-price"
                                        inputMode="decimal"
                                        placeholder="R$ 0,00"
                                        value={
                                            packagePrice
                                                ? formatCurrencyFromInput(
                                                      packagePrice
                                                  )
                                                : ''
                                        }
                                        onChange={(e) =>
                                            setPackagePrice(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ''
                                                )
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-1.5">
                                <Label
                                    htmlFor="stock-item-direct-price"
                                    className="text-muted-foreground text-xs"
                                >
                                    {unitInfo.priceLabel}
                                </Label>
                                <Input
                                    id="stock-item-direct-price"
                                    inputMode="decimal"
                                    placeholder="R$ 0,00"
                                    value={
                                        directPrice
                                            ? formatCurrencyFromInput(
                                                  directPrice
                                              )
                                            : ''
                                    }
                                    onChange={(e) =>
                                        setDirectPrice(
                                            e.target.value.replace(/\D/g, '')
                                        )
                                    }
                                />
                            </div>
                        )}

                        <p className="text-muted-foreground text-xs">
                            {unitCost > 0
                                ? `Custo usado nas receitas: ${formatUnitCost(unitCost, unit)}`
                                : 'O custo por quilo, litro ou unidade aparece aqui.'}
                        </p>

                        {isEditing && packages.length > 0 && (
                            <p className="text-muted-foreground text-xs">
                                Embalagens:{' '}
                                {packages
                                    .map(
                                        (pkg) =>
                                            `${pkg.name} (${formatStockQuantity(pkg.quantityInBaseUnit, unit)})`
                                    )
                                    .join(', ')}
                            </p>
                        )}
                    </div>

                    <ModuleGate module="stock">
                        <div className="grid gap-3 rounded-lg border p-3">
                            <Label>
                                Estoque{' '}
                                <span className="text-muted-foreground font-normal">
                                    (opcional)
                                </span>
                            </Label>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {!isEditing && (
                                    <div className="grid gap-1.5">
                                        <Label
                                            htmlFor="stock-item-count"
                                            className="text-muted-foreground text-xs"
                                        >
                                            Tenho agora ({stockUnitLabel})
                                        </Label>
                                        <Input
                                            id="stock-item-count"
                                            inputMode="decimal"
                                            placeholder="Deixe vazio se não controla"
                                            value={stockCount}
                                            onChange={(e) =>
                                                setStockCount(e.target.value)
                                            }
                                        />
                                    </div>
                                )}
                                <div className="grid gap-1.5">
                                    <Label
                                        htmlFor="stock-item-minimum"
                                        className="text-muted-foreground text-xs"
                                    >
                                        Avisar abaixo de ({unitInfo.largeSymbol}
                                        )
                                    </Label>
                                    <Input
                                        id="stock-item-minimum"
                                        inputMode="decimal"
                                        placeholder="Opcional"
                                        value={minimumStock}
                                        onChange={(e) =>
                                            setMinimumStock(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            {!isEditing && stockInBase > 0 && (
                                <p className="text-muted-foreground text-xs">
                                    Entra no estoque:{' '}
                                    {formatStockQuantity(stockInBase, unit)}. A
                                    compra também vai para o financeiro.
                                </p>
                            )}
                            {isEditing && (
                                <TrackStockField
                                    id="stock-item-track"
                                    checked={trackStock}
                                    onCheckedChange={setTrackStock}
                                />
                            )}
                        </div>
                    </ModuleGate>

                    {mutation.error && (
                        <p className="text-destructive text-sm">
                            {mutation.error.message}
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
                            {mutation.isPending
                                ? 'Salvando...'
                                : isEditing
                                  ? 'Salvar'
                                  : 'Cadastrar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
