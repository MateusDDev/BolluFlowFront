'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { MessageCircle, Smartphone, Pencil, Trash2, X } from 'lucide-react'
import { SearchableSelect } from 'components/SearchableSelect'

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
    isDirectSale,
    orderStatusLabelMap,
    orderStatusVariantMap,
} from '@/features/orders/services/order.model'
import { useGetOrder } from '@/features/orders/details/hooks/queries/useGetOrder'
import { useGetOrderItems } from '@/features/orders/details/hooks/queries/useGetOrderItems'
import { OrderStatusActions } from '@/features/orders/details/components/atoms/OrderStatusActions'
import { DeleteDirectSaleDialog } from '@/features/orders/components/organisms/DeleteDirectSaleDialog'
import {
    formatCurrency,
    formatCurrencyFromInput,
    formatWhatsapp,
    getPaymentMethodLabel,
} from '@/shared/helpers/formatHelper'
import { useGetOrderCustomers } from '@/features/orders/list/hooks/queries/useGetOrderCustomers'
import { useUpdateOrder } from '@/features/orders/details/hooks/mutations/useUpdateOrder'
import { UpdateOrderDataType } from '@/features/orders/services/order.api'
import { DatePicker } from 'components/DatePicker'
import { OrderWhatsappModal } from '@/features/orders/components/organisms/OrderWhatsappModal'

const PAYMENT_METHOD_UNDEFINED = 'UNDEFINED'
const DISCOUNT_TYPE_NONE = 'None'
type DiscountTypeFormValue = 'Percentage' | 'Fixed' | typeof DISCOUNT_TYPE_NONE

interface FormState {
    customerId: string
    deliveryDate?: Date
    note: string
    paymentMethod: PaymentMethod | typeof PAYMENT_METHOD_UNDEFINED
    discountType: DiscountTypeFormValue
    discount: string
    shippingFee: string
}

function mapOrderToForm(order: OrderModel): FormState {
    return {
        customerId: order.customer?.id.toString() ?? '',
        deliveryDate: order.deliveryDate
            ? new Date(order.deliveryDate)
            : undefined,
        note: order.note ?? '',
        paymentMethod: order.paymentMethod ?? PAYMENT_METHOD_UNDEFINED,
        discountType: order.discountType ?? DISCOUNT_TYPE_NONE,
        discount:
            order.discountType === 'Fixed'
                ? String(Math.round((order.discount ?? 0) * 100))
                : (order.discount?.toString() ?? ''),
        shippingFee: String(Math.round(order.shippingFee * 100)),
    }
}

