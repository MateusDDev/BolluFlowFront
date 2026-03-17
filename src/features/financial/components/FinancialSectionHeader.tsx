'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Input } from '@/shared/components/ui/input'
import { getCurrentMonthValue } from '@/features/financial/lib/month'

const tabs = [
    { label: 'Resumo', href: '/financial/resumo' },
    { label: 'Lançamentos', href: '/financial/lancamentos' },
    { label: 'Contas fixas', href: '/financial/contas-fixas' },
]

export function FinancialSectionHeader() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    const month = searchParams.get('month') ?? getCurrentMonthValue()

    const onMonthChange = (nextMonth: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('month', nextMonth)

        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <h2 className="text-lg font-semibold">Financeiro</h2>
                <div className="w-44">
                    <Input
                        type="month"
                        value={month}
                        onChange={(event) => onMonthChange(event.target.value)}
                    />
                </div>
            </div>

            <Tabs value={pathname}>
                <TabsList>
                    {tabs.map((tab) => (
                        <TabsTrigger key={tab.href} value={tab.href} asChild>
                            <Link href={`${tab.href}?month=${month}`}>
                                {tab.label}
                            </Link>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    )
}
