import '../../../globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Cardápio',
}

export default function MenuLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="min-h-screen bg-menu-background text-menu-text antialiased">
            {children}
        </main>
    )
}
