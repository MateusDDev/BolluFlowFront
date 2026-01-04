import { useDeleteCustomer } from '@/features/customers/hooks/mutations/useDeleteCustomer'
import EditCustomerModal from '@/features/customers/components/organisms/EditCustomerModal'
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
import { useState } from 'react'
import { CustomerModel } from '@/features/customers/services/api/customer.model'

type Props = {
    customer: CustomerModel
}

export function CustomerActions({ customer }: Props) {
    const { mutateAsync: deleteCustomer, isPending } = useDeleteCustomer()
    const [isEditOpen, setIsEditOpen] = useState(false)

    async function handleConfirmDelete() {
        await deleteCustomer(customer.id)
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

                    <DropdownMenuItem
                        onClick={() =>
                            navigator.clipboard.writeText(customer.whatsapp)
                        }
                    >
                        Copiar número do Whatsapp
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                        Editar cliente
                    </DropdownMenuItem>

                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive">
                            Excluir cliente
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditCustomerModal
                customer={customer}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
            />

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleConfirmDelete}
                        disabled={isPending}
                        className="bg-destructive text-destructive-foreground"
                    >
                        {isPending ? 'Excluindo...' : 'Excluir'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
