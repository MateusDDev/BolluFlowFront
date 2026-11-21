'use client'

import { FormEvent, useMemo, useState } from 'react'
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/shared/components/ui/alert'
import { Card, CardHeader } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'
import {
    formatCurrency,
    formatWhatsapp,
    parseCurrencyInput,
} from '@/shared/helpers/formatHelper'
import { CartSummary } from '@/features/menu/components/CartSummary'
import { MenuHeader } from '@/features/menu/components/MenuHeader'
import { OrderConfirmation } from '@/features/menu/components/OrderConfirmation'
import { ProductList } from '@/features/menu/components/ProductList'
import { initialOrderFormState } from '@/features/menu/constants/menu.constants'
import { useCart } from '@/features/menu/hooks/useCart'
import { useCreateMenuOrder } from '@/features/menu/hooks/useCreateMenuOrder'
import { useCustomerLookup } from '@/features/menu/hooks/useCustomerLookup'
import { useMenuData } from '@/features/menu/hooks/useMenuData'
import {
    CreatePublicOrderDataType,
    OrderFormState,
    CompletedMenuOrder,
} from '@/features/menu/types/menu.types'
import { buildMenuOrderMessage } from '@/features/menu/helpers/menuOrderMessage'
import { formatAddress } from '@/shared/helpers/addressHelper'
import { buildWhatsappUrl } from '@/shared/helpers/whatsappHelper'
import { CheckoutSheet } from '@/features/menu/components/CheckoutSheet'

type Props = {
    slug: string
}

function MenuLoadingState() {
    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
            <Card>
                <CardHeader className="items-center text-center">
                    <Skeleton className="h-8 w-52" />
                    <Skeleton className="h-5 w-40" />
                </CardHeader>
            </Card>
        </div>
    )
}

