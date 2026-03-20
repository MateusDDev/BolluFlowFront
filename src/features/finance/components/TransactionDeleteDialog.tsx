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
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete transaction</DialogTitle>
                    <DialogDescription>
                        {transaction.isAutomatic
                            ? 'This is an automatic transaction. The linked source will also be handled when possible.'
                            : 'This manual transaction will be removed.'}
                    </DialogDescription>
                </DialogHeader>
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
