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
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { useCreateManualTransaction } from '@/features/finance/hooks/mutations/useCreateManualTransaction'

export function ManualTransactionDialog({
    defaultMonth,
}: {
    defaultMonth: string
}) {
    const [open, setOpen] = useState(false)
    const [type, setType] = useState<'income' | 'expense'>('income')
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [eventDate, setEventDate] = useState(`${defaultMonth}-01`)
    const [notes, setNotes] = useState('')
    const mutation = useCreateManualTransaction()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        await mutation.mutateAsync({
            type,
            description: `${type === 'income' ? 'Manual income' : 'Manual expense'} - ${description}`,
            amount: Number(amount),
            eventDate,
            notes,
        })
        setOpen(false)
        setDescription('')
        setAmount('')
        setNotes('')
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create manual transaction</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create manual transaction</DialogTitle>
                    <DialogDescription>
                        Register a manual income or manual expense for the
                        selected month.
                    </DialogDescription>
                </DialogHeader>
                <form className="grid gap-4" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <Label>Type</Label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={
                                    type === 'income' ? 'default' : 'outline'
                                }
                                onClick={() => setType('income')}
                            >
                                Manual income
                            </Button>
                            <Button
                                type="button"
                                variant={
                                    type === 'expense' ? 'default' : 'outline'
                                }
                                onClick={() => setType('expense')}
                            >
                                Manual expense
                            </Button>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            required
                        />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={amount}
                                onChange={(event) =>
                                    setAmount(event.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="eventDate">Date</Label>
                            <Input
                                id="eventDate"
                                type="date"
                                value={eventDate}
                                onChange={(event) =>
                                    setEventDate(event.target.value)
                                }
                                required
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending
                                ? 'Saving...'
                                : 'Save transaction'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