export function MenuPageContainer({ slug }: Props) {
    const { menu, products, isLoading, notFound, hasError } = useMenuData(slug)
    const { mutateAsync: createOrder, isPending: isSubmitting } =
        useCreateMenuOrder(slug)

    const { cart, total, totalItems, addProduct, removeProduct, clearCart } =
        useCart()

    const { lookupCustomer, saveCustomer } = useCustomerLookup(slug)

    const [checkoutOpen, setCheckoutOpen] = useState(false)
    const [form, setForm] = useState<OrderFormState>(initialOrderFormState)
    const [validationMessage, setValidationMessage] = useState<string | null>(
        null
    )
    const [submissionError, setSubmissionError] = useState<string | null>(null)
    const [createdOrder, setCreatedOrder] = useState<CompletedMenuOrder | null>(
        null
    )

    const quantities = useMemo(
        () =>
            cart.reduce<Record<number, number>>((acc, item) => {
                acc[item.productId] = item.quantity
                return acc
            }, {}),
        [cart]
    )

    const whatsappDigits = useMemo(
        () => form.customerWhatsapp.replace(/\D/g, ''),
        [form.customerWhatsapp]
    )

    // 🔥 lookup simples
    const handleWhatsappBlur = async () => {
        const storedCustomer = await lookupCustomer(whatsappDigits)

        if (!storedCustomer) return

        setForm((current) => ({
            ...current,
            customerName: storedCustomer.name,
            customerWhatsapp: formatWhatsapp(storedCustomer.whatsapp),
            customerStreet: storedCustomer.street || current.customerStreet,
            customerNumber: storedCustomer.number
                ? String(storedCustomer.number)
                : current.customerNumber,
            customerNeighborhood:
                storedCustomer.neighborhood || current.customerNeighborhood,
            customerComplement:
                storedCustomer.complement ?? current.customerComplement,
        }))
    }

    const handleFieldChange = <K extends keyof OrderFormState>(
        field: K,
        value: OrderFormState[K]
    ) => {
        setValidationMessage(null)
        setSubmissionError(null)

        if (field === 'customerWhatsapp') {
            setForm((current) => ({
                ...current,
                customerWhatsapp: formatWhatsapp(String(value)),
            }))
            return
        }

        setForm((current) => ({ ...current, [field]: value }))
    }

    const handleCheckout = () => {
        setValidationMessage(null)
        setSubmissionError(null)
        setCheckoutOpen(true)
    }

    const changeFor =
        form.paymentMethod === 'Cash'
            ? parseCurrencyInput(form.changeFor)
            : undefined

    const storeAddress = menu?.storeAddress ?? null
    const isPickup = form.isPickup && storeAddress !== null

    const validateForm = () => {
        if (cart.length === 0) return 'Adicione pelo menos um produto.'
        if (whatsappDigits.length < 10) return 'WhatsApp inválido.'
        if (!form.customerName.trim()) return 'Informe seu nome.'
        if (!isPickup) {
            if (!form.customerStreet.trim()) return 'Informe a rua.'
            if (!form.customerNumber.trim()) return 'Informe o número.'
            if (!form.customerNeighborhood.trim()) return 'Informe o bairro.'
        }
        if (!form.paymentMethod) return 'Escolha a forma de pagamento.'
        if (changeFor !== undefined && changeFor < total)
            return 'O troco deve ser para um valor maior ou igual ao total.'
        return null
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const errorMessage = validateForm()
        if (errorMessage || !form.paymentMethod) {
            setValidationMessage(errorMessage ?? 'Confira os dados.')
            return
        }

        const payload: CreatePublicOrderDataType = {
            customerName: form.customerName.trim(),
            customerWhatsapp: whatsappDigits,
            ...(isPickup
                ? {}
                : {
                      customerStreet: form.customerStreet.trim(),
                      customerNumber: form.customerNumber.trim(),
                      customerNeighborhood: form.customerNeighborhood.trim(),
                      customerComplement:
                          form.customerComplement.trim() || undefined,
                  }),
            isPickup,
            note: form.note.trim() || undefined,
            paymentMethod: form.paymentMethod,
            changeFor,
            items: cart.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
        }

        try {
            const order = await createOrder(payload)

            // salva localmente
            if (!isPickup) {
                saveCustomer({
                    name: payload.customerName,
                    whatsapp: payload.customerWhatsapp,
                    street: payload.customerStreet ?? '',
                    number:
                        Number.parseInt(payload.customerNumber ?? '', 10) || 0,
                    neighborhood: payload.customerNeighborhood ?? '',
                    complement: payload.customerComplement,
                })
            }

            const storeWhatsapp = menu?.whatsapp?.trim()
            const whatsappUrl = storeWhatsapp
                ? buildWhatsappUrl(
                      storeWhatsapp,
                      buildMenuOrderMessage({
                          storeName: menu?.name ?? '',
                          orderNumber: order.orderNumber,
                          customerName: payload.customerName,
                          items: cart,
                          total,
                          paymentMethod: payload.paymentMethod,
                          changeFor: payload.changeFor,
                          address: isPickup
                              ? null
                              : formatAddress({
                                    street: payload.customerStreet ?? '',
                                    number: payload.customerNumber ?? '',
                                    neighborhood:
                                        payload.customerNeighborhood ?? '',
                                    complement: payload.customerComplement,
                                }),
                          note: payload.note,
                      })
                  )
                : null

            setCreatedOrder({
                orderNumber: order.orderNumber,
                paymentMethod: payload.paymentMethod,
                isPickup,
                whatsappUrl,
            })
            setCheckoutOpen(false)
            clearCart()
            setForm(initialOrderFormState)
        } catch {
            setSubmissionError('Erro ao finalizar pedido.')
        }
    }

    if (createdOrder) {
        return (
            <OrderConfirmation
                order={createdOrder}
                pixKey={menu?.pixKey}
                storeAddress={menu?.storeAddress ?? null}
                onBack={() => setCreatedOrder(null)}
            />
        )
    }

    if (isLoading) return <MenuLoadingState />

    if (notFound) {
        return <div>Cardápio não encontrado</div>
    }

    if (hasError) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>
                    Não foi possível carregar o cardápio
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <>
            <div className="mx-auto w-full max-w-6xl overflow-x-hidden px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <section className="space-y-8">
                        <MenuHeader
                            title={menu?.name ?? 'Cardápio'}
                            deliveryTimeMinutes={menu?.deliveryTimeMinutes}
                        />

                        <ProductList
                            products={products}
                            quantities={quantities}
                            onIncrease={addProduct}
                            onDecrease={removeProduct}
                        />
                    </section>

                    <aside className="hidden lg:block">
                        <CartSummary
                            cart={cart}
                            total={total}
                            totalItems={totalItems}
                            onIncrease={(item) =>
                                addProduct({
                                    id: item.productId,
                                    name: item.productName,
                                    description: null,
                                    finalPrice: item.unitPrice,
                                    imageUrl: null,
                                    isAvailable: true,
                                })
                            }
                            onDecrease={(item) => removeProduct(item.productId)}
                            onCheckout={handleCheckout}
                            className="sticky top-6"
                        />
                    </aside>
                </div>
            </div>
            <CheckoutSheet
                open={checkoutOpen}
                onOpenChange={setCheckoutOpen}
                cart={cart}
                total={total}
                form={form}
                validationMessage={validationMessage}
                submissionError={submissionError}
                isSubmitting={isSubmitting}
                onFieldChange={handleFieldChange}
                onWhatsappBlur={handleWhatsappBlur}
                onSubmit={handleSubmit}
                pixKey={menu?.pixKey}
                storeAddress={storeAddress}
                deliveryTimeMinutes={menu?.deliveryTimeMinutes}
            />
            {cart.length > 0 ? (
                <>
                    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-menu-border bg-menu-card/95 p-4 backdrop-blur lg:hidden">
                        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-menu-muted">
                                    {totalItems}{' '}
                                    {totalItems === 1 ? 'item' : 'itens'}
                                </p>
                                <p className="text-lg font-semibold text-menu-text">
                                    {formatCurrency(total)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleCheckout}
                                className="inline-flex h-10 items-center justify-center rounded-full bg-menu-primary px-6 text-sm font-medium text-menu-primary-foreground"
                            >
                                Ver carrinho
                            </button>
                        </div>
                    </div>

                    <div className="h-24 lg:hidden" />
                </>
            ) : null}
        </>
    )
}
