'use client'

import { FormEvent } from 'react'
import { LoaderCircle } from 'lucide-react'
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/shared/components/ui/alert'
import { Button } from '@/shared/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/shared/components/ui/sheet'
import { CustomerForm } from '@/features/menu/components/CustomerForm'
import { OrderSummary } from '@/features/menu/components/OrderSummary'
import { CartItem, OrderFormState } from '@/features/menu/types/menu.types'

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
}: Props) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full overflow-y-auto border-l-menu-border bg-menu-background sm:max-w-xl">
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
                        />

                        <OrderSummary cart={cart} total={total} />

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
