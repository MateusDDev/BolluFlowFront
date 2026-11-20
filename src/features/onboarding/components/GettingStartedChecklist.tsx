'use client'

import Link from 'next/link'
import { CheckCircle2, Circle } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from 'ui/card'
import { useGetOnboardingProgress } from '@/features/onboarding/hooks/queries/useGetOnboardingProgress'
import { OnboardingProgressModel } from '@/features/onboarding/services/onboarding.model'
import { AppModule } from '@/shared/modules/modules'
import { useModules } from '@/shared/modules/useModules'

type ChecklistItem = {
    key: keyof OnboardingProgressModel
    title: string
    href: string
    module?: AppModule
}

const CHECKLIST: ChecklistItem[] = [
    {
        key: 'hasProduct',
        title: 'Cadastre seu primeiro produto',
        href: '/products',
    },
    {
        key: 'hasPricedProduct',
        title: 'Defina o preço de venda',
        href: '/products',
    },
    {
        key: 'hasRecipe',
        title: 'Crie uma receita',
        href: '/recipes',
        module: 'recipes',
    },
    {
        key: 'hasProductComponent',
        title: 'Monte a ficha técnica de um produto',
        href: '/products',
        module: 'recipes',
    },
    {
        key: 'hasTrackedStock',
        title: 'Registre a primeira entrada de estoque',
        href: '/ingredients',
        module: 'stock',
    },
    {
        key: 'hasCustomer',
        title: 'Cadastre um cliente',
        href: '/customers',
        module: 'orders',
    },
    {
        key: 'hasOrder',
        title: 'Crie seu primeiro pedido',
        href: '/orders',
        module: 'orders',
    },
    {
        key: 'hasMenuLink',
        title: 'Publique o cardápio online',
        href: '/configuracoes',
        module: 'orders',
    },
    {
        key: 'hasFinancialEntry',
        title: 'Veja o primeiro lançamento no financeiro',
        href: '/financeiro',
        module: 'finance',
    },
]

export function GettingStartedChecklist() {
    const { data: progress } = useGetOnboardingProgress()
    const { hasModule } = useModules()

    if (!progress) return null

    const items = CHECKLIST.filter(
        (item) => !item.module || hasModule(item.module)
    )
    const doneCount = items.filter((item) => progress[item.key]).length

    if (doneCount === items.length) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle>Primeiros passos</CardTitle>
                <CardDescription>
                    {doneCount} de {items.length} concluídos. Os itens se marcam
                    sozinhos conforme você usa o sistema.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => {
                    const done = progress[item.key]
                    const Icon = done ? CheckCircle2 : Circle

                    return (
                        <Link
                            key={item.key}
                            href={item.href}
                            className={`flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${done ? 'text-muted-foreground line-through' : 'hover:border-primary'}`}
                        >
                            <Icon
                                className={`h-4 w-4 shrink-0 ${done ? 'text-emerald-600' : 'text-muted-foreground'}`}
                            />
                            {item.title}
                        </Link>
                    )
                })}
            </CardContent>
        </Card>
    )
}
