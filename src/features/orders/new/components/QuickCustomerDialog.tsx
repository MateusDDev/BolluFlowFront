'use client'

import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { UserPlus } from 'lucide-react'
import { Button } from 'ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from 'ui/dialog'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { useCreateCustomer } from '@/features/customers/hooks/mutations/useCreateCustomer'

type Props = {
    onCreated: (customerId: number) => void
}

export function QuickCustomerDialog({ onCreated }: Props) {
    const queryClient = useQueryClient()
    const {
        mutateAsync: createCustomer,
        isPending,
        error,
    } = useCreateCustomer()

    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [whatsapp, setWhatsapp] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()

        const customer = await createCustomer({
            name: name.trim(),
            whatsapp: whatsapp.trim(),
        })

        await queryClient.invalidateQueries({ queryKey: ['orderCustomers'] })

        onCreated(customer.id)
        setName('')
        setWhatsapp('')
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Novo cliente"
                >
                    <UserPlus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Novo cliente</DialogTitle>
                    <DialogDescription>
                        Só o essencial. O endereço pode ser completado depois em
                        Clientes.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="quick-customer-name">Nome</Label>
                        <Input
                            id="quick-customer-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            minLength={2}
                            autoFocus
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="quick-customer-whatsapp">
                            WhatsApp
                        </Label>
                        <Input
                            id="quick-customer-whatsapp"
                            inputMode="tel"
                            placeholder="(11) 99999-0000"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-destructive text-sm">
                            {error.message}
                        </p>
                    )}

                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Salvando...' : 'Salvar cliente'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
