import { useState } from 'react'
import { AlertDialog } from 'ui/alert-dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from 'ui/dropdown-menu'
import { Button } from 'ui/button'
import { MoreHorizontal } from 'lucide-react'
import { OrderItemModel } from '@/features/orders/services/order.model'
import { useDeleteOrderItem } from '@/features/orders/details/hooks/mutations/useDeleteOrderItem'
import { EditOrderItemModal } from '@/features/orders/details/components/molecules/EditOrderItemModal'

type Props = {
    orderItem: OrderItemModel
}

export function OrderItemsActions({ orderItem }: Props) {
    const { mutateAsync: deleteOrderItem, isPending } = useDeleteOrderItem()
    const [isEditOpen, setIsEditOpen] = useState(false)

    async function handleConfirmDelete() {
        await deleteOrderItem({
            orderId: orderItem.orderId,
            itemId: orderItem.id,
        })
    }

    return (
        <AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                        Editar item
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={handleConfirmDelete}
                        disabled={isPending}
                        className="text-destructive"
                    >
                        {isPending ? 'Excluindo...' : 'Excluir item'}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditOrderItemModal
                item={orderItem}
                orderId={orderItem.orderId}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
            />
        </AlertDialog>
    )
}
