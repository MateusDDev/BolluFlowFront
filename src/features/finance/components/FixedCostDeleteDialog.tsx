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
    { value: 'until-this-month', label: 'Delete only until this month' },
    {
        value: 'from-this-month-forward',
        label: 'Delete from this month forward',
    },
    { value: 'permanent', label: 'Delete permanently' },
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
                <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete fixed cost</DialogTitle>
                    <DialogDescription>
                        Choose how the recurring series should be removed.
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
                        {mutation.isPending ? 'Deleting...' : 'Confirm delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
