import { OrderFormContainer } from '@/features/orders/new/containers/OrderFormContainer'

type Props = {
    searchParams: Promise<{ mode?: string }>
}

export default async function NewOrderPage({ searchParams }: Props) {
    const { mode } = await searchParams

    return (
        <OrderFormContainer
            initialMode={mode === 'order' ? 'order' : 'quick'}
        />
    )
}
