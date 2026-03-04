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
import { RecipeIngredientModel } from '@/features/recipes/services/recipeIngredient.model'
import { useDeleteRecipeIngredient } from '@/features/recipes/details/hooks/mutations/useDeleteRecipeIngredient'
import { EditRecipeIngredientModal } from '@/features/recipes/details/components/molecules/EditRecipeIngredientModal'

type Props = {
    recipeIngredient: RecipeIngredientModel
}

export function RecipeIngredientsActions({ recipeIngredient }: Props) {
    const { mutateAsync: deleteRecipeIngredient, isPending } =
        useDeleteRecipeIngredient()
    const [isEditOpen, setIsEditOpen] = useState(false)

    async function handleConfirmDelete() {
        await deleteRecipeIngredient({
            recipeId: recipeIngredient.recipeId,
            ingredientId: recipeIngredient.ingredientId,
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
                        Editar insumo
                    </DropdownMenuItem>

                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive">
                            Excluir insumo
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditRecipeIngredientModal
                recipeId={recipeIngredient.recipeId}
                recipeIngredient={recipeIngredient}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
            />

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Excluir insumo?</AlertDialogTitle>
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
