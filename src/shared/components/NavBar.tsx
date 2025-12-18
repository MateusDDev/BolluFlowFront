"use client";

import { LogOut, Moon, Settings, Sun, User } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { SidebarTrigger } from "ui/sidebar";
import { usePathname } from "next/navigation";
import { navItems } from "@/shared/navigation/items";
import ThemeButton from "components/ThemeButton";
import { useLogout } from "@/features/login/hooks/mutations/useLogout";

const NavBar = () => {
  const logout = useLogout();

  const pathname = usePathname();

  const pageName = navItems.find((item) => item.url === pathname)?.title;

  return (
    <nav className="flex items-center justify-between p-4">
      <SidebarTrigger className="text-primary" />

      <h1>{pageName}</h1>

      <div className="flex items-center gap-4">
        <ThemeButton />

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
              <User />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-400" onClick={logout}>
              <LogOut />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavBar;
