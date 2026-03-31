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
import { useCreateRecipe } from '@/features/recipes/list/hooks/mutations/useCreateRecipe'
import { CreateRecipeDataType } from '@/features/recipes/services/recipe.api'
import { MEASUREMENT_UNITS } from '@/features/ingredients/services/measurementUnits'
import { createRecipeConversion } from '@/features/recipes/services/recipeConversion.api'

const parseDecimalInput = (value: string) => Number(value.replace(',', '.'))

export const NewRecipeModal = () => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [baseUnit, setBaseUnit] = useState('')
    const [hours, setHours] = useState('')
    const [minutes, setMinutes] = useState('')
    const [minimumStockQuantity, setMinimumStockQuantity] = useState('')
    const [usePurchaseConversion, setUsePurchaseConversion] = useState(false)
    const [conversionName, setConversionName] = useState('')
    const [conversionQuantityInBase, setConversionQuantityInBase] = useState('')
    const [localError, setLocalError] = useState('')

    const { mutateAsync: createRecipe, isPending, error } = useCreateRecipe()

    const parsedConversionFactor = parseDecimalInput(conversionQuantityInBase)
    const parsedMinimumStockInput = parseDecimalInput(minimumStockQuantity)

    const previewMinimumStockInBase = useMemo(() => {
        if (!usePurchaseConversion || minimumStockQuantity === '') return null

        if (
            isNaN(parsedMinimumStockInput) ||
            isNaN(parsedConversionFactor) ||
            parsedConversionFactor <= 0
        ) {
            return null
        }

        return parsedMinimumStockInput * parsedConversionFactor
    }, [
        usePurchaseConversion,
        minimumStockQuantity,
        parsedMinimumStockInput,
        parsedConversionFactor,
    ])

    const resetForm = () => {
        setName('')
        setCategory('')
        setBaseUnit('')
        setHours('')
        setMinutes('')
        setMinimumStockQuantity('')
        setUsePurchaseConversion(false)
        setConversionName('')
        setConversionQuantityInBase('')
        setLocalError('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLocalError('')

        if (!baseUnit) {
            setLocalError('Selecione a unidade base de cálculo.')
            return
        }

        if (usePurchaseConversion) {
            if (!conversionName.trim()) {
                setLocalError('Informe o nome da conversão de rendimento.')
                return
            }

            if (isNaN(parsedConversionFactor) || parsedConversionFactor <= 0) {
                setLocalError('Quantidade da conversão inválida.')
                return
            }
        }

        const payload: CreateRecipeDataType = {
            name,
            category,
            baseUnit,
        }

        const totalMinutes = Number(hours || 0) * 60 + Number(minutes || 0)

        if (totalMinutes > 0) payload.preparationTime = totalMinutes

        if (minimumStockQuantity !== '') {
            if (isNaN(parsedMinimumStockInput) || parsedMinimumStockInput < 0) {
                setLocalError('Estoque mínimo inválido.')
                return
            }

            payload.minimumStockQuantity = usePurchaseConversion
                ? parsedMinimumStockInput * parsedConversionFactor
                : parsedMinimumStockInput
        }

        const createdRecipe = await createRecipe(payload)

        if (usePurchaseConversion) {
            console.log(createdRecipe)
            await createRecipeConversion(createdRecipe.id, {
                name: conversionName.trim(),
                quantityInBaseUnit: parsedConversionFactor,
            })
        }

        resetForm()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Nova receita</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>Nova receita</DialogTitle>
                    <DialogDescription>
                        Preencha os dados da receita e clique em salvar.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Nome*</Label>
                        <Input
                            placeholder="Nome da receita"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Categoria*</Label>
                        <Input
                            placeholder="Bolos, Trufas, etc."
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label>Unidade base de cálculo*</Label>
                        <Select value={baseUnit} onValueChange={setBaseUnit}>
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
                            <Label>Rendimento</Label>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="grid gap-2">
                                    <Label>Nome do rendimento*</Label>
                                    <Input
                                        placeholder="Ex: forma"
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
                                        placeholder="Ex: 12"
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
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                Desativado: o estoque mínimo será informado na
                                unidade base.
                            </p>
                        )}
                    </div>

                    <div className="grid gap-3">
                        <Label>
                            {usePurchaseConversion
                                ? 'Estoque mínimo (na unidade de rendimento)'
                                : 'Estoque mínimo'}
                        </Label>
                        <Input
                            type={usePurchaseConversion ? 'text' : 'number'}
                            inputMode={
                                usePurchaseConversion ? 'decimal' : undefined
                            }
                            min={0}
                            placeholder="10"
                            value={minimumStockQuantity}
                            onChange={(e) =>
                                setMinimumStockQuantity(
                                    usePurchaseConversion
                                        ? e.target.value.replace(/[^\d,.]/g, '')
                                        : e.target.value
                                )
                            }
                        />
                        {usePurchaseConversion &&
                            previewMinimumStockInBase !== null && (
                                <p className="text-xs text-muted-foreground">
                                    Equivale a{' '}
                                    {previewMinimumStockInBase.toLocaleString(
                                        'pt-BR'
                                    )}{' '}
                                    na unidade base.
                                </p>
                            )}
                    </div>

                    <div className="grid gap-3">
                        <Label>Tempo de preparo</Label>

                        <div className="flex gap-2">
                            <Input
                                type="number"
                                min={0}
                                placeholder="Horas"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                            />
                            <Input
                                type="number"
                                min={0}
                                max={59}
                                placeholder="Minutos"
                                value={minutes}
                                onChange={(e) => setMinutes(e.target.value)}
                            />
                        </div>
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
