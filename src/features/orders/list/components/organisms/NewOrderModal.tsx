import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from 'ui/dialog'
import { Button } from 'ui/button'
import { Label } from 'ui/label'
import React, { useState } from 'react'
import { CreateOrderDataType } from '@/features/orders/services/order.api'
import { useCreateOrder } from '@/features/orders/list/hooks/mutations/useCreateOrder'
import { Textarea } from 'ui/textarea'
import { DatePicker } from 'components/DatePicker'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'
import { useGetOrderCustomers } from '@/features/orders/list/hooks/queries/useGetOrderCustomers'

export const NewOrderModal = () => {
    const [open, setOpen] = useState(false)
    const [customerId, setCustomerId] = useState('')
    const [notes, setNotes] = useState('')
    const [deliveryDate, setDeliveryDate] = useState<Date>()

    const { mutateAsync: createOrder, isPending, error } = useCreateOrder()
    const { data: customers, isLoading } = useGetOrderCustomers()

    const resetForm = () => {
        setCustomerId('')
        setNotes('')
        setDeliveryDate(undefined)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const payload: CreateOrderDataType = {
            customerId: Number(customerId),
            notes,
            deliveryDate,
        }

        await createOrder(payload)

        resetForm()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Novo pedido</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Novo pedido</DialogTitle>
                    <DialogDescription>
                        Preencha os dados do pedido e clique em salvar.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label>Cliente*</Label>

                        <Select
                            value={customerId}
                            onValueChange={setCustomerId}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um ingrediente" />
                            </SelectTrigger>

                            <SelectContent>
                                {customers?.length ? (
                                    customers.map((customer) => (
                                        <SelectItem
                                            key={customer.id}
                                            value={customer.id.toString()}
                                        >
                                            {customer.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-sm text-muted-foreground">
                                        Nenhum cliente cadastrado.
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-3">
                        <Label>Anotações</Label>
                        <Textarea
                            placeholder="Alguma informação adicional sobre o pedido"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <DatePicker
                        date={deliveryDate}
                        setDateAction={setDeliveryDate}
                        label="Data de entrega*"
                    />

                    <DialogFooter className="flex flex-col gap-2">
                        <div className="flex justify-end gap-2">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isPending}
                                >
                                    Cancelar
                                </Button>
                            </DialogClose>

                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Salvando...' : 'Adicionar'}
                            </Button>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500">
                                {error.message}
                            </p>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
