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
import { useDeleteIngredient } from '@/features/ingredients/hooks/mutations/useDeleteIngredient'
import { EditIngredientModal } from '@/features/ingredients/components/organisms/EditIngredientModal'
import { IngredientConversionsModal } from '@/features/ingredients/components/organisms/IngredientConversionsModal'
import { IngredientStockEntryModal } from '@/features/ingredients/components/organisms/IngredientStockEntryModal'
import { IngredientModel } from '@/features/ingredients/services/ingredient.model'

type Props = {
    ingredient: IngredientModel
}

export function IngredientActions({ ingredient }: Props) {
    const { mutateAsync: deleteIngredient, isPending } = useDeleteIngredient()
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isConversionsOpen, setIsConversionsOpen] = useState(false)
    const [isStockEntryOpen, setIsStockEntryOpen] = useState(false)

    async function handleConfirmDelete() {
        await deleteIngredient(ingredient.id)
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
                        Editar ingrediente
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setIsConversionsOpen(true)}>
                        Gerenciar conversões
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setIsStockEntryOpen(true)}>
                        Entrada de estoque por conversão
                    </DropdownMenuItem>

                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive">
                            Excluir ingrediente
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditIngredientModal
                ingredient={ingredient}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
            />

            <IngredientConversionsModal
                ingredient={ingredient}
                open={isConversionsOpen}
                onOpenChange={setIsConversionsOpen}
            />

            <IngredientStockEntryModal
                ingredient={ingredient}
                open={isStockEntryOpen}
                onOpenChange={setIsStockEntryOpen}
            />

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Excluir ingrediente?</AlertDialogTitle>
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
