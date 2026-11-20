'use client'

import Link from 'next/link'
import { Button } from 'ui/button'
import { Card, CardContent } from 'ui/card'
import { GettingStartedChecklist } from '@/features/onboarding/components/GettingStartedChecklist'
import { FirstProductCard } from '@/features/onboarding/components/FirstProductCard'
import { useModules } from '@/shared/modules/useModules'
import { ModuleGate } from '@/shared/modules/ModuleGate'
import { TodaySection } from '@/features/dashboard/components/TodaySection'
import { SalesSection } from '@/features/dashboard/components/SalesSection'
import { StockAlertsCard } from '@/features/dashboard/components/StockAlertsCard'
import { ProductMarginsCard } from '@/features/dashboard/components/ProductMarginsCard'

export default function DashboardContainer() {
    const { hasAnyModule } = useModules()

    return (
        <section className="space-y-6 py-6">
            <FirstProductCard />
            <GettingStartedChecklist />

            <ModuleGate module="orders">
                <TodaySection />
                <SalesSection />
            </ModuleGate>

            <div className="grid gap-4 lg:grid-cols-2">
                <ModuleGate module="stock">
                    <StockAlertsCard />
                </ModuleGate>
                <ModuleGate module="recipes">
                    <ProductMarginsCard />
                </ModuleGate>
            </div>

            {!hasAnyModule(['orders', 'stock', 'recipes']) && (
                <Card>
                    <CardContent className="flex flex-wrap items-center justify-between gap-3 py-6">
                        <p className="text-muted-foreground text-sm">
                            Ligue Pedidos, Receitas ou Estoque para ver um
                            resumo do seu negócio aqui.
                        </p>
                        <Button asChild variant="outline">
                            <Link href="/configuracoes">Configurações</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </section>
    )
}
