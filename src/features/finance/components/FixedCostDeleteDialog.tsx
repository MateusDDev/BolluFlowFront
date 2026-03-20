'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/components/ui/dialog'
import { FixedCostModel } from '@/features/finance/services/finance.model'
import { useDeleteFixedCost } from '@/features/finance/hooks/mutations/useDeleteFixedCost'

const options = [
    { value: 'until-this-month', label: 'Excluir somente até este mês' },
    {
        value: 'from-this-month-forward',
        label: 'Excluir deste mês em diante',
    },
    { value: 'permanent', label: 'Excluir permanentemente' },
] as const

export function FixedCostDeleteDialog({
    fixedCost,
    month,
}: {
    fixedCost: FixedCostModel
    month: string
}) {
    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState<(typeof options)[number]['value']>(
        'from-this-month-forward'
    )
    const mutation = useDeleteFixedCost()

    async function handleDelete() {
        await mutation.mutateAsync({ id: fixedCost.id, mode, month })
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">Excluir</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Excluir conta fixa</DialogTitle>
                    <DialogDescription>
                        Escolha como a recorrência deve ser removida.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setMode(option.value)}
                            className={`rounded-lg border p-3 text-left ${mode === option.value ? 'border-primary bg-primary/5' : ''}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                <DialogFooter>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending
                            ? 'Excluindo...'
                            : 'Confirmar exclusão'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
