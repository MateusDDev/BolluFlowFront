'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/tabs'
import { BackButton } from 'components/BackButton'
import { OrderItemsTable } from '@/features/orders/details/components/organisms/OrderItemsTable'
import OrderDetails from '@/features/orders/details/components/organisms/OrderDetails'

export function OrderTabs() {
    return (
        <section>
            <Tabs defaultValue="details">
                <div className="flex justify-between items-center">
                    <TabsList>
                        <TabsTrigger value="details">Detalhes</TabsTrigger>
                        <TabsTrigger value="items">Itens do pedido</TabsTrigger>
                    </TabsList>
                    <BackButton className="[&_svg]:size-6" />
                </div>
                <TabsContent value="details">
                    <OrderDetails />
                </TabsContent>
                <TabsContent value="items">
                    <OrderItemsTable />
                </TabsContent>
            </Tabs>
        </section>
    )
}
