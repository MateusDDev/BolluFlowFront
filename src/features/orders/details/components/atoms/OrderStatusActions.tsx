import {
    UseMutationResult,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import { useState } from 'react'
import { AlertCircleIcon, FileText } from 'lucide-react'
import { Button } from 'ui/button'
import { Alert, AlertDescription, AlertTitle } from 'ui/alert'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from 'ui/alert-dialog'
import { Checkbox } from 'ui/checkbox'
import { Label } from 'ui/label'
import { OrderStatus } from '@/features/orders/services/order.model'
import { useOrderAction } from '@/features/orders/details/hooks/mutations/useOrderAction'
import {
    cancelOrder,
    deliverOrder,
    finishProductionOrder,
    openCustomerOrderReport,
    openOrderReport,
    reopenOrder,
    startProductionOrder,
} from '@/features/orders/services/order.api'

type OrderAction =
    | 'startProduction'
    | 'finishProduction'
    | 'deliver'
    | 'cancel'
    | 'reopen'

type OrderButton =
    | { type: 'action'; action: OrderAction }
    | { type: 'label'; label: string }

interface OrderStatusTransition {
    primary?: OrderButton
    secondary?: OrderButton[]
}

type InsufficientProductStockItem = {
    productId?: number
    productName: string
    required: number
    available: number
}

type OrderStockErrorModel = {
    code: string
    message: string
    insufficientProducts?: InsufficientProductStockItem[]
}

export const orderStatusTransitions: Record<
    OrderStatus,
    OrderStatusTransition
> = {
    Pending: {
        primary: { type: 'action', action: 'startProduction' },
        secondary: [{ type: 'action', action: 'cancel' }],
    },

    InProduction: {
        primary: { type: 'action', action: 'finishProduction' },
        secondary: [{ type: 'action', action: 'cancel' }],
    },

    Ready: {
        primary: { type: 'action', action: 'deliver' },
        secondary: [{ type: 'action', action: 'cancel' }],
    },

    Delivered: {
        primary: { type: 'label', label: 'Entregue' },
    },

    Canceled: {
        primary: { type: 'action', action: 'reopen' },
    },
}

const orderActionLabelMap: Record<OrderAction, string> = {
    startProduction: 'Iniciar produção',
    finishProduction: 'Finalizar produção',
    deliver: 'Marcar como entregue',
    cancel: 'Cancelar pedido',
    reopen: 'Reabrir pedido',
}

export function OrderStatusActions({
    orderStatus,
    orderId,
}: {
    orderStatus: OrderStatus
    orderId: number
}) {
    const queryClient = useQueryClient()

    const startAction = useOrderAction(startProductionOrder)
    const finishAction = useOrderAction(finishProductionOrder)
    const deliverAction = useOrderAction(deliverOrder)
    const reopenAction = useOrderAction(reopenOrder)

    const cancelAction = useMutation({
        mutationFn: ({
            id,
            revertStock,
        }: {
            id: number
            revertStock?: boolean
        }) => cancelOrder(id, revertStock),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ['orders'] })
            await queryClient.invalidateQueries({
                queryKey: ['order', variables.id],
            })
            await queryClient.invalidateQueries({
                queryKey: ['orders', variables.id],
            })

            if (variables.revertStock) {
                await queryClient.invalidateQueries({ queryKey: ['products'] })
            }
        },
    })

    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
    const [revertStock, setRevertStock] = useState(false)
    const [stockErrorOpen, setStockErrorOpen] = useState(false)
    const [stockErrorItems, setStockErrorItems] = useState<
        InsufficientProductStockItem[]
    >([])

    const isLoading =
        startAction.isPending ||
        finishAction.isPending ||
        deliverAction.isPending ||
        cancelAction.isPending ||
        reopenAction.isPending

    function handleOrderAction(action: OrderAction) {
        setErrorMessage(null)

        const mutationMap: Record<
            Exclude<OrderAction, 'cancel'>,
            UseMutationResult<unknown, Error, number>
        > = {
            startProduction: startAction,
            finishProduction: finishAction,
            deliver: deliverAction,
            reopen: reopenAction,
        }

        if (action === 'cancel') {
            setRevertStock(false)
            setCancelDialogOpen(true)
            return
        }

        mutationMap[action].mutate(orderId, {
            onSuccess: async () => {
                if (action === 'startProduction') {
                    await queryClient.invalidateQueries({
                        queryKey: ['products'],
                    })
                }
            },
            onError: (error: unknown) => {
                const apiError = error as OrderStockErrorModel

                if (
                    action === 'startProduction' &&
                    apiError.code === 'INSUFFICIENT_STOCK'
                ) {
                    setStockErrorItems(apiError.insufficientProducts ?? [])
                    setStockErrorOpen(true)
                    return
                }

                setErrorMessage(
                    apiError?.message ?? 'Não foi possível atualizar o pedido.'
                )
            },
        })
    }

    const handleConfirmCancel = () => {
        const shouldSendRevert =
            orderStatus === 'Pending' ? undefined : revertStock

        cancelAction.mutate(
            { id: orderId, revertStock: shouldSendRevert },
            {
                onSuccess: () => {
                    setCancelDialogOpen(false)
                },
                onError: (error: Error) => {
                    setCancelDialogOpen(false)
                    setErrorMessage(error.message)
                },
            }
        )
    }

    const transitions = orderStatusTransitions[orderStatus]

    return (
        <div>
            {errorMessage && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Não foi possível atualizar o pedido</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            <div className="flex flex-wrap justify-center items-center gap-2">
                {transitions.secondary?.map((button, index) => {
                    if (button.type !== 'action') return null

                    return (
                        <Button
                            key={index}
                            variant="destructive"
                            disabled={isLoading}
                            onClick={() => handleOrderAction(button.action)}
                        >
                            {orderActionLabelMap[button.action]}
                        </Button>
                    )
                })}

                {transitions.primary?.type === 'action' && (
                    <Button
                        disabled={isLoading}
                        onClick={() =>
                            handleOrderAction(
                                transitions.primary?.type === 'action'
                                    ? transitions.primary.action
                                    : 'startProduction'
                            )
                        }
                    >
                        {orderActionLabelMap[transitions.primary.action]}
                    </Button>
                )}

                {transitions.primary?.type === 'label' && (
                    <Button variant="secondary" disabled>
                        {transitions.primary.label}
                    </Button>
                )}

                <Button
                    variant="secondary"
                    onClick={() => openOrderReport(orderId)}
                >
                    <FileText className="h-4 w-4 mr-2" />
                    Gerar comanda
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => openCustomerOrderReport(orderId)}
                >
                    <FileText className="h-4 w-4 mr-2" />
                    Comanda do cliente
                </Button>
            </div>

            <AlertDialog open={stockErrorOpen} onOpenChange={setStockErrorOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Estoque insuficiente
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-3 text-sm text-muted-foreground">
                                <p>
                                    Não há estoque suficiente para iniciar a
                                    produção:
                                </p>
                                <ul className="list-disc pl-5 space-y-1">
                                    {stockErrorItems.map((item, index) => (
                                        <li
                                            key={`${item.productName}-${index}`}
                                        >
                                            {item.productName} — necessário:{' '}
                                            {item.required.toLocaleString(
                                                'pt-BR'
                                            )}
                                            , disponível:{' '}
                                            {item.available.toLocaleString(
                                                'pt-BR'
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                <p>
                                    Registre a produção dos produtos antes de
                                    iniciar.
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction>Fechar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={cancelDialogOpen}
                onOpenChange={setCancelDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancelar pedido</AlertDialogTitle>
                        {orderStatus === 'Pending' ? (
                            <AlertDialogDescription>
                                Tem certeza que deseja cancelar este pedido?
                            </AlertDialogDescription>
                        ) : (
                            <AlertDialogDescription asChild>
                                <div className="space-y-4 text-sm text-muted-foreground">
                                    <p>
                                        Este pedido já teve a produção iniciada
                                        e consumiu estoque dos produtos.
                                    </p>
                                    <div className="flex items-start gap-3">
                                        <Checkbox
                                            id="revert-stock"
                                            checked={revertStock}
                                            onCheckedChange={(checked) =>
                                                setRevertStock(checked === true)
                                            }
                                        />
                                        <Label
                                            htmlFor="revert-stock"
                                            className="leading-5"
                                        >
                                            Reverter estoque dos produtos
                                            <span className="block text-muted-foreground text-xs">
                                                (devolve as unidades consumidas
                                                ao iniciar produção)
                                            </span>
                                        </Label>
                                    </div>
                                </div>
                            </AlertDialogDescription>
                        )}
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleConfirmCancel()
                            }}
                        >
                            Confirmar cancelamento
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
