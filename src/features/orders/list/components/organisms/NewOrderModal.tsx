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
import { SearchableSelect } from 'components/SearchableSelect'
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
import { PaymentMethod } from '@/features/orders/services/order.model'

const PAYMENT_METHOD_UNDEFINED = 'UNDEFINED'
type PaymentMethodFormValue = PaymentMethod | typeof PAYMENT_METHOD_UNDEFINED

export const NewOrderModal = () => {
    const [open, setOpen] = useState(false)
    const [customerId, setCustomerId] = useState('')
    const [notes, setNotes] = useState('')
    const [deliveryDate, setDeliveryDate] = useState<Date>()
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodFormValue>(
        PAYMENT_METHOD_UNDEFINED
    )

    const { mutateAsync: createOrder, isPending, error } = useCreateOrder()
    const { data: customers, isLoading } = useGetOrderCustomers()

    const resetForm = () => {
        setCustomerId('')
        setNotes('')
        setDeliveryDate(undefined)
        setPaymentMethod(PAYMENT_METHOD_UNDEFINED)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const payload: CreateOrderDataType = {
            customerId: Number(customerId),
            note: notes,
            deliveryDate,
            paymentMethod:
                paymentMethod === PAYMENT_METHOD_UNDEFINED
                    ? null
                    : paymentMethod,
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

                        <SearchableSelect
                            options={
                                customers?.map((customer) => ({
                                    value: customer.id.toString(),
                                    label: customer.name,
                                })) ?? []
                            }
                            value={customerId}
                            onValueChange={setCustomerId}
                            disabled={isLoading}
                            placeholder="Selecione um cliente"
                            searchPlaceholder="Buscar cliente..."
                            emptyMessage="Nenhum cliente encontrado."
                        />
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

                    <div className="grid gap-3">
                        <Label>Forma de pagamento</Label>

                        <Select
                            value={paymentMethod}
                            onValueChange={(value) =>
                                setPaymentMethod(
                                    value as PaymentMethodFormValue
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a forma de pagamento" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value={PAYMENT_METHOD_UNDEFINED}>
                                    Não definida
                                </SelectItem>
                                <SelectItem value="Cash">Dinheiro</SelectItem>
                                <SelectItem value="Pix">Pix</SelectItem>
                                <SelectItem value="CreditCard">
                                    Cartão de crédito
                                </SelectItem>
                                <SelectItem value="DebitCard">
                                    Cartão de débito
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

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
