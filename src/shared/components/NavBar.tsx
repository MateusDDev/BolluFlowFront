"use client"

import {LogOut, Moon, Settings, Sun, User} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/shared/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {Button} from "@/shared/components/ui/button";
import {useTheme} from "next-themes";
import {SidebarTrigger} from "ui/sidebar";
import {usePathname} from "next/navigation";
import {navItems} from "@/shared/navigation/items";

const NavBar = () => {
    const { setTheme } = useTheme()
    const pathname = usePathname();

    const pageName = navItems.find(item => item.url === pathname)?.title;

    return (
        <nav className="flex items-center justify-between p-4">
            <SidebarTrigger className="text-primary" />

            <h1>{pageName}</h1>

            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Claro
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Escuro
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            Sistema
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={8}>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User/>
                            Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings/>
                            Configurações
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400">
                            <LogOut/>
                            Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}

export default NavBar;