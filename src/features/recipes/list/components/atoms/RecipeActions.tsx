import { useState } from 'react'
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
import Link from 'next/link'
import { RecipeModel } from '@/features/recipes/services/recipe.model'
import { RecipeProductionModal } from '@/features/recipes/list/components/organisms/RecipeProductionModal'
import { RecipeStockAdjustmentModal } from '@/features/recipes/list/components/organisms/RecipeStockAdjustmentModal'

type Props = {
    recipe: RecipeModel
}

export function RecipeActions({ recipe }: Props) {
    const [isProductionOpen, setIsProductionOpen] = useState(false)
    const [isStockAdjustmentOpen, setIsStockAdjustmentOpen] = useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href={`/recipes/${recipe.id}`}>Ver detalhes</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsProductionOpen(true)}>
                        Registrar produção
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setIsStockAdjustmentOpen(true)}
                    >
                        Corrigir estoque
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <RecipeProductionModal
                recipe={recipe}
                open={isProductionOpen}
                onOpenChange={setIsProductionOpen}
            />

            <RecipeStockAdjustmentModal
                recipeId={recipe.id}
                open={isStockAdjustmentOpen}
                onOpenChange={setIsStockAdjustmentOpen}
            />
        </>
    )
}
