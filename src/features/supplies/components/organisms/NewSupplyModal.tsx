import React, { useMemo, useState } from 'react'
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
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'
import { formatCurrencyFromInput } from '@/shared/helpers/formatHelper'
import { MEASUREMENT_UNITS } from '@/features/ingredients/services/measurementUnits'
import { useCreateSupply } from '@/features/supplies/hooks/mutations/useCreateSupply'
import { CreateSupplyDataType } from '@/features/supplies/services/supply.api'
import { createSupplyConversion } from '@/features/supplies/services/supplyConversion.api'

const parseDecimalInput = (value: string) => Number(value.replace(',', '.'))

export function NewSupplyModal() {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [baseUnit, setBaseUnit] = useState('')

    const [usePurchaseConversion, setUsePurchaseConversion] = useState(true)
    const [conversionName, setConversionName] = useState('')
    const [conversionQuantityInBase, setConversionQuantityInBase] = useState('')
    const [purchasePrice, setPurchasePrice] = useState('')
    const [initialPurchaseQuantity, setInitialPurchaseQuantity] = useState('')

    const [unitCost, setUnitCost] = useState('')
    const [stockQuantity, setStockQuantity] = useState('')
    const [minimumStockQuantity, setMinimumStockQuantity] = useState('')
    const [localError, setLocalError] = useState('')

    const { mutateAsync, isPending, error } = useCreateSupply()

    const parsedConversionFactor = parseDecimalInput(conversionQuantityInBase)
    const parsedPurchasePrice = Number(purchasePrice) / 100
    const parsedInitialPurchaseQuantity = parseDecimalInput(
        initialPurchaseQuantity
    )
    const parsedMinimumStockInput = parseDecimalInput(minimumStockQuantity)

    const previewBaseUnitCost = useMemo(() => {
        if (
            !usePurchaseConversion ||
            isNaN(parsedConversionFactor) ||
            parsedConversionFactor <= 0 ||
            isNaN(parsedPurchasePrice)
        ) {
            return 0
        }

        return parsedPurchasePrice / parsedConversionFactor
    }, [usePurchaseConversion, parsedConversionFactor, parsedPurchasePrice])

    const previewInitialStockInBase = useMemo(() => {
        if (
            !usePurchaseConversion ||
            isNaN(parsedConversionFactor) ||
            parsedConversionFactor <= 0 ||
            isNaN(parsedInitialPurchaseQuantity)
        ) {
            return 0
        }

        return parsedInitialPurchaseQuantity * parsedConversionFactor
    }, [
        usePurchaseConversion,
        parsedConversionFactor,
        parsedInitialPurchaseQuantity,
    ])

    const reset = () => {
        setName('')
        setBaseUnit('')
        setUsePurchaseConversion(true)
        setConversionName('')
        setConversionQuantityInBase('')
        setPurchasePrice('')
        setInitialPurchaseQuantity('')
        setUnitCost('')
        setStockQuantity('')
        setMinimumStockQuantity('')
        setLocalError('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLocalError('')

        if (!baseUnit) {
            setLocalError('Selecione a unidade base.')
            return
        }

        let calculatedUnitCost = Number(unitCost) / 100
        let calculatedStockQuantity = Number(stockQuantity)

        if (usePurchaseConversion) {
            if (!conversionName.trim()) {
                setLocalError('Informe o nome da conversao de compra.')
                return
            }

            if (
                isNaN(parsedConversionFactor) ||
                parsedConversionFactor <= 0 ||
                isNaN(parsedPurchasePrice) ||
                parsedPurchasePrice <= 0 ||
                isNaN(parsedInitialPurchaseQuantity) ||
                parsedInitialPurchaseQuantity <= 0
            ) {
                setLocalError(
                    'Preencha os dados da compra inicial corretamente.'
                )
                return
            }

            calculatedUnitCost = parsedPurchasePrice / parsedConversionFactor
            calculatedStockQuantity =
                parsedInitialPurchaseQuantity * parsedConversionFactor
        }

        if (
            isNaN(calculatedUnitCost) ||
            calculatedUnitCost <= 0 ||
            isNaN(calculatedStockQuantity) ||
            calculatedStockQuantity <= 0
        ) {
            setLocalError(
                'Custo base e estoque inicial precisam ser maiores que zero.'
            )
            return
        }

        let calculatedMinimumStock: number | null = null

        if (minimumStockQuantity !== '') {
            if (isNaN(parsedMinimumStockInput) || parsedMinimumStockInput < 0) {
                setLocalError('Estoque minimo invalido.')
                return
            }

            calculatedMinimumStock = usePurchaseConversion
                ? parsedMinimumStockInput * parsedConversionFactor
                : parsedMinimumStockInput
        }

        const payload: CreateSupplyDataType = {
            name,
            baseUnit,
            unitCost: calculatedUnitCost,
            stockQuantity: calculatedStockQuantity,
        }

        if (calculatedMinimumStock !== null) {
            payload.minimumStockQuantity = calculatedMinimumStock
        }

        const created = await mutateAsync(payload)

        if (usePurchaseConversion && created?.id) {
            await createSupplyConversion(created.id, {
                name: conversionName.trim(),
                quantityInBaseUnit: parsedConversionFactor,
            })
        }

        reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Novo insumo</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Novo insumo</DialogTitle>
                    <DialogDescription>
                        Cadastre o insumo informando custo e estoque direto na
                        unidade base ou por conversao de compra.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Nome*</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Unidade base*</Label>
                        <Select value={baseUnit} onValueChange={setBaseUnit}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a unidade" />
                            </SelectTrigger>
                            <SelectContent>
                                {MEASUREMENT_UNITS.map((unit) => (
                                    <SelectItem
                                        key={unit.value}
                                        value={unit.value}
                                    >
                                        {unit.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border p-3 grid gap-3">
                        <div className="flex items-center justify-between">
                            <Label>Cadastro pela unidade de compra</Label>
                            <Button
                                type="button"
                                variant={
                                    usePurchaseConversion
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() =>
                                    setUsePurchaseConversion((prev) => !prev)
                                }
                            >
                                {usePurchaseConversion ? 'Ativado' : 'Ativar'}
                            </Button>
                        </div>

                        {usePurchaseConversion ? (
                            <>
                                <div className="grid gap-3">
                                    <Label>Nome da conversao*</Label>
                                    <Input
                                        placeholder="Ex: pacote"
                                        value={conversionName}
                                        onChange={(e) =>
                                            setConversionName(e.target.value)
                                        }
                                        required={usePurchaseConversion}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label>Quantidade na unidade base*</Label>
                                    <Input
                                        inputMode="decimal"
                                        placeholder="Ex: 50"
                                        value={conversionQuantityInBase}
                                        onChange={(e) =>
                                            setConversionQuantityInBase(
                                                e.target.value.replace(
                                                    /[^\d,.]/g,
                                                    ''
                                                )
                                            )
                                        }
                                        required={usePurchaseConversion}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label>Preco da compra*</Label>
                                    <Input
                                        value={formatCurrencyFromInput(
                                            purchasePrice
                                        )}
                                        onChange={(e) => {
                                            const digits =
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ''
                                                )
                                            setPurchasePrice(digits)
                                        }}
                                        required={usePurchaseConversion}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label>Quantidade comprada*</Label>
                                    <Input
                                        inputMode="decimal"
                                        placeholder="Ex: 2"
                                        value={initialPurchaseQuantity}
                                        onChange={(e) =>
                                            setInitialPurchaseQuantity(
                                                e.target.value.replace(
                                                    /[^\d,.]/g,
                                                    ''
                                                )
                                            )
                                        }
                                        required={usePurchaseConversion}
                                    />
                                </div>

                                <div className="rounded-md bg-muted/40 p-3 text-sm text-muted-foreground space-y-1">
                                    <p>
                                        Custo base estimado:{' '}
                                        <strong>
                                            {previewBaseUnitCost.toLocaleString(
                                                'pt-BR',
                                                {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                }
                                            )}
                                        </strong>
                                    </p>
                                    <p>
                                        Estoque inicial estimado:{' '}
                                        <strong>
                                            {previewInitialStockInBase.toLocaleString(
                                                'pt-BR'
                                            )}
                                        </strong>
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                Desativado: voce cadastra diretamente custo e
                                estoque na unidade base.
                            </p>
                        )}
                    </div>

                    {!usePurchaseConversion && (
                        <>
                            <div className="grid gap-3">
                                <Label>Custo unitario*</Label>
                                <Input
                                    type="text"
                                    value={formatCurrencyFromInput(unitCost)}
                                    onChange={(e) => {
                                        const digits = e.target.value.replace(
                                            /\D/g,
                                            ''
                                        )
                                        setUnitCost(digits)
                                    }}
                                    required={!usePurchaseConversion}
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label>Estoque inicial*</Label>
                                <Input
                                    inputMode="decimal"
                                    placeholder="Ex: 100"
                                    value={stockQuantity}
                                    onChange={(e) =>
                                        setStockQuantity(
                                            e.target.value.replace(
                                                /[^\d,.]/g,
                                                ''
                                            )
                                        )
                                    }
                                    required={!usePurchaseConversion}
                                />
                            </div>
                        </>
                    )}

                    <div className="grid gap-3">
                        <Label>Estoque minimo</Label>
                        <Input
                            inputMode="decimal"
                            placeholder="Ex: 10"
                            value={minimumStockQuantity}
                            onChange={(e) =>
                                setMinimumStockQuantity(
                                    e.target.value.replace(/[^\d,.]/g, '')
                                )
                            }
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
                                disabled={isPending || !baseUnit}
                            >
                                {isPending ? 'Salvando...' : 'Adicionar'}
                            </Button>
                        </div>

                        {(localError || error) && (
                            <p className="text-sm text-red-500">
                                {localError || error?.message}
                            </p>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
