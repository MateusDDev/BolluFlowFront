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
import { FinancialTransactionModel } from '@/features/finance/services/finance.model'
import { useDeleteTransaction } from '@/features/finance/hooks/mutations/useDeleteTransaction'

export function TransactionDeleteDialog({
    transaction,
}: {
    transaction: FinancialTransactionModel
}) {
    const [open, setOpen] = useState(false)
    const mutation = useDeleteTransaction()

    async function handleDelete() {
        await mutation.mutateAsync(transaction.id)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    Excluir
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Excluir lançamento</DialogTitle>
                    <DialogDescription>
                        {transaction.isAutomatic
                            ? 'Este lançamento é automático. O vínculo com a origem será tratado pelo backend quando aplicável.'
                            : 'Este lançamento manual será removido.'}
                    </DialogDescription>
                </DialogHeader>
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
