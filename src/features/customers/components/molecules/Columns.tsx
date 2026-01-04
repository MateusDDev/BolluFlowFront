'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button } from 'ui/button'
import { CustomerActions } from '@/features/customers/components/atoms/CustomerActions'
import { formatDate, formatWhatsapp } from '@/shared/helpers/formatHelper'
import { CustomerModel } from '@/features/customers/services/api/customer.model'

export const columns: ColumnDef<CustomerModel>[] = [
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
        cell: ({ row }) => {
            const customer = row.original as CustomerModel

            return (
                <a
                    target="_blank"
                    href={`https://wa.me/55${customer.whatsapp}`}
                    className="text-primary"
                >
                    {formatWhatsapp(customer.whatsapp)}
                </a>
            )
        },
    },
    {
        accessorKey: 'birthday',
        header: 'Aniversário',
        cell: ({ row }) => {
            const customer = row.original as CustomerModel

            return <div>{formatDate(customer.birthday)}</div>
        },
    },
    {
        accessorKey: 'preferences',
        header: 'Preferências',
    },
    {
        accessorKey: 'address',
        header: () => <div className="text-center">Endereço</div>,
        cell: ({ row }) => {
            const customer = row.original as CustomerModel

            const address = customer.deliveryAddress

            return (
                <div className="text-center">{`Bairro ${address.neighborhood}, Rua ${address.street} - Nº ${address.number}`}</div>
            )
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <CustomerActions customer={row.original as CustomerModel} />
        ),
    },
]
