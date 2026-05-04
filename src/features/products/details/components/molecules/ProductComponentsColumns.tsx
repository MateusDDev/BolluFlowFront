import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from 'ui/button'
import { Badge } from 'ui/badge'
import { getMeasurementUnitLabel } from '@/features/ingredients/services/measurementUnits'
import {
    formatCurrency,
    formatQuantityDisplay,
} from '@/shared/helpers/formatHelper'
import { ProductComponentModel } from '@/features/products/services/product.model'
import { ProductComponentsActions } from '@/features/products/details/components/atoms/ProductComponentsActions'

const formatCurrencyPerBaseUnit = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
    }).format(value)

const getBaseUnitSuffix = (baseUnit: string) =>
    getMeasurementUnitLabel(baseUnit).replace(/[()]/g, '')

export const productComponentsColumns: ColumnDef<ProductComponentModel>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                Componente
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        id: 'componentType',
        header: 'Tipo',
        cell: ({ row }) => {
            const item = row.original
            return (
                <Badge variant="outline">
                    {item.componentType === 'Recipe'
                        ? 'Receita'
                        : item.componentType === 'Ingredient'
                          ? 'Ingrediente'
                          : 'Insumo'}
                </Badge>
            )
        },
    },
    {
        accessorKey: 'stockQuantity',
        header: 'Em estoque',
        cell: ({ row }) => {
            const item = row.original

            return (
                <span>
                    {formatQuantityDisplay(item.stockQuantity)}{' '}
                    {getMeasurementUnitLabel(item.baseUnit)}
                </span>
            )
        },
    },
    {
        accessorKey: 'quantityUsed',
        header: 'Quantidade usada',
        cell: ({ row }) => {
            const item = row.original

            return <span>{formatQuantityDisplay(item.quantityUsed)}</span>
        },
    },
    {
        accessorKey: 'unitPrice',
        header: 'Custo unitario',
        cell: ({ row }) => {
            const item = row.original

            if (item.componentType === 'Recipe') {
                if (item.costPerBaseUnit == null) {
                    return (
                        <span className="text-xs text-muted-foreground">
                            Configure o rendimento da receita para calcular o
                            custo
                        </span>
                    )
                }

                return (
                    <span>
                        {`${formatCurrencyPerBaseUnit(
                            item.costPerBaseUnit
                        )}/${getBaseUnitSuffix(item.baseUnit)}`}
                    </span>
                )
            }

            return <span>{formatCurrency(item.unitPrice)}</span>
        },
    },
    {
        id: 'totalPrice',
        header: 'Custo total',
        cell: ({ row }) => {
            const item = row.original

            if (item.componentType === 'Recipe') {
                if (item.costPerBaseUnit == null) {
                    return (
                        <span className="text-xs text-muted-foreground">
                            Sem rendimento
                        </span>
                    )
                }

                return (
                    <span>
                        {formatCurrency(
                            item.costPerBaseUnit * item.quantityUsed
                        )}
                    </span>
                )
            }

            return (
                <span>
                    {formatCurrency(item.quantityUsed * item.unitPrice)}
                </span>
            )
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <ProductComponentsActions component={row.original} />
        ),
    },
]
