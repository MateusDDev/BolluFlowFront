import './globals.css';
import { Inter } from 'next/font/google';
import NavBar from "@/shared/components/NavBar";
import {ThemeProvider} from "@/shared/components/providers/ThemeProvider";
import {SidebarInset, SidebarProvider} from "@/shared/components/ui/sidebar";
import {cookies} from "next/headers";
import AppSidebar from "components/AppSidebar";
import {ReactQueryProvider} from "@/shared/api/provider";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BolluFlow',
  description: 'Sistema de gestão para docerias',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body className={`${inter.className} flex`}>
                <ReactQueryProvider>
                    <ThemeProvider>
                        <SidebarProvider defaultOpen={defaultOpen}>
                            <AppSidebar/>
                            <SidebarInset>
                                <NavBar />
                                <main className="w-full px-4">{children}</main>
                            </SidebarInset>
                        </SidebarProvider>
                    </ThemeProvider>
                </ReactQueryProvider>
          </body>
        </html>
    );
}
