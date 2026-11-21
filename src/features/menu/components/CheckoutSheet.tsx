'use client'

import { FormEvent } from 'react'
import { Clock, LoaderCircle, X } from 'lucide-react'
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/shared/components/ui/alert'
import { Button } from '@/shared/components/ui/button'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/shared/components/ui/sheet'
import { CustomerForm } from '@/features/menu/components/CustomerForm'
import { MenuPaymentPicker } from '@/features/menu/components/MenuPaymentPicker'
import { OrderSummary } from '@/features/menu/components/OrderSummary'
import { getDeliveryTimeLabel } from '@/features/menu/helpers/deliveryTime'
import {
    CartItem,
    MenuStoreAddress,
    OrderFormState,
} from '@/features/menu/types/menu.types'

type Props = {
    cart: CartItem[]
    form: OrderFormState
    isSubmitting: boolean
    onFieldChange: <K extends keyof OrderFormState>(
        field: K,
        value: OrderFormState[K]
    ) => void
    onOpenChange: (open: boolean) => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
    onWhatsappBlur: () => void
    open: boolean
    submissionError: string | null
    total: number
    validationMessage: string | null
    deliveryTimeMinutes?: number | null
    pixKey?: string | null
    storeAddress: MenuStoreAddress | null
}

export function CheckoutSheet({
    open,
    onOpenChange,
    cart,
    total,
    form,
    validationMessage,
    submissionError,
    isSubmitting,
    onFieldChange,
    onWhatsappBlur,
    onSubmit,
    deliveryTimeMinutes,
    pixKey,
    storeAddress,
}: Props) {
    const deliveryTimeLabel = getDeliveryTimeLabel(deliveryTimeMinutes)

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full overflow-y-auto border-l-menu-border bg-menu-background sm:max-w-xl">
                <SheetClose className="absolute right-4 top-4 z-50 text-menu-text hover:text-menu-primary">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Fechar</span>
                </SheetClose>
                <SheetHeader className="border-b border-menu-border bg-menu-card/60 pb-4">
                    <SheetTitle className="text-menu-text">
                        Finalizar pedido
                    </SheetTitle>
                    <SheetDescription className="text-menu-muted">
                        Preencha seus dados e confirme os itens do carrinho.
                    </SheetDescription>
                </SheetHeader>

                <form className="flex flex-1 flex-col" onSubmit={onSubmit}>
                    <div className="space-y-6 p-4">
                        <CustomerForm
                            form={form}
                            onFieldChange={onFieldChange}
                            onWhatsappBlur={onWhatsappBlur}
                            storeAddress={storeAddress}
                        />

                        <MenuPaymentPicker
                            value={form.paymentMethod}
                            onChange={(value) =>
                                onFieldChange('paymentMethod', value)
                            }
                            changeFor={form.changeFor}
                            onChangeForChange={(value) =>
                                onFieldChange('changeFor', value)
                            }
                            pixKey={pixKey}
                        />

                        <OrderSummary cart={cart} total={total} />

                        {deliveryTimeLabel ? (
                            <p className="flex items-center gap-2 text-sm text-menu-muted">
                                <Clock className="size-4" />
                                {deliveryTimeLabel}
                            </p>
                        ) : null}

                        {validationMessage ? (
                            <Alert className="border-menu-border bg-menu-primary-light text-menu-text">
                                <AlertTitle>Confira os dados</AlertTitle>
                                <AlertDescription>
                                    {validationMessage}
                                </AlertDescription>
                            </Alert>
                        ) : null}

                        {submissionError ? (
                            <Alert className="border-red-300 bg-red-50 text-red-900">
                                <AlertTitle>Não foi possível enviar</AlertTitle>
                                <AlertDescription>
                                    {submissionError}
                                </AlertDescription>
                            </Alert>
                        ) : null}
                    </div>

                    <SheetFooter className="border-t border-menu-border bg-menu-card/70">
                        <Button
                            type="submit"
                            className="h-11 w-full rounded-full bg-menu-primary text-menu-primary-foreground shadow-sm hover:bg-menu-primary/90"
                            disabled={isSubmitting || cart.length === 0}
                        >
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle className="animate-spin" />
                                    Confirmando...
                                </>
                            ) : (
                                'Confirmar pedido'
                            )}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
