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
import React, { useState } from 'react'
import { useCreateRecipe } from '@/features/recipes/list/hooks/mutations/useCreateRecipe'
import { CreateRecipeDataType } from '@/features/recipes/services/recipe.api'

export const NewRecipeModal = () => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [hours, setHours] = useState('')
    const [minutes, setMinutes] = useState('')

    const { mutateAsync: createRecipe, isPending, error } = useCreateRecipe()

    const resetForm = () => {
        setName('')
        setCategory('')
        setHours('')
        setMinutes('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const payload: CreateRecipeDataType = {
            name,
            category,
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

                        {error && (
                            <p className="text-sm text-red-500">
                                {error.message}
                            </p>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
