import { ReactNode } from 'react'
import { FinancialSectionHeader } from '@/features/financial/components/FinancialSectionHeader'

export default function FinancialLayout({ children }: { children: ReactNode }) {
    return (
        <div className="p-4 md:p-8 space-y-4">
            <FinancialSectionHeader />
            {children}
        </div>
    )
}
