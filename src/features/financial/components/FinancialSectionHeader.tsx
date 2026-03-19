'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/shared/components/ui/input'
import {
    getCurrentMonthValue,
    getMonthLabel,
} from '@/features/financial/lib/month'

type Props = {
    title: string
    description?: string
}

export function FinancialSectionHeader({ title, description }: Props) {
    const searchParams = useSearchParams()
    const router = useRouter()

    const month = searchParams.get('month') ?? getCurrentMonthValue()

    const onMonthChange = (nextMonth: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('month', nextMonth)

        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="text-sm text-muted-foreground">
                    {description ?? `Visualização de ${getMonthLabel(month)}.`}
                </p>
            </div>

            <div className="w-44">
                <Input
                    type="month"
                    value={month}
                    onChange={(event) => onMonthChange(event.target.value)}
                />
            </div>
        </div>
    )
}
