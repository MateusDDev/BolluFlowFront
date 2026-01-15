'use client'

import { LogOut } from 'lucide-react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/shared/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { SidebarTrigger } from 'ui/sidebar'
import { usePathname } from 'next/navigation'
import { navItems } from '@/shared/navigation/items'
import ThemeButton from 'components/ThemeButton'
import { useLogout } from '@/features/login/hooks/mutations/useLogout'
import { useMe } from '@/features/login/hooks/useMe'
import { usePageTitle } from 'components/providers/PageTitleProvider'

const NavBar = () => {
    const { mutateAsync: logout, isPending } = useLogout()
    const { data: user } = useMe()

    const { title } = usePageTitle()

    const pathname = usePathname()

    const pageName =
        title ?? navItems.find((item) => item.url === pathname)?.title

    return (
        <nav className="flex items-center justify-between p-4">
            <SidebarTrigger className="text-primary" />

            <h1>{pageName}</h1>

            <div className="flex items-center gap-4">
                <ThemeButton />

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage
                                src={user?.profileImageUrl}
                                referrerPolicy="no-referrer"
                            />
                            <AvatarFallback>
                                {user?.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={8}>
                        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-400"
                            disabled={isPending}
                            onClick={() => logout()}
                        >
                            <LogOut />
                            Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )
}

export default NavBar
