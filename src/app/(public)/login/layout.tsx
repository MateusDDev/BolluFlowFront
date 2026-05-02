import '../../globals.css'

import ThemeButton from 'components/ThemeButton'
import { PublicAuthWrapper } from '@/features/login/components/PublicAuthWrapper'

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <PublicAuthWrapper>
            <main className="w-full">
                <div className="absolute top-5 left-5">
                    <ThemeButton />
                </div>
                {children}
            </main>
        </PublicAuthWrapper>
    )
}
