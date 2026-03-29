'use client'

import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { MessageCircle, Smartphone, Pencil, X } from 'lucide-react'

import { Label } from 'ui/label'
import { Input } from 'ui/input'
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card'
import { Separator } from 'ui/separator'
import { Badge } from 'ui/badge'
import { Button } from 'ui/button'
import { Textarea } from 'ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'ui/select'

import {
    OrderModel,
    PaymentMethod,
    orderStatusLabelMap,
    orderStatusVariantMap,
} from '@/features/orders/services/order.model'
import { useGetOrder } from '@/features/orders/details/hooks/queries/useGetOrder'
import { useGetOrderItems } from '@/features/orders/details/hooks/queries/useGetOrderItems'
import { OrderStatusActions } from '@/features/orders/details/components/atoms/OrderStatusActions'
import {
    formatCurrency,
    formatWhatsapp,
    getPaymentMethodLabel,
} from '@/shared/helpers/formatHelper'
import { useGetOrderCustomers } from '@/features/orders/list/hooks/queries/useGetOrderCustomers'
import { useUpdateOrder } from '@/features/orders/details/hooks/mutations/useUpdateOrder'
import { UpdateOrderDataType } from '@/features/orders/services/order.api'
import { DatePicker } from 'components/DatePicker'
import { OrderWhatsappModal } from '@/features/orders/components/organisms/OrderWhatsappModal'

const PAYMENT_METHOD_UNDEFINED = 'UNDEFINED'

interface FormState {
    customerId: string
    deliveryDate?: Date
    notes: string
    paymentMethod: PaymentMethod | typeof PAYMENT_METHOD_UNDEFINED
}

function mapOrderToForm(order: OrderModel): FormState {
    return {
        customerId: order.customer.id.toString(),
        deliveryDate: order.deliveryDate
            ? new Date(order.deliveryDate)
            : undefined,
        notes: order.note ?? '',
        paymentMethod: order.paymentMethod ?? PAYMENT_METHOD_UNDEFINED,
    }
}

