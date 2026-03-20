'use client'

import { Input } from '@/shared/components/ui/input'
import {
    getCurrentMonthValue,
    getMonthLabel,
} from '@/features/financial/lib/month'
import { setFinancialMonthInUrl } from '@/features/financial/hooks/useFinancialMonthParam'

type Props = {
    title: string
    description?: string
}

export function FinancialSectionHeader({ title, description }: Props) {
    const month =
        typeof window === 'undefined'
            ? getCurrentMonthValue()
            : (new URLSearchParams(window.location.search).get('month') ??
              getCurrentMonthValue())

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
                    onChange={(event) =>
                        setFinancialMonthInUrl(event.target.value)
                    }
                />
            </div>
        </div>
    )
}