export function OrderDetails() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
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

        const parsedDiscount =
            form.discountType === 'Fixed'
                ? Number(form.discount) / 100
                : Number(form.discount)

        const parsedShippingFee = Number(form.shippingFee) / 100

        const payload: UpdateOrderDataType = {
            customerId: form.customerId ? Number(form.customerId) : undefined,
            note: form.note,
            deliveryDate: form.deliveryDate,
            paymentMethod:
                form.paymentMethod === PAYMENT_METHOD_UNDEFINED
                    ? null
                    : form.paymentMethod,
            discount:
                form.discountType === DISCOUNT_TYPE_NONE ||
                Number.isNaN(parsedDiscount)
                    ? null
                    : parsedDiscount,
            discountType:
                form.discountType === DISCOUNT_TYPE_NONE
                    ? null
                    : form.discountType,
            shippingFee: Number.isNaN(parsedShippingFee)
                ? 0
                : parsedShippingFee,
        }

        await updateOrder({
            orderId: orderId,
            data: payload,
        })

        setInitialForm(form)
        setIsEditing(false)
    }

    const editDiscountValue =
        form.discountType === DISCOUNT_TYPE_NONE || !form.discount
            ? 0
            : form.discountType === 'Percentage'
              ? order.subtotal * (Number(form.discount) / 100)
              : Number(form.discount) / 100

    return (
        <div className="my-6 space-y-6">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">
                        {isDirectSale(order) ? 'Venda' : 'Pedido'} #
                        {order.number}
                    </h2>

                    {isDirectSale(order) ? (
                        <Badge variant="outline">Venda rápida</Badge>
                    ) : (
                        <Badge variant={orderStatusVariantMap[order.status]}>
                            {orderStatusLabelMap[order.status]}
                        </Badge>
                    )}
                </div>

                <div className="flex gap-2">
                    {order.customer?.whatsapp && (
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
                                {!isEditing && order.customer?.whatsapp && (
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
                                    <SearchableSelect
                                        options={
                                            customers?.map((customer) => ({
                                                value: customer.id.toString(),
                                                label: customer.name,
                                            })) ?? []
                                        }
                                        value={form.customerId}
                                        onValueChange={(value) =>
                                            setField('customerId', value)
                                        }
                                        disabled={isLoadingCustomers}
                                        placeholder="Selecione um cliente"
                                        searchPlaceholder="Buscar cliente..."
                                        emptyMessage="Nenhum cliente encontrado."
                                    />
                                ) : (
                                    <Input
                                        value={
                                            order.customer?.name ??
                                            'Sem cliente'
                                        }
                                        disabled
                                    />
                                )}
                            </div>

                            {order.customer && (
                                <div className="grid gap-2">
                                    <Label>WhatsApp</Label>
                                    <Input
                                        value={formatWhatsapp(
                                            order.customer.whatsapp
                                        )}
                                        disabled
                                    />
                                </div>
                            )}

                            {order.customer?.deliveryAddress && (
                                <div className="grid gap-2">
                                    <Label>Endereço</Label>
                                    <Input
                                        value={`Rua ${order.customer.deliveryAddress.street}, Nº ${order.customer.deliveryAddress.number} - Bairro ${order.customer.deliveryAddress.neighborhood}`}
                                        disabled
                                    />
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label>Forma de pagamento</Label>

                                {isEditing ? (
                                    <Select
                                        value={form.paymentMethod}
                                        onValueChange={(value) =>
                                            setField(
                                                'paymentMethod',
                                                value as FormState['paymentMethod']
                                            )
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

                            {isEditing && (
                                <>
                                    <div className="grid gap-2">
                                        <Label>Desconto</Label>

                                        <Select
                                            value={form.discountType}
                                            onValueChange={(value) =>
                                                setField(
                                                    'discountType',
                                                    value as DiscountTypeFormValue
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o tipo de desconto" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectItem
                                                    value={DISCOUNT_TYPE_NONE}
                                                >
                                                    Sem desconto
                                                </SelectItem>
                                                <SelectItem value="Percentage">
                                                    Porcentagem (%)
                                                </SelectItem>
                                                <SelectItem value="Fixed">
                                                    Valor fixo (R$)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {form.discountType !==
                                        DISCOUNT_TYPE_NONE && (
                                        <div className="grid gap-2">
                                            <Label>
                                                {form.discountType ===
                                                'Percentage'
                                                    ? 'Valor do desconto (%)'
                                                    : 'Valor do desconto (R$)'}
                                            </Label>

                                            {form.discountType ===
                                            'Percentage' ? (
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0"
                                                    value={form.discount}
                                                    onChange={(e) =>
                                                        setField(
                                                            'discount',
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <Input
                                                    placeholder="0,00"
                                                    value={formatCurrencyFromInput(
                                                        form.discount
                                                    )}
                                                    onChange={(e) =>
                                                        setField(
                                                            'discount',
                                                            e.target.value.replace(
                                                                /\D/g,
                                                                ''
                                                            )
                                                        )
                                                    }
                                                />
                                            )}

                                            <p className="text-sm text-muted-foreground">
                                                Desconto de{' '}
                                                {formatCurrency(
                                                    Number.isNaN(
                                                        editDiscountValue
                                                    )
                                                        ? 0
                                                        : editDiscountValue
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid gap-2">
                                        <Label>Frete (R$)</Label>
                                        <Input
                                            placeholder="0,00"
                                            value={formatCurrencyFromInput(
                                                form.shippingFee
                                            )}
                                            onChange={(e) =>
                                                setField(
                                                    'shippingFee',
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ''
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                </>
                            )}
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
                                    value={form.note}
                                    onChange={(e) =>
                                        setField('note', e.target.value)
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
                                <span>Subtotal</span>
                                <span>{formatCurrency(order.subtotal)}</span>
                            </div>

                            {order.discountValue > 0 && (
                                <div className="flex justify-between text-red-500">
                                    <span>
                                        Desconto
                                        {order.discountType === 'Percentage' &&
                                            order.discount && (
                                                <span>
                                                    {' '}
                                                    ({order.discount}%)
                                                </span>
                                            )}
                                    </span>
                                    <span>
                                        -{formatCurrency(order.discountValue)}
                                    </span>
                                </div>
                            )}

                            {order.shippingFee > 0 && (
                                <div className="flex justify-between">
                                    <span>Frete</span>
                                    <span>
                                        {formatCurrency(order.shippingFee)}
                                    </span>
                                </div>
                            )}

                            <Separator />

                            <div className="flex justify-between">
                                <span className="font-semibold">Total</span>
                                <span className="font-semibold">
                                    {formatCurrency(order.total)}
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
                            {isDirectSale(order) ? (
                                <DeleteDirectSaleDialog
                                    orderId={order.id}
                                    orderNumber={order.number}
                                    onDeleted={() => router.push('/orders')}
                                    trigger={
                                        <Button
                                            variant="outline"
                                            className="text-destructive w-full"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Excluir venda
                                        </Button>
                                    }
                                />
                            ) : (
                                <OrderStatusActions
                                    orderStatus={order.status}
                                    orderId={orderId}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default OrderDetails
