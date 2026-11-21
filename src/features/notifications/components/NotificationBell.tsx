'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNowStrict } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Bell, ShoppingBag } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from 'ui/popover'
import { cn } from '@/shared/lib/utils'
import {
    useMarkAllNotificationsAsRead,
    useMarkNotificationAsRead,
    useNotifications,
} from '@/features/notifications/hooks/useNotifications'
import { NotificationModel } from '@/features/notifications/services/notification.model'

function getNotificationLink(notification: NotificationModel) {
    if (notification.type === 'MenuOrderCreated' && notification.referenceId)
        return `/orders/${notification.referenceId}`

    return null
}

function formatRelativeTime(date: string) {
    return formatDistanceToNowStrict(new Date(date), {
        addSuffix: true,
        locale: ptBR,
    })
}

export function NotificationBell() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const { data } = useNotifications()
    const { mutate: markAsRead } = useMarkNotificationAsRead()
    const { mutate: markAllAsRead, isPending: isMarkingAll } =
        useMarkAllNotificationsAsRead()

    const unreadCount = data?.unreadCount ?? 0
    const items = data?.items ?? []

    const handleSelect = (notification: NotificationModel) => {
        if (!notification.isRead) markAsRead(notification.id)

        const link = getNotificationLink(notification)

        setOpen(false)

        if (link) router.push(link)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    aria-label={
                        unreadCount > 0
                            ? `Notificações, ${unreadCount} ${unreadCount === 1 ? 'não lida' : 'não lidas'}`
                            : 'Notificações'
                    }
                    className="relative inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <Bell className="size-5" />
                    {unreadCount > 0 ? (
                        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    ) : null}
                </button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <p className="text-sm font-semibold">Notificações</p>
                    {unreadCount > 0 ? (
                        <button
                            type="button"
                            className="text-xs text-primary hover:underline disabled:opacity-50"
                            disabled={isMarkingAll}
                            onClick={() => markAllAsRead()}
                        >
                            Marcar todas como lidas
                        </button>
                    ) : null}
                </div>

                {items.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                        Nenhuma notificação por enquanto. Pedidos feitos pelo
                        cardápio aparecem aqui.
                    </p>
                ) : (
                    <ul className="max-h-96 overflow-y-auto">
                        {items.map((notification) => (
                            <li key={notification.id}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(notification)}
                                    className={cn(
                                        'flex w-full gap-3 border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-accent',
                                        !notification.isRead && 'bg-primary/5'
                                    )}
                                >
                                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <ShoppingBag className="size-4" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="flex items-start justify-between gap-2">
                                            <span
                                                className={cn(
                                                    'text-sm',
                                                    !notification.isRead &&
                                                        'font-semibold'
                                                )}
                                            >
                                                {notification.title}
                                            </span>
                                            {!notification.isRead ? (
                                                <span
                                                    aria-label="Não lida"
                                                    className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
                                                />
                                            ) : null}
                                        </span>
                                        <span className="block truncate text-xs text-muted-foreground">
                                            {notification.message}
                                        </span>
                                        <span className="mt-0.5 block text-xs text-muted-foreground">
                                            {formatRelativeTime(
                                                notification.createdAt
                                            )}
                                        </span>
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </PopoverContent>
        </Popover>
    )
}
