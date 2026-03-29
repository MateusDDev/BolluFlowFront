import { useState } from 'react'
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
import { SupplyModel } from '@/features/supplies/services/supply.model'
import { EditSupplyModal } from '@/features/supplies/components/organisms/EditSupplyModal'
import { useDeleteSupply } from '@/features/supplies/hooks/mutations/useDeleteSupply'
import { SupplyConversionsModal } from '@/features/supplies/components/organisms/SupplyConversionsModal'
import { SupplyStockEntryModal } from '@/features/supplies/components/organisms/SupplyStockEntryModal'

type Props = {
    supply: SupplyModel
}

export function SupplyActions({ supply }: Props) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isConversionsOpen, setIsConversionsOpen] = useState(false)
    const [isStockEntryOpen, setIsStockEntryOpen] = useState(false)

    const { mutateAsync, isPending } = useDeleteSupply()

    const handleDelete = async () => {
        await mutateAsync(supply.id)
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
                    <DropdownMenuLabel>Acoes</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                        Editar insumo
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setIsConversionsOpen(true)}
                    >
                        Gerenciar conversoes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsStockEntryOpen(true)}>
                        Registrar compra
                    </DropdownMenuItem>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive">
                            Excluir insumo
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditSupplyModal
                supply={supply}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
            />

            <SupplyConversionsModal
                supply={supply}
                open={isConversionsOpen}
                onOpenChange={setIsConversionsOpen}
            />

            <SupplyStockEntryModal
                supply={supply}
                open={isStockEntryOpen}
                onOpenChange={setIsStockEntryOpen}
            />

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Excluir insumo?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acao nao pode ser desfeita.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
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
