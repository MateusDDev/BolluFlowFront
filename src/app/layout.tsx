import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/shared/components/providers/ThemeProvider'
import { ReactQueryProvider } from '@/shared/api/provider'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'BolluFlow',
    description: 'Sistema de gestão para docerias',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body className={`${inter.className}`}>
                <ReactQueryProvider>
                    <ThemeProvider>
                        {children}
                        <Toaster
                            richColors
                            closeButton
                            position="bottom-right"
                        />
                    </ThemeProvider>
                </ReactQueryProvider>
            </body>
        </html>
    )
}
