'use client'

import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
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
import { Button } from 'ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from 'ui/dropdown-menu'
import { ModuleGate } from '@/shared/modules/ModuleGate'
import { StockItemConfig } from '@/features/stockItems/services/stockItem.config'
import { StockItemModel } from '@/features/stockItems/services/stockItem.api'
import { useDeleteStockItem } from '@/features/stockItems/hooks/useStockItemActions'
import { StockItemFormDialog } from '@/features/stockItems/components/StockItemFormDialog'
import { StockItemPurchaseDialog } from '@/features/stockItems/components/StockItemPurchaseDialog'
import { StockItemCountDialog } from '@/features/stockItems/components/StockItemCountDialog'
import { StockItemPackagesDialog } from '@/features/stockItems/components/StockItemPackagesDialog'

type OpenDialog = 'edit' | 'purchase' | 'count' | 'packages' | null

type Props = {
    config: StockItemConfig
    item: StockItemModel
}

export function StockItemActions({ config, item }: Props) {
    const [openDialog, setOpenDialog] = useState<OpenDialog>(null)
    const remove = useDeleteStockItem(config)

    const dialogProps = (dialog: Exclude<OpenDialog, null>) => ({
        config,
        item,
        open: openDialog === dialog,
        onOpenChange: (open: boolean) => setOpenDialog(open ? dialog : null),
    })

    return (
        <AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        aria-label={`Ações de ${item.name}`}
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <ModuleGate module={['stock', 'finance']}>
                        <DropdownMenuItem
                            onClick={() => setOpenDialog('purchase')}
                        >
                            Registrar compra
                        </DropdownMenuItem>
                    </ModuleGate>
                    <ModuleGate module="stock">
                        <DropdownMenuItem
                            onClick={() => setOpenDialog('count')}
                        >
                            Contar estoque
                        </DropdownMenuItem>
                    </ModuleGate>
                    <DropdownMenuItem onClick={() => setOpenDialog('edit')}>
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenDialog('packages')}>
                        Embalagens
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive">
                            Excluir
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>

            <StockItemFormDialog {...dialogProps('edit')} />
            <StockItemPurchaseDialog {...dialogProps('purchase')} />
            <StockItemCountDialog {...dialogProps('count')} />
            <StockItemPackagesDialog {...dialogProps('packages')} />

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Excluir {item.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Não dá para desfazer. Se estiver em alguma receita ou
                        ficha técnica, a exclusão é recusada.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {remove.error && (
                    <p className="text-destructive text-sm">
                        {remove.error.message}
                    </p>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={remove.isPending}
                        className="bg-destructive hover:bg-destructive/90 text-white"
                        onClick={(event) => {
                            event.preventDefault()
                            remove.mutate(item.id)
                        }}
                    >
                        {remove.isPending ? 'Excluindo...' : 'Excluir'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
