import { ReactNode } from 'react'

export default function FinancialLayout({ children }: { children: ReactNode }) {
    return <div className="p-4 md:p-8">{children}</div>
}
