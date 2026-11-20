'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle2 } from 'lucide-react'
import { Button } from 'ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'ui/card'
import { Label } from 'ui/label'
import { Textarea } from 'ui/textarea'
import { DatePicker } from 'components/DatePicker'
import { usePageTitle } from 'components/providers/PageTitleProvider'
import { SearchableSelect } from 'components/SearchableSelect'
import { ChipGroup, ChipOption } from 'components/ChipGroup'
import { formatCurrency } from '@/shared/helpers/formatHelper'
import { useModules } from '@/shared/modules/useModules'
import { useGetProducts } from '@/features/products/list/hooks/queries/useGetProducts'
import { useGetOrderCustomers } from '@/features/orders/list/hooks/queries/useGetOrderCustomers'
import { useCreateOrder } from '@/features/orders/list/hooks/mutations/useCreateOrder'
import { PaymentMethod } from '@/features/orders/services/order.model'
import { getInsufficientProducts } from '@/features/orders/services/insufficientStock'
import { ProductPicker } from '@/features/orders/new/components/ProductPicker'
import { QuickCustomerDialog } from '@/features/orders/new/components/QuickCustomerDialog'

export type OrderFormMode = 'quick' | 'order'

type DeliveryChoice = 'none' | 'today' | 'tomorrow' | 'custom'

const MODE_OPTIONS: ChipOption<OrderFormMode>[] = [
    { value: 'quick', label: 'Venda rápida' },
    { value: 'order', label: 'Encomenda' },
]

const PAYMENT_OPTIONS: ChipOption<PaymentMethod>[] = [
    { value: 'Pix', label: 'Pix' },
    { value: 'Cash', label: 'Dinheiro' },
    { value: 'CreditCard', label: 'Crédito' },
    { value: 'DebitCard', label: 'Débito' },
]

const DELIVERY_OPTIONS: ChipOption<DeliveryChoice>[] = [
    { value: 'none', label: 'Sem data' },
    { value: 'today', label: 'Hoje' },
    { value: 'tomorrow', label: 'Amanhã' },
    { value: 'custom', label: 'Outra data' },
]

function middayInDays(days: number) {
    const date = new Date()
    date.setDate(date.getDate() + days)
    date.setHours(12, 0, 0, 0)
    return date
}

type Props = {
    initialMode: OrderFormMode
}

