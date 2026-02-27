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
import { Label } from 'ui/label'
import { Input } from 'ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'
import React, { useMemo, useState } from 'react'
import { useCreateIngredient } from '@/features/ingredients/hooks/mutations/useCreateIngredient'
import { formatCurrencyFromInput } from '@/shared/helpers/formatHelper'
import { CreateIngredientDataType } from '@/features/ingredients/services/ingredient.api'
import { MEASUREMENT_UNITS } from '@/features/ingredients/services/measurementUnits'
import { createIngredientConversion } from '@/features/ingredients/services/ingredientConversion.api'

export const NewIngredientModal = () => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [baseUnit, setBaseUnit] = useState('')

    const [usePurchaseConversion, setUsePurchaseConversion] = useState(false)
    const [conversionName, setConversionName] = useState('')
    const [conversionQuantityInBase, setConversionQuantityInBase] = useState('')
    const [purchasePrice, setPurchasePrice] = useState('')
    const [initialPurchaseQuantity, setInitialPurchaseQuantity] = useState('')

    const [unitCost, setUnitCost] = useState('')
    const [stockQuantity, setStockQuantity] = useState<string | undefined>('')
    const [minimumStockQuantity, setMinimumStockQuantity] = useState('')
    const [localError, setLocalError] = useState('')

    const {
        mutateAsync: createIngredient,
        isPending,
        error,
    } = useCreateIngredient()

    const parsedConversionFactor = Number(conversionQuantityInBase.replace(',', '.'))
    const parsedPurchasePrice = Number(purchasePrice) / 100
    const parsedInitialPurchaseQuantity = Number(
        initialPurchaseQuantity.replace(',', '.')
    )

    const previewBaseUnitPrice = useMemo(() => {
        if (
            !usePurchaseConversion ||
            isNaN(parsedConversionFactor) ||
            parsedConversionFactor <= 0 ||
            isNaN(parsedPurchasePrice)
        )
            return 0

        return parsedPurchasePrice / parsedConversionFactor
    }, [usePurchaseConversion, parsedConversionFactor, parsedPurchasePrice])

    const previewInitialStockInBase = useMemo(() => {
        if (
            !usePurchaseConversion ||
            isNaN(parsedConversionFactor) ||
            parsedConversionFactor <= 0 ||
            isNaN(parsedInitialPurchaseQuantity)
        )
            return 0

        return parsedInitialPurchaseQuantity * parsedConversionFactor
    }, [
        usePurchaseConversion,
        parsedConversionFactor,
        parsedInitialPurchaseQuantity,
    ])

    const resetForm = () => {
        setName('')
        setBaseUnit('')
        setUsePurchaseConversion(false)
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

        let calculatedUnitCost = Number(unitCost) / 100
        let calculatedStockQuantity = Number(stockQuantity)

        if (usePurchaseConversion) {
            const factor = Number(conversionQuantityInBase.replace(',', '.'))
            const conversionPrice = Number(purchasePrice) / 100
            const purchaseQuantity = Number(initialPurchaseQuantity.replace(',', '.'))

            if (!conversionName.trim()) {
                setLocalError('Informe o nome da conversão de compra.')
                return
            }

            if (
                isNaN(factor) ||
                factor <= 0 ||
                isNaN(conversionPrice) ||
                conversionPrice <= 0 ||
                isNaN(purchaseQuantity) ||
                purchaseQuantity <= 0
            ) {
                setLocalError('Preencha os dados da compra inicial corretamente.')
                return
            }

            calculatedUnitCost = conversionPrice / factor
            calculatedStockQuantity = purchaseQuantity * factor
        }

        if (
            isNaN(calculatedUnitCost) ||
            calculatedUnitCost <= 0 ||
            isNaN(calculatedStockQuantity) ||
            calculatedStockQuantity <= 0
        ) {
            setLocalError('Preço unitário e estoque inicial precisam ser maiores que zero.')
            return
        }

        const payload: CreateIngredientDataType = {
            name,
            baseUnit,
            unitCost: calculatedUnitCost,
            stockQuantity: calculatedStockQuantity,
        }

        if (minimumStockQuantity !== '')
            payload.minimumStockQuantity = Number(minimumStockQuantity)

        const createdIngredient = await createIngredient(payload)

        if (usePurchaseConversion) {
            await createIngredientConversion(createdIngredient.id, {
                name: conversionName.trim(),
                quantityInBaseUnit: Number(
                    conversionQuantityInBase.replace(',', '.')
                ),
            })
        }

        resetForm()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Novo ingrediente</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[560px]">
                <DialogHeader>
                    <DialogTitle>Novo ingrediente</DialogTitle>
                    <DialogDescription>
                        Você pode cadastrar direto na unidade base ou já informar
                        uma conversão de compra (ex: cartela).
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Nome*</Label>
                        <Input
                            placeholder="Nome do ingrediente"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Unidade base de cálculo*</Label>
                        <Select value={baseUnit} onValueChange={setBaseUnit} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a unidade" />
                            </SelectTrigger>

                            <SelectContent>
                                {MEASUREMENT_UNITS.map((measurementUnit) => (
                                    <SelectItem
                                        key={measurementUnit.value}
                                        value={measurementUnit.value}
                                    >
                                        {measurementUnit.label}
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
                                variant={usePurchaseConversion ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setUsePurchaseConversion((prev) => !prev)}
                            >
                                {usePurchaseConversion ? 'Ativado' : 'Ativar'}
                            </Button>
                        </div>

                        {usePurchaseConversion ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="grid gap-2">
                                        <Label>Nome da compra*</Label>
                                        <Input
                                            placeholder="Ex: cartela"
                                            value={conversionName}
                                            onChange={(e) =>
                                                setConversionName(e.target.value)
                                            }
                                            required={usePurchaseConversion}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Qtd em unidade base*</Label>
                                        <Input
                                            inputMode="decimal"
                                            placeholder="Ex: 30"
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
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="grid gap-2">
                                        <Label>Preço da compra*</Label>
                                        <Input
                                            placeholder="0,00"
                                            inputMode="decimal"
                                            value={formatCurrencyFromInput(purchasePrice)}
                                            onChange={(e) => {
                                                const digits = e.target.value.replace(
                                                    /\D/g,
                                                    ''
                                                )
                                                setPurchasePrice(digits)
                                            }}
                                            required={usePurchaseConversion}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Qtd comprada inicial*</Label>
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
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    Preview: custo unitário base ≈{' '}
                                    {previewBaseUnitPrice.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })}{' '}
                                    • estoque inicial ≈{' '}
                                    {previewInitialStockInBase.toLocaleString('pt-BR')}
                                </p>
                            </>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                Desativado: você cadastra diretamente preço e estoque na unidade base.
                            </p>
                        )}
                    </div>

                    {!usePurchaseConversion && (
                        <>
                            <div className="grid gap-3">
                                <Label>Custo unitário (base)*</Label>
                                <Input
                                    placeholder="0,00"
                                    inputMode="decimal"
                                    value={formatCurrencyFromInput(unitCost)}
                                    onChange={(e) => {
                                        const digits = e.target.value.replace(/\D/g, '')
                                        setUnitCost(digits)
                                    }}
                                    required
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label>Quantidade em estoque*</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="20"
                                    value={stockQuantity}
                                    onChange={(e) => setStockQuantity(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="grid gap-3">
                        <Label>Estoque mínimo</Label>
                        <Input
                            type="number"
                            min={0}
                            placeholder="19"
                            value={minimumStockQuantity}
                            onChange={(e) => setMinimumStockQuantity(e.target.value)}
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

                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Salvando...' : 'Adicionar'}
                            </Button>
                        </div>

                        {(error || localError) && (
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
