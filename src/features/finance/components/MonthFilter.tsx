'use client'

import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'

type Props = {
    value: string
    onChange: (value: string) => void
    label?: string
}

export function MonthFilter({ value, onChange, label = 'Mês' }: Props) {
    return (
        <div className="grid gap-2">
            <Label htmlFor="finance-month">{label}</Label>
            <Input
                id="finance-month"
                type="month"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-[220px]"
            />
        </div>
    )
}
