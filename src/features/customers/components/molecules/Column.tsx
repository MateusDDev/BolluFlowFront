'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'

import { Button } from 'ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from 'ui/dropdown-menu'
import { Customer } from '@/features/customers/domain/customer'

export const columns: ColumnDef<Customer>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Nome
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: 'whatsapp',
        header: 'Whatsapp',
    },
    {
        accessorKey: 'birthdate',
        header: 'Aniversário',
    },
    {
        accessorKey: 'preferences',
        header: 'Preferências',
    },
    {
        accessorKey: 'address',
        header: () => <div className="text-center">Endereço</div>,
        cell: ({ row }) => {
            const customer = row.original as Customer

            const address = customer.deliveryAddress

            return (
                <div className="text-center">{`${address.neighborhood} - ${address.street} - ${address.number}`}</div>
            )
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const customer = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
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
                        <DropdownMenuItem>Editar cliente</DropdownMenuItem>
                        <DropdownMenuItem>Excluir cliente</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