export function OrderDetails() {
    const { id } = useParams<{ id: string }>()
    const orderId = Number(id)

    const { data: order, isLoading } = useGetOrder(orderId)
    const { data: orderItems } = useGetOrderItems(orderId)
    const { data: customers, isLoading: isLoadingCustomers } =
        useGetOrderCustomers()

    const { mutateAsync: updateOrder, isPending } = useUpdateOrder()

    const [form, setForm] = useState<FormState | null>(null)
    const [initialForm, setInitialForm] = useState<FormState | null>(null)
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        if (!order) return

        const mapped = mapOrderToForm(order)

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm(mapped)
        setInitialForm(mapped)
    }, [order])

    const isDirty = useMemo(() => {
        if (!form || !initialForm) return false

        return JSON.stringify(form) !== JSON.stringify(initialForm)
    }, [form, initialForm])

    if (isLoading || !order || !form) return null

    const total =
        orderItems?.reduce((total, item) => {
            return total + item.quantity * item.unitPrice
        }, 0) ?? 0

    const setField = <K extends keyof FormState>(
        field: K,
        value: FormState[K]
    ) => {
        setForm((prev) => (prev ? { ...prev, [field]: value } : prev))
    }

    const handleCancelEdit = () => {
        setForm(initialForm)
        setIsEditing(false)
    }

    const handleSave = async () => {
        if (!isDirty || !form) return

        const payload: UpdateOrderDataType = {
            customerId: Number(form.customerId),
            notes: form.notes,
            deliveryDate: form.deliveryDate,
            paymentMethod:
                form.paymentMethod === PAYMENT_METHOD_UNDEFINED
                    ? null
                    : form.paymentMethod,
        }

        await updateOrder({
            orderId: orderId,
            data: payload,
        })

        setInitialForm(form)
        setIsEditing(false)
    }

    return (
        <div className="my-6 space-y-6">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">
                        Pedido #{order.number}
                    </h2>

                    <Badge variant={orderStatusVariantMap[order.status]}>
                        {orderStatusLabelMap[order.status]}
                    </Badge>
                </div>

                <div className="flex gap-2">
                    {order.customer.whatsapp && (
                        <OrderWhatsappModal
                            order={order}
                            orderItems={orderItems}
                            trigger={
                                <Button variant="outline" size="sm">
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Enviar no WhatsApp
                                </Button>
                            }
                        />
                    )}

                    {!isEditing ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                        >
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEdit}
                                disabled={isPending}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancelar
                            </Button>

                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={!isDirty || isPending}
                            >
                                {isPending ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                Cliente
                                {!isEditing && (
                                    <Link
                                        href={`https://wa.me/${order.customer.whatsapp}`}
                                        target="_blank"
                                        className="text-primary"
                                    >
                                        <Smartphone className="h-4 w-4" />
                                    </Link>
                                )}
                            </CardTitle>
                        </CardHeader>

                        <Separator />

                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label>Cliente</Label>

                                {isEditing ? (
                                    <Select
                                        value={form.customerId}
                                        onValueChange={(value) =>
                                            setField('customerId', value)
                                        }
                                        disabled={isLoadingCustomers}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um cliente" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {customers?.map((customer) => (
                                                <SelectItem
                                                    key={customer.id}
                                                    value={customer.id.toString()}
                                                >
                                                    {customer.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        value={order.customer.name}
                                        disabled
                                    />
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label>WhatsApp</Label>
                                <Input
                                    value={formatWhatsapp(
                                        order.customer.whatsapp
                                    )}
                                    disabled
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Endereço</Label>
                                <Input
                                    value={`Rua ${order.customer.deliveryAddress.street}, Nº ${order.customer.deliveryAddress.number} - Bairro ${order.customer.deliveryAddress.neighborhood}`}
                                    disabled
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Forma de pagamento</Label>

                                {isEditing ? (
                                    <Select
                                        value={form.paymentMethod}
                                        onValueChange={(value) =>
                                            setField('paymentMethod', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a forma de pagamento" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem
                                                value={PAYMENT_METHOD_UNDEFINED}
                                            >
                                                Não definida
                                            </SelectItem>
                                            <SelectItem value="Cash">
                                                Dinheiro
                                            </SelectItem>
                                            <SelectItem value="Pix">
                                                Pix
                                            </SelectItem>
                                            <SelectItem value="CreditCard">
                                                Cartão de crédito
                                            </SelectItem>
                                            <SelectItem value="DebitCard">
                                                Cartão de débito
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : order.paymentMethod ? (
                                    <div>
                                        <Badge variant="outline">
                                            {getPaymentMethodLabel(
                                                order.paymentMethod
                                            )}
                                        </Badge>
                                    </div>
                                ) : null}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Observações</CardTitle>
                        </CardHeader>

                        <Separator />

                        <CardContent>
                            {isEditing ? (
                                <Textarea
                                    value={form.notes}
                                    onChange={(e) =>
                                        setField('notes', e.target.value)
                                    }
                                />
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {order.note || 'Nenhuma observação'}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Linha do tempo</CardTitle>
                        </CardHeader>

                        <Separator />

                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <Label>Pedido criado</Label>
                                <p>
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                <Label>Data de entrega</Label>
                                {isEditing ? (
                                    <DatePicker
                                        label=""
                                        date={form.deliveryDate}
                                        setDateAction={(date) =>
                                            setField('deliveryDate', date)
                                        }
                                    />
                                ) : (
                                    <p>
                                        {order.deliveryDate
                                            ? new Date(
                                                  order.deliveryDate
                                              ).toLocaleDateString()
                                            : '-'}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Resumo financeiro</CardTitle>
                        </CardHeader>

                        <Separator />

                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span>Total</span>
                                <span className="font-medium">
                                    {formatCurrency(total)}
                                </span>
                            </div>

                            {order.paymentMethod && (
                                <div className="flex justify-between items-center">
                                    <span>Pagamento:</span>
                                    <Badge variant="outline">
                                        {getPaymentMethodLabel(
                                            order.paymentMethod
                                        )}
                                    </Badge>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Ações</CardTitle>
                        </CardHeader>

                        <Separator />

                        <CardContent>
                            <OrderStatusActions
                                orderStatus={order.status}
                                orderId={orderId}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default OrderDetails
