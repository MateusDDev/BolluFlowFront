import { ReactNode } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Label } from 'ui/label'
import { Switch } from 'ui/switch'

const STOCK_COLUMN_KEYS = ['stockQuantity', 'minimumStockQuantity']

export function withoutStockColumns<TData, TValue>(
    columns: ColumnDef<TData, TValue>[]
) {
    return columns.filter((column) => {
        const key =
            'accessorKey' in column ? String(column.accessorKey) : column.id

        return !key || !STOCK_COLUMN_KEYS.includes(key)
    })
}

type TrackedStockProps = {
    trackStock: boolean
    children: ReactNode
}

export function TrackedStock({ trackStock, children }: TrackedStockProps) {
    if (!trackStock) {
        return (
            <span className="text-muted-foreground text-sm">Sem controle</span>
        )
    }

    return <>{children}</>
}

type TrackStockFieldProps = {
    id: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
}

export function TrackStockField({
    id,
    checked,
    onCheckedChange,
}: TrackStockFieldProps) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
            <div>
                <Label htmlFor={id}>Controlar estoque</Label>
                <p className="text-muted-foreground text-sm">
                    Desligado, o item não bloqueia pedidos nem gera alertas.
                </p>
            </div>
            <Switch
                id={id}
                checked={checked}
                onCheckedChange={onCheckedChange}
            />
        </div>
    )
}