export function OrderFormContainer({ initialMode }: Props) {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { setTitle } = usePageTitle()
    const { hasModule } = useModules()

    const { data: products, isLoading: isLoadingProducts } = useGetProducts()
    const { data: customers, isLoading: isLoadingCustomers } =
        useGetOrderCustomers()
    const { mutateAsync: createOrder, isPending } = useCreateOrder()

    const [mode, setMode] = useState<OrderFormMode>(initialMode)
    const [quantities, setQuantities] = useState<Record<number, number>>({})
    const [customerId, setCustomerId] = useState('')
    const [payment, setPayment] = useState<PaymentMethod | null>(null)
    const [delivery, setDelivery] = useState<DeliveryChoice>('none')
    const [customDate, setCustomDate] = useState<Date>()
    const [note, setNote] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [lastSale, setLastSale] = useState<string | null>(null)

    const isQuick = mode === 'quick'

    useEffect(() => {
        setTitle(isQuick ? 'Venda rápida' : 'Nova encomenda')
        return () => setTitle(null)
    }, [isQuick, setTitle])

    const activeProducts = useMemo(
        () => (products ?? []).filter((product) => product.isActive),
        [products]
    )

    const selectedItems = useMemo(
        () =>
            activeProducts
                .filter((product) => (quantities[product.id] ?? 0) > 0)
                .map((product) => ({
                    product,
                    quantity: quantities[product.id],
                })),
        [activeProducts, quantities]
    )

    const total = selectedItems.reduce(
        (sum, item) => sum + item.product.finalPrice * item.quantity,
        0
    )

    const deliveryDate =
        delivery === 'today'
            ? middayInDays(0)
            : delivery === 'tomorrow'
              ? middayInDays(1)
              : delivery === 'custom'
                ? customDate
                : undefined

    const canSubmit =
        !isPending &&
        (isQuick
            ? selectedItems.length > 0
            : selectedItems.length > 0 || !!customerId)

    const handleQuantityChange = (productId: number, quantity: number) => {
        setLastSale(null)
        setError(null)
        setQuantities((current) => ({
            ...current,
            [productId]: Math.max(0, quantity),
        }))
    }

    const resetForm = () => {
        setQuantities({})
        setCustomerId('')
        setPayment(null)
        setDelivery('none')
        setCustomDate(undefined)
        setNote('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        try {
            const order = await createOrder({
                customerId: customerId ? Number(customerId) : null,
                items: selectedItems.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                })),
                deliverNow: isQuick,
                paymentMethod: payment,
                note: note.trim() || undefined,
                deliveryDate: isQuick ? undefined : deliveryDate,
            })

            if (!isQuick) {
                router.push(`/orders/${order.id}`)
                return
            }

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['products'] }),
                queryClient.invalidateQueries({ queryKey: ['finance'] }),
                queryClient.invalidateQueries({ queryKey: ['onboarding'] }),
            ])

            setLastSale(
                `Venda #${order.number} registrada · ${formatCurrency(order.total)}`
            )
            resetForm()
        } catch (err) {
            const insufficient = getInsufficientProducts(err)

            if (insufficient) {
                setError(
                    `Estoque insuficiente: ${insufficient
                        .map(
                            (item) =>
                                `${item.productName} (tem ${item.available}, precisa de ${item.required})`
                        )
                        .join(', ')}`
                )
                return
            }

            setError(
                err instanceof Error
                    ? err.message
                    : 'Não foi possível salvar. Tente novamente.'
            )
        }
    }

    if (isLoadingProducts) {
        return <p className="py-10">Carregando produtos...</p>
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="container mx-auto grid gap-6 py-6 lg:grid-cols-5"
        >
            <div className="space-y-4 lg:col-span-3">
                <ChipGroup
                    ariaLabel="Tipo de registro"
                    options={MODE_OPTIONS}
                    value={mode}
                    onChange={(value) => value && setMode(value)}
                />
                <p className="text-muted-foreground text-sm">
                    {isQuick
                        ? 'O produto sai na hora: a venda já fica como entregue, com baixa de estoque e entrada no financeiro.'
                        : 'Para pedidos com preparo ou entrega depois. Você acompanha o status até a entrega.'}
                </p>

                <ProductPicker
                    products={activeProducts}
                    quantities={quantities}
                    onQuantityChange={handleQuantityChange}
                    showStock={hasModule('stock')}
                />
            </div>

            <div className="lg:col-span-2">
                <Card className="lg:sticky lg:top-4">
                    <CardHeader>
                        <CardTitle>
                            {isQuick ? 'Resumo da venda' : 'Resumo do pedido'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid gap-2">
                            <Label>
                                Cliente{' '}
                                <span className="text-muted-foreground font-normal">
                                    (opcional)
                                </span>
                            </Label>
                            <div className="flex gap-2">
                                <SearchableSelect
                                    options={[
                                        { value: '', label: 'Sem cliente' },
                                        ...(customers ?? []).map(
                                            (customer) => ({
                                                value: customer.id.toString(),
                                                label: customer.name,
                                            })
                                        ),
                                    ]}
                                    value={customerId}
                                    onValueChange={setCustomerId}
                                    disabled={isLoadingCustomers}
                                    placeholder="Sem cliente"
                                    searchPlaceholder="Buscar cliente..."
                                    emptyMessage="Nenhum cliente encontrado."
                                />
                                <QuickCustomerDialog
                                    onCreated={(id) =>
                                        setCustomerId(id.toString())
                                    }
                                />
                            </div>
                        </div>

                        {!isQuick && (
                            <div className="grid gap-2">
                                <Label>Entrega</Label>
                                <ChipGroup
                                    ariaLabel="Data de entrega"
                                    options={DELIVERY_OPTIONS}
                                    value={delivery}
                                    onChange={(value) =>
                                        setDelivery(value ?? 'none')
                                    }
                                />
                                {delivery === 'custom' && (
                                    <DatePicker
                                        date={customDate}
                                        setDateAction={setCustomDate}
                                        label="Escolha a data"
                                    />
                                )}
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label>Pagamento</Label>
                            <ChipGroup
                                ariaLabel="Forma de pagamento"
                                options={PAYMENT_OPTIONS}
                                value={payment}
                                onChange={setPayment}
                                allowDeselect
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="order-note">Observações</Label>
                            <Textarea
                                id="order-note"
                                rows={2}
                                placeholder={
                                    isQuick
                                        ? 'Opcional'
                                        : 'Ex.: sem lactose, escrever "Parabéns, Ana"'
                                }
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2 border-t pt-4">
                            {selectedItems.length === 0 ? (
                                <p className="text-muted-foreground text-sm">
                                    Toque nos produtos para adicionar.
                                </p>
                            ) : (
                                <ul className="space-y-1 text-sm">
                                    {selectedItems.map(
                                        ({ product, quantity }) => (
                                            <li
                                                key={product.id}
                                                className="flex justify-between gap-2"
                                            >
                                                <span className="truncate">
                                                    {quantity}× {product.name}
                                                </span>
                                                <span className="tabular-nums">
                                                    {formatCurrency(
                                                        product.finalPrice *
                                                            quantity
                                                    )}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            )}

                            <div className="flex items-baseline justify-between pt-2">
                                <span className="font-medium">Total</span>
                                <span className="text-2xl font-bold tabular-nums">
                                    {formatCurrency(total)}
                                </span>
                            </div>
                        </div>

                        {error && (
                            <p className="text-destructive text-sm">{error}</p>
                        )}

                        {lastSale && (
                            <p className="flex items-center gap-2 text-sm text-emerald-600">
                                <CheckCircle2 className="h-4 w-4" />
                                {lastSale}
                            </p>
                        )}

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                            disabled={!canSubmit}
                        >
                            {isPending
                                ? 'Salvando...'
                                : isQuick
                                  ? 'Registrar venda'
                                  : 'Criar pedido'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </form>
    )
}
