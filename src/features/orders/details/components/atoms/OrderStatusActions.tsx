import { UseMutationResult } from '@tanstack/react-query'

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

import { OrderStatus } from '@/features/orders/services/order.model'
import { Button } from 'ui/button'
import { useOrderAction } from '@/features/orders/details/hooks/mutations/useOrderAction'
import {
    cancelOrder,
    deliverOrder,
    finishProductionOrder,
    openOrderReport,
    reopenOrder,
    startProductionOrder,
} from '@/features/orders/services/order.api'
import { useState } from 'react'
import { AlertCircleIcon, FileText } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from 'ui/alert'
import { useCreateFinancialEntry } from '@/features/finance/hooks/mutations/useCreateFinancialEntry'

export function OrderStatusActions({
    orderStatus,
    orderId,
    orderTotal,
}: {
    orderStatus: OrderStatus
    orderId: number
    orderTotal: number
}) {
    const { mutateAsync: createFinancialEntry } = useCreateFinancialEntry()

    const startAction = useOrderAction({ action: startProductionOrder })
    const finishAction = useOrderAction({ action: finishProductionOrder })
    const deliverAction = useOrderAction({
        action: deliverOrder,
        onSuccess: async (deliveredOrderId) => {
            await createFinancialEntry({
                tipo: 'saida',
                valor: orderTotal,
                descricao: `Saída automática do pedido #${deliveredOrderId}`,
                origem: 'pedido',
                origem_id: deliveredOrderId,
            })
        },
    })
    const cancelAction = useOrderAction({ action: cancelOrder })
    const reopenAction = useOrderAction({ action: reopenOrder })

    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const isLoading =
        startAction.isPending ||
        finishAction.isPending ||
        deliverAction.isPending ||
        cancelAction.isPending ||
        reopenAction.isPending

    function handleOrderAction(action: OrderAction) {
        setErrorMessage(null)

        const mutationMap: Record<
            OrderAction,
            UseMutationResult<unknown, Error, number>
        > = {
            startProduction: startAction,
            finishProduction: finishAction,
            deliver: deliverAction,
            cancel: cancelAction,
            reopen: reopenAction,
        }

        mutationMap[action].mutate(orderId, {
            onError: (error: Error) => {
                setErrorMessage(error.message)
            },
        })
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
            </div>
        </div>
    )
}
