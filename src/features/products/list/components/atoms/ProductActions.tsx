import { useState } from 'react'
import { ModuleGate } from '@/shared/modules/ModuleGate'
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
import { ProductModel } from '@/features/products/services/product.model'
import { ProductProductionModal } from '@/features/products/list/components/organisms/ProductProductionModal'
import { ProductStockAdjustmentModal } from '@/features/products/list/components/organisms/ProductStockAdjustmentModal'

type Props = {
    product: ProductModel
}

export function ProductActions({ product }: Props) {
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
                        <Link href={`/products/${product.id}`}>
                            Ver detalhes
                        </Link>
                    </DropdownMenuItem>
                    <ModuleGate module="stock">
                        <DropdownMenuItem
                            onClick={() => setIsProductionOpen(true)}
                        >
                            Registrar produção
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setIsStockAdjustmentOpen(true)}
                        >
                            Corrigir estoque
                        </DropdownMenuItem>
                    </ModuleGate>
                </DropdownMenuContent>
            </DropdownMenu>

            <ProductProductionModal
                product={product}
                open={isProductionOpen}
                onOpenChange={setIsProductionOpen}
            />

            <ProductStockAdjustmentModal
                productId={product.id}
                open={isStockAdjustmentOpen}
                onOpenChange={setIsStockAdjustmentOpen}
            />
        </>
    )
}
