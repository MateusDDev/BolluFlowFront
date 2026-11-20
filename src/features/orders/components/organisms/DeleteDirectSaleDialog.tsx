'use client'

import { ReactNode, useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from 'ui/alert-dialog'
import { useDeleteDirectSale } from '@/features/orders/hooks/useDeleteDirectSale'

type Props = {
    orderId: number
    orderNumber: number
    trigger: ReactNode
    onDeleted?: () => void
}

export function DeleteDirectSaleDialog({
    orderId,
    orderNumber,
    trigger,
    onDeleted,
}: Props) {
    const [open, setOpen] = useState(false)
    const { mutateAsync, isPending, error } = useDeleteDirectSale()

    const handleConfirm = async () => {
        await mutateAsync(orderId)
        setOpen(false)
        onDeleted?.()
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Excluir a venda #{orderNumber}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Os produtos voltam para o estoque e a receita sai do
                        financeiro. Não dá para desfazer.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {error && (
                    <p className="text-destructive text-sm">{error.message}</p>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        Manter venda
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isPending}
                        className="bg-destructive text-white hover:bg-destructive/90"
                        onClick={(event) => {
                            event.preventDefault()
                            void handleConfirm()
                        }}
                    >
                        {isPending ? 'Excluindo...' : 'Excluir venda'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
