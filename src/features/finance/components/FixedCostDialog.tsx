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
import { FixedCostModel } from '@/features/finance/services/finance.model'
import { useCreateFixedCost } from '@/features/finance/hooks/mutations/useCreateFixedCost'
import { useUpdateFixedCost } from '@/features/finance/hooks/mutations/useUpdateFixedCost'

function getDraft(fixedCost: FixedCostModel | undefined, defaultMonth: string) {
    return {
        name: fixedCost?.name ?? '',
        amount: fixedCost ? String(fixedCost.amount) : '',
        startMonth: fixedCost?.startMonth ?? defaultMonth,
        endMonth: fixedCost?.endMonth ?? '',
        notes: fixedCost?.notes ?? '',
    }
}

export function FixedCostDialog({
    fixedCost,
    defaultMonth,
}: {
    fixedCost?: FixedCostModel
    defaultMonth: string
}) {
    const [open, setOpen] = useState(false)
    const [draft, setDraft] = useState(() => getDraft(fixedCost, defaultMonth))
    const createMutation = useCreateFixedCost()
    const updateMutation = useUpdateFixedCost()

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen)
        if (nextOpen) {
            setDraft(getDraft(fixedCost, defaultMonth))
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const payload = {
            name: draft.name,
            amount: Number(draft.amount),
            startMonth: draft.startMonth,
            endMonth: draft.endMonth || null,
            notes: draft.notes,
        }

        if (fixedCost) {
            await updateMutation.mutateAsync({
                id: fixedCost.id,
                data: payload,
            })
        } else {
            await createMutation.mutateAsync(payload)
        }

        setOpen(false)
    }

    const isPending = createMutation.isPending || updateMutation.isPending

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant={fixedCost ? 'outline' : 'default'}>
                    {fixedCost ? 'Editar' : 'Nova conta fixa'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {fixedCost ? 'Editar conta fixa' : 'Criar conta fixa'}
                    </DialogTitle>
                    <DialogDescription>
                        As contas fixas aparecem automaticamente como despesas
                        mensais nos próximos meses.
                    </DialogDescription>
                </DialogHeader>
                <form className="grid gap-4" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="fixed-name">Nome</Label>
                        <Input
                            id="fixed-name"
                            value={draft.name}
                            onChange={(event) =>
                                setDraft((current) => ({
                                    ...current,
                                    name: event.target.value,
                                }))
                            }
                            required
                        />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="fixed-amount">Valor</Label>
                            <Input
                                id="fixed-amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={draft.amount}
                                onChange={(event) =>
                                    setDraft((current) => ({
                                        ...current,
                                        amount: event.target.value,
                                    }))
                                }
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="fixed-start">Mês inicial</Label>
                            <Input
                                id="fixed-start"
                                type="month"
                                value={draft.startMonth}
                                onChange={(event) =>
                                    setDraft((current) => ({
                                        ...current,
                                        startMonth: event.target.value,
                                    }))
                                }
                                required
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="fixed-end">Mês final</Label>
                        <Input
                            id="fixed-end"
                            type="month"
                            value={draft.endMonth}
                            onChange={(event) =>
                                setDraft((current) => ({
                                    ...current,
                                    endMonth: event.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="fixed-notes">Observações</Label>
                        <Textarea
                            id="fixed-notes"
                            value={draft.notes}
                            onChange={(event) =>
                                setDraft((current) => ({
                                    ...current,
                                    notes: event.target.value,
                                }))
                            }
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Salvando...' : 'Salvar conta fixa'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
