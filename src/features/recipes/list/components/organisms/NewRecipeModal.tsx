'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from 'ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from 'ui/dialog'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { ChipGroup, ChipOption } from 'components/ChipGroup'
import { ModuleGate } from '@/shared/modules/ModuleGate'
import { HelpTip } from 'components/HelpTip'
import { MeasurementUnitValue } from '@/features/ingredients/services/measurementUnits'
import { getStockUnit } from '@/features/stockItems/services/stockItemUnits'
import { useCreateRecipe } from '@/features/recipes/list/hooks/mutations/useCreateRecipe'

type YieldUnit = 'g' | 'kg' | 'ml' | 'L' | 'un'

const YIELD_UNITS: Record<
    YieldUnit,
    { baseUnit: MeasurementUnitValue; factor: number }
> = {
    g: { baseUnit: 'Gram', factor: 1 },
    kg: { baseUnit: 'Gram', factor: 1000 },
    ml: { baseUnit: 'Milliliter', factor: 1 },
    L: { baseUnit: 'Milliliter', factor: 1000 },
    un: { baseUnit: 'Unit', factor: 1 },
}

const YIELD_UNIT_OPTIONS: ChipOption<YieldUnit>[] = (
    Object.keys(YIELD_UNITS) as YieldUnit[]
).map((value) => ({ value, label: value }))

function parseDecimal(value: string) {
    if (value.trim() === '') return null
    const parsed = Number(value.replace(',', '.'))
    return Number.isFinite(parsed) ? parsed : null
}

export const NewRecipeModal = () => {
    const router = useRouter()
    const { mutateAsync: createRecipe, isPending, error } = useCreateRecipe()

    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [yieldAmount, setYieldAmount] = useState('')
    const [yieldUnit, setYieldUnit] = useState<YieldUnit>('kg')
    const [preparationMinutes, setPreparationMinutes] = useState('')
    const [minimumStock, setMinimumStock] = useState('')

    const { baseUnit, factor } = YIELD_UNITS[yieldUnit]
    const unitInfo = getStockUnit(baseUnit)
    const yieldValue = parseDecimal(yieldAmount)
    const minimumValue = parseDecimal(minimumStock)

    const canSubmit =
        name.trim().length >= 2 &&
        yieldValue !== null &&
        yieldValue > 0 &&
        !isPending

    const handleOpenChange = (next: boolean) => {
        setOpen(next)
        if (!next) return

        setName('')
        setCategory('')
        setYieldAmount('')
        setYieldUnit('kg')
        setPreparationMinutes('')
        setMinimumStock('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (yieldValue === null) return

        const minutes = Number(preparationMinutes) || 0

        const created = await createRecipe({
            name: name.trim(),
            category: category.trim(),
            baseUnit,
            yield: yieldValue * factor,
            preparationTime: minutes > 0 ? minutes : undefined,
            minimumStockQuantity:
                minimumValue === null
                    ? undefined
                    : minimumValue * unitInfo.largeFactor,
        })

        setOpen(false)
        router.push(`/recipes/${created.id}?tab=ingredients`)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4" />
                    Nova receita
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[460px]">
                <DialogHeader>
                    <DialogTitle>Nova receita</DialogTitle>
                    <DialogDescription>
                        Depois de criar, você adiciona os ingredientes e o custo
                        aparece sozinho.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="new-recipe-name">Nome</Label>
                        <Input
                            id="new-recipe-name"
                            placeholder="Ex.: Ganache de chocolate"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="new-recipe-category">
                            Categoria{' '}
                            <span className="text-muted-foreground font-normal">
                                (opcional)
                            </span>
                        </Label>
                        <Input
                            id="new-recipe-category"
                            placeholder="Ex.: Recheios"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="new-recipe-yield">
                            Rende{' '}
                            <HelpTip>
                                Quanto a receita inteira produz. Se rende 1 kg e
                                custa R$ 30, cada 100 g usados num produto
                                custam R$ 3.
                            </HelpTip>
                        </Label>
                        <div className="flex flex-wrap items-center gap-2">
                            <Input
                                id="new-recipe-yield"
                                inputMode="decimal"
                                placeholder="Ex.: 1,2"
                                className="w-28"
                                value={yieldAmount}
                                onChange={(e) => setYieldAmount(e.target.value)}
                            />
                            <ChipGroup
                                ariaLabel="Unidade do rendimento"
                                options={YIELD_UNIT_OPTIONS}
                                value={yieldUnit}
                                onChange={(value) =>
                                    value && setYieldUnit(value)
                                }
                            />
                        </div>
                        <p className="text-muted-foreground text-xs">
                            Quanto a receita produz. É o que permite calcular o
                            custo por {unitInfo.largeName} nos produtos.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="new-recipe-time">
                                Tempo de preparo (min)
                            </Label>
                            <Input
                                id="new-recipe-time"
                                inputMode="numeric"
                                placeholder="Opcional"
                                value={preparationMinutes}
                                onChange={(e) =>
                                    setPreparationMinutes(
                                        e.target.value.replace(/\D/g, '')
                                    )
                                }
                            />
                        </div>

                        <ModuleGate module="stock">
                            <div className="grid gap-2">
                                <Label htmlFor="new-recipe-minimum">
                                    Avisar abaixo de ({unitInfo.largeSymbol})
                                </Label>
                                <Input
                                    id="new-recipe-minimum"
                                    inputMode="decimal"
                                    placeholder="Opcional"
                                    value={minimumStock}
                                    onChange={(e) =>
                                        setMinimumStock(e.target.value)
                                    }
                                />
                            </div>
                        </ModuleGate>
                    </div>

                    {error && (
                        <p className="text-destructive text-sm">
                            {error.message}
                        </p>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={!canSubmit}>
                            {isPending
                                ? 'Criando...'
                                : 'Criar e adicionar ingredientes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
