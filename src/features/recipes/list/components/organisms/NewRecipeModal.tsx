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
import React, { useState } from 'react'
import { useCreateRecipe } from '@/features/recipes/list/hooks/mutations/useCreateRecipe'
import { CreateRecipeDataType } from '@/features/recipes/services/recipe.api'
import { MEASUREMENT_UNITS } from '@/features/ingredients/services/measurementUnits'

export const NewRecipeModal = () => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [baseUnit, setBaseUnit] = useState('')
    const [hours, setHours] = useState('')
    const [minutes, setMinutes] = useState('')
    const [localError, setLocalError] = useState('')

    const { mutateAsync: createRecipe, isPending, error } = useCreateRecipe()

    const resetForm = () => {
        setName('')
        setCategory('')
        setBaseUnit('')
        setHours('')
        setMinutes('')
        setLocalError('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLocalError('')

        if (!baseUnit) {
            setLocalError('Selecione a unidade base de cálculo.')
            return
        }

        const payload: CreateRecipeDataType = {
            name,
            category,
            baseUnit,
        }

        const totalMinutes = Number(hours || 0) * 60 + Number(minutes || 0)

        if (totalMinutes > 0) payload.preparationTime = totalMinutes

        await createRecipe(payload)

        resetForm()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Nova receita</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
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
